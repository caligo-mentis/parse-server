"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformQueryInputToParse = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const parseMap = {
  id: 'objectId',
  _or: '$or',
  _and: '$and',
  _nor: '$nor',
  _relatedTo: '$relatedTo',
  _eq: '$eq',
  _ne: '$ne',
  _lt: '$lt',
  _lte: '$lte',
  _gt: '$gt',
  _gte: '$gte',
  _in: '$in',
  _nin: '$nin',
  _exists: '$exists',
  _select: '$select',
  _dontSelect: '$dontSelect',
  _inQuery: '$inQuery',
  _notInQuery: '$notInQuery',
  _containedBy: '$containedBy',
  _all: '$all',
  _regex: '$regex',
  _options: '$options',
  _text: '$text',
  _search: '$search',
  _term: '$term',
  _language: '$language',
  _caseSensitive: '$caseSensitive',
  _diacriticSensitive: '$diacriticSensitive',
  _nearSphere: '$nearSphere',
  _maxDistance: '$maxDistance',
  _maxDistanceInRadians: '$maxDistanceInRadians',
  _maxDistanceInMiles: '$maxDistanceInMiles',
  _maxDistanceInKilometers: '$maxDistanceInKilometers',
  _within: '$within',
  _box: '$box',
  _geoWithin: '$geoWithin',
  _polygon: '$polygon',
  _centerSphere: '$centerSphere',
  _geoIntersects: '$geoIntersects',
  _point: '$point'
};

const transformQueryInputToParse = (constraints, parentFieldName, parentConstraints) => {
  if (!constraints || typeof constraints !== 'object') {
    return;
  }

  Object.keys(constraints).forEach(fieldName => {
    let fieldValue = constraints[fieldName];
    /**
     * If we have a key-value pair, we need to change the way the constraint is structured.
     *
     * Example:
     *   From:
     *   {
     *     "someField": {
     *       "_lt": {
     *         "_key":"foo.bar",
     *         "_value": 100
     *       },
     *       "_gt": {
     *         "_key":"foo.bar",
     *         "_value": 10
     *       }
     *     }
     *   }
     *
     *   To:
     *   {
     *     "someField.foo.bar": {
     *       "$lt": 100,
     *       "$gt": 10
     *      }
     *   }
     */

    if (fieldValue._key && fieldValue._value && parentConstraints && parentFieldName) {
      delete parentConstraints[parentFieldName];
      parentConstraints[`${parentFieldName}.${fieldValue._key}`] = _objectSpread({}, parentConstraints[`${parentFieldName}.${fieldValue._key}`], {
        [parseMap[fieldName]]: fieldValue._value
      });
    } else if (parseMap[fieldName]) {
      delete constraints[fieldName];
      fieldName = parseMap[fieldName];
      constraints[fieldName] = fieldValue;
    }

    switch (fieldName) {
      case '$point':
      case '$nearSphere':
        if (typeof fieldValue === 'object' && !fieldValue.__type) {
          fieldValue.__type = 'GeoPoint';
        }

        break;

      case '$box':
        if (typeof fieldValue === 'object' && fieldValue.bottomLeft && fieldValue.upperRight) {
          fieldValue = [_objectSpread({
            __type: 'GeoPoint'
          }, fieldValue.bottomLeft), _objectSpread({
            __type: 'GeoPoint'
          }, fieldValue.upperRight)];
          constraints[fieldName] = fieldValue;
        }

        break;

      case '$polygon':
        if (fieldValue instanceof Array) {
          fieldValue.forEach(geoPoint => {
            if (typeof geoPoint === 'object' && !geoPoint.__type) {
              geoPoint.__type = 'GeoPoint';
            }
          });
        }

        break;

      case '$centerSphere':
        if (typeof fieldValue === 'object' && fieldValue.center && fieldValue.distance) {
          fieldValue = [_objectSpread({
            __type: 'GeoPoint'
          }, fieldValue.center), fieldValue.distance];
          constraints[fieldName] = fieldValue;
        }

        break;
    }

    if (typeof fieldValue === 'object') {
      transformQueryInputToParse(fieldValue, fieldName, constraints);
    }
  });
};

exports.transformQueryInputToParse = transformQueryInputToParse;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HcmFwaFFML3RyYW5zZm9ybWVycy9xdWVyeS5qcyJdLCJuYW1lcyI6WyJwYXJzZU1hcCIsImlkIiwiX29yIiwiX2FuZCIsIl9ub3IiLCJfcmVsYXRlZFRvIiwiX2VxIiwiX25lIiwiX2x0IiwiX2x0ZSIsIl9ndCIsIl9ndGUiLCJfaW4iLCJfbmluIiwiX2V4aXN0cyIsIl9zZWxlY3QiLCJfZG9udFNlbGVjdCIsIl9pblF1ZXJ5IiwiX25vdEluUXVlcnkiLCJfY29udGFpbmVkQnkiLCJfYWxsIiwiX3JlZ2V4IiwiX29wdGlvbnMiLCJfdGV4dCIsIl9zZWFyY2giLCJfdGVybSIsIl9sYW5ndWFnZSIsIl9jYXNlU2Vuc2l0aXZlIiwiX2RpYWNyaXRpY1NlbnNpdGl2ZSIsIl9uZWFyU3BoZXJlIiwiX21heERpc3RhbmNlIiwiX21heERpc3RhbmNlSW5SYWRpYW5zIiwiX21heERpc3RhbmNlSW5NaWxlcyIsIl9tYXhEaXN0YW5jZUluS2lsb21ldGVycyIsIl93aXRoaW4iLCJfYm94IiwiX2dlb1dpdGhpbiIsIl9wb2x5Z29uIiwiX2NlbnRlclNwaGVyZSIsIl9nZW9JbnRlcnNlY3RzIiwiX3BvaW50IiwidHJhbnNmb3JtUXVlcnlJbnB1dFRvUGFyc2UiLCJjb25zdHJhaW50cyIsInBhcmVudEZpZWxkTmFtZSIsInBhcmVudENvbnN0cmFpbnRzIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJmaWVsZE5hbWUiLCJmaWVsZFZhbHVlIiwiX2tleSIsIl92YWx1ZSIsIl9fdHlwZSIsImJvdHRvbUxlZnQiLCJ1cHBlclJpZ2h0IiwiQXJyYXkiLCJnZW9Qb2ludCIsImNlbnRlciIsImRpc3RhbmNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsTUFBTUEsUUFBUSxHQUFHO0FBQ2ZDLEVBQUFBLEVBQUUsRUFBRSxVQURXO0FBRWZDLEVBQUFBLEdBQUcsRUFBRSxLQUZVO0FBR2ZDLEVBQUFBLElBQUksRUFBRSxNQUhTO0FBSWZDLEVB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QUxBLENBQWI7QUFPQWhCLFVBQUFBLFdBQVcsQ0FBQ00sU0FBRCxDQUFYLEdBQXlCQyxVQUF6QjtBQUNEOztBQUNEO0FBbERKOztBQW9EQSxRQUFJLE9BQU9BLFVBQVAsS0FBc0IsUUFBMUIsRUFBb0M7QUFDbENSLE1BQUFBLDBCQUEwQixDQUFDUSxVQUFELEVBQWFELFNBQWIsRUFBd0JOLFdBQXhCLENBQTFCO0FBQ0Q7QUFDRixHQXBHRDtBQXFHRCxDQTdHRCIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHBhcnNlTWFwID0ge1xuICBpZDogJ29iamVjdElkJyxcbiAgX29yOiAnJG9yJyxcbiAgX2FuZDogJyRhbmQnLFxuICBfbm9yOiAnJG5vcicsXG4gIF9yZWxhdGVkVG86ICckcmVsYXRlZFRvJyxcbiAgX2VxOiAnJGVxJyxcbiAgX25lOiAnJG5lJyxcbiAgX2x0OiAnJGx0JyxcbiAgX2x0ZTogJyRsdGUnLFxuICBfZ3Q6ICckZ3QnLFxuICBfZ3RlOiAnJGd0ZScsXG4gIF9pbjogJyRpbicsXG4gIF9uaW46ICckbmluJyxcbiAgX2V4aXN0czogJyRleGlzdHMnLFxuICBfc2VsZWN0OiAnJHNlbGVjdCcsXG4gIF9kb250U2VsZWN0OiAnJGRvbnRTZWxlY3QnLFxuICBfaW5RdWVyeTogJyRpblF1ZXJ5JyxcbiAgX25vdEluUXVlcnk6ICckbm90SW5RdWVyeScsXG4gIF9jb250YWluZWRCeTogJyRjb250YWluZWRCeScsXG4gIF9hbGw6ICckYWxsJyxcbiAgX3JlZ2V4OiAnJHJlZ2V4JyxcbiAgX29wdGlvbnM6ICckb3B0aW9ucycsXG4gIF90ZXh0OiAnJHRleHQnLFxuICBfc2VhcmNoOiAnJHNlYXJjaCcsXG4gIF90ZXJtOiAnJHRlcm0nLFxuICBfbGFuZ3VhZ2U6ICckbGFuZ3VhZ2UnLFxuICBfY2FzZVNlbnNpdGl2ZTogJyRjYXNlU2Vuc2l0aXZlJyxcbiAgX2RpYWNyaXRpY1NlbnNpdGl2ZTogJyRkaWFjcml0aWNTZW5zaXRpdmUnLFxuICBfbmVhclNwaGVyZTogJyRuZWFyU3BoZXJlJyxcbiAgX21heERpc3RhbmNlOiAnJG1heERpc3RhbmNlJyxcbiAgX21heERpc3RhbmNlSW5SYWRpYW5zOiAnJG1heERpc3RhbmNlSW5SYWRpYW5zJyxcbiAgX21heERpc3RhbmNlSW5NaWxlczogJyRtYXhEaXN0YW5jZUluTWlsZXMnLFxuICBfbWF4RGlzdGFuY2VJbktpbG9tZXRlcnM6ICckbWF4RGlzdGFuY2VJbktpbG9tZXRlcnMnLFxuICBfd2l0aGluOiAnJHdpdGhpbicsXG4gIF9ib3g6ICckYm94JyxcbiAgX2dlb1dpdGhpbjogJyRnZW9XaXRoaW4nLFxuICBfcG9seWdvbjogJyRwb2x5Z29uJyxcbiAgX2NlbnRlclNwaGVyZTogJyRjZW50ZXJTcGhlcmUnLFxuICBfZ2VvSW50ZXJzZWN0czogJyRnZW9JbnRlcnNlY3RzJyxcbiAgX3BvaW50OiAnJHBvaW50Jyxcbn07XG5cbmNvbnN0IHRyYW5zZm9ybVF1ZXJ5SW5wdXRUb1BhcnNlID0gKFxuICBjb25zdHJhaW50cyxcbiAgcGFyZW50RmllbGROYW1lLFxuICBwYXJlbnRDb25zdHJhaW50c1xuKSA9PiB7XG4gIGlmICghY29uc3RyYWludHMgfHwgdHlwZW9mIGNvbnN0cmFpbnRzICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybjtcbiAgfVxuICBPYmplY3Qua2V5cyhjb25zdHJhaW50cykuZm9yRWFjaChmaWVsZE5hbWUgPT4ge1xuICAgIGxldCBmaWVsZFZhbHVlID0gY29uc3RyYWludHNbZmllbGROYW1lXTtcblxuICAgIC8qKlxuICAgICAqIElmIHdlIGhhdmUgYSBrZXktdmFsdWUgcGFpciwgd2UgbmVlZCB0byBjaGFuZ2UgdGhlIHdheSB0aGUgY29uc3RyYWludCBpcyBzdHJ1Y3R1cmVkLlxuICAgICAqXG4gICAgICogRXhhbXBsZTpcbiAgICAgKiAgIEZyb206XG4gICAgICogICB7XG4gICAgICogICAgIFwic29tZUZpZWxkXCI6IHtcbiAgICAgKiAgICAgICBcIl9sdFwiOiB7XG4gICAgICogICAgICAgICBcIl9rZXlcIjpcImZvby5iYXJcIixcbiAgICAgKiAgICAgICAgIFwiX3ZhbHVlXCI6IDEwMFxuICAgICAqICAgICAgIH0sXG4gICAgICogICAgICAgXCJfZ3RcIjoge1xuICAgICAqICAgICAgICAgXCJfa2V5XCI6XCJmb28uYmFyXCIsXG4gICAgICogICAgICAgICBcIl92YWx1ZVwiOiAxMFxuICAgICAqICAgICAgIH1cbiAgICAgKiAgICAgfVxuICAgICAqICAgfVxuICAgICAqXG4gICAgICogICBUbzpcbiAgICAgKiAgIHtcbiAgICAgKiAgICAgXCJzb21lRmllbGQuZm9vLmJhclwiOiB7XG4gICAgICogICAgICAgXCIkbHRcIjogMTAwLFxuICAgICAqICAgICAgIFwiJGd0XCI6IDEwXG4gICAgICogICAgICB9XG4gICAgICogICB9XG4gICAgICovXG4gICAgaWYgKFxuICAgICAgZmllbGRWYWx1ZS5fa2V5ICYmXG4gICAgICBmaWVsZFZhbHVlLl92YWx1ZSAmJlxuICAgICAgcGFyZW50Q29uc3RyYWludHMgJiZcbiAgICAgIHBhcmVudEZpZWxkTmFtZVxuICAgICkge1xuICAgICAgZGVsZXRlIHBhcmVudENvbnN0cmFpbnRzW3BhcmVudEZpZWxkTmFtZV07XG4gICAgICBwYXJlbnRDb25zdHJhaW50c1tgJHtwYXJlbnRGaWVsZE5hbWV9LiR7ZmllbGRWYWx1ZS5fa2V5fWBdID0ge1xuICAgICAgICAuLi5wYXJlbnRDb25zdHJhaW50c1tgJHtwYXJlbnRGaWVsZE5hbWV9LiR7ZmllbGRWYWx1ZS5fa2V5fWBdLFxuICAgICAgICBbcGFyc2VNYXBbZmllbGROYW1lXV06IGZpZWxkVmFsdWUuX3ZhbHVlLFxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHBhcnNlTWFwW2ZpZWxkTmFtZV0pIHtcbiAgICAgIGRlbGV0ZSBjb25zdHJhaW50c1tmaWVsZE5hbWVdO1xuICAgICAgZmllbGROYW1lID0gcGFyc2VNYXBbZmllbGROYW1lXTtcbiAgICAgIGNvbnN0cmFpbnRzW2ZpZWxkTmFtZV0gPSBmaWVsZFZhbHVlO1xuICAgIH1cbiAgICBzd2l0Y2ggKGZpZWxkTmFtZSkge1xuICAgICAgY2FzZSAnJHBvaW50JzpcbiAgICAgIGNhc2UgJyRuZWFyU3BoZXJlJzpcbiAgICAgICAgaWYgKHR5cGVvZiBmaWVsZFZhbHVlID09PSAnb2JqZWN0JyAmJiAhZmllbGRWYWx1ZS5fX3R5cGUpIHtcbiAgICAgICAgICBmaWVsZFZhbHVlLl9fdHlwZSA9ICdHZW9Qb2ludCc7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICckYm94JzpcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHR5cGVvZiBmaWVsZFZhbHVlID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgIGZpZWxkVmFsdWUuYm90dG9tTGVmdCAmJlxuICAgICAgICAgIGZpZWxkVmFsdWUudXBwZXJSaWdodFxuICAgICAgICApIHtcbiAgICAgICAgICBmaWVsZFZhbHVlID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBfX3R5cGU6ICdHZW9Qb2ludCcsXG4gICAgICAgICAgICAgIC4uLmZpZWxkVmFsdWUuYm90dG9tTGVmdCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIF9fdHlwZTogJ0dlb1BvaW50JyxcbiAgICAgICAgICAgICAgLi4uZmllbGRWYWx1ZS51cHBlclJpZ2h0LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdO1xuICAgICAgICAgIGNvbnN0cmFpbnRzW2ZpZWxkTmFtZV0gPSBmaWVsZFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnJHBvbHlnb24nOlxuICAgICAgICBpZiAoZmllbGRWYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgZmllbGRWYWx1ZS5mb3JFYWNoKGdlb1BvaW50ID0+IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZ2VvUG9pbnQgPT09ICdvYmplY3QnICYmICFnZW9Qb2ludC5fX3R5cGUpIHtcbiAgICAgICAgICAgICAgZ2VvUG9pbnQuX190eXBlID0gJ0dlb1BvaW50JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJyRjZW50ZXJTcGhlcmUnOlxuICAgICAgICBpZiAoXG4gICAgICAgICAgdHlwZW9mIGZpZWxkVmFsdWUgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgZmllbGRWYWx1ZS5jZW50ZXIgJiZcbiAgICAgICAgICBmaWVsZFZhbHVlLmRpc3RhbmNlXG4gICAgICAgICkge1xuICAgICAgICAgIGZpZWxkVmFsdWUgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIF9fdHlwZTogJ0dlb1BvaW50JyxcbiAgICAgICAgICAgICAgLi4uZmllbGRWYWx1ZS5jZW50ZXIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZmllbGRWYWx1ZS5kaXN0YW5jZSxcbiAgICAgICAgICBdO1xuICAgICAgICAgIGNvbnN0cmFpbnRzW2ZpZWxkTmFtZV0gPSBmaWVsZFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGZpZWxkVmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICB0cmFuc2Zvcm1RdWVyeUlucHV0VG9QYXJzZShmaWVsZFZhbHVlLCBmaWVsZE5hbWUsIGNvbnN0cmFpbnRzKTtcbiAgICB9XG4gIH0pO1xufTtcblxuZXhwb3J0IHsgdHJhbnNmb3JtUXVlcnlJbnB1dFRvUGFyc2UgfTtcbiJdfQ==