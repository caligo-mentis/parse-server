"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadArrayResult = exports.load = exports.ELEMENT = exports.ARRAY_RESULT = exports.SIGN_UP_RESULT = exports.FIND_RESULT = exports.POLYGON_WHERE_INPUT = exports.GEO_POINT_WHERE_INPUT = exports.FILE_WHERE_INPUT = exports.BYTES_WHERE_INPUT = exports.DATE_WHERE_INPUT = exports.OBJECT_WHERE_INPUT = exports.KEY_VALUE_INPUT = exports.ARRAY_WHERE_INPUT = exports.BOOLEAN_WHERE_INPUT = exports.NUMBER_WHERE_INPUT = exports.STRING_WHERE_INPUT = exports._options = exports._regex = exports._dontSelect = exports._select = exports._exists = exports._nin = exports._in = exports._gte = exports._gt = exports._lte = exports._lt = exports._ne = exports._eq = exports.GEO_INTERSECTS_INPUT = exports.GEO_WITHIN_INPUT = exports.CENTER_SPHERE_INPUT = exports.WITHIN_INPUT = exports.BOX_INPUT = exports.TEXT_INPUT = exports.SEARCH_INPUT = exports.SELECT_INPUT = exports.SUBQUERY_INPUT = exports.COUNT_ATT = exports.LIMIT_ATT = exports.SKIP_ATT = exports.WHERE_ATT = exports.SUBQUERY_READ_PREFERENCE_ATT = exports.INCLUDE_READ_PREFERENCE_ATT = exports.READ_PREFERENCE_ATT = exports.READ_PREFERENCE = exports.INCLUDE_ATT = exports.KEYS_ATT = exports.SESSION_TOKEN_ATT = exports.PARSE_OBJECT = exports.PARSE_OBJECT_FIELDS = exports.UPDATE_RESULT = exports.UPDATE_RESULT_FIELDS = exports.CREATE_RESULT = exports.CREATE_RESULT_FIELDS = exports.INPUT_FIELDS = exports.ACL_ATT = exports.CREATED_AT_ATT = exports.UPDATED_AT_ATT = exports.OBJECT_ID_ATT = exports.FIELDS_ATT = exports.CLASS_NAME_ATT = exports.OBJECT_ID = exports.POLYGON = exports.POLYGON_INPUT = exports.GEO_POINT = exports.GEO_POINT_INPUT = exports.GEO_POINT_FIELDS = exports.FILE_INFO = exports.FILE = exports.parseFileValue = exports.BYTES = exports.DATE = exports.serializeDateIso = exports.parseDateIsoValue = exports.OBJECT = exports.ANY = exports.parseObjectFields = exports.parseListValues = exports.parseValue = exports.parseBooleanValue = exports.parseFloatValue = exports.parseIntValue = exports.parseStringValue = exports.TypeValidationError = void 0;

var _graphql = require("graphql");

var _graphqlUpload = require("graphql-upload");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TypeValidationError extends Error {
  constructor(value, type) {
    super(`${value} is not a valid ${type}`);
  }

}

exports.TypeValidationError = TypeValidationError;

const parseStringValue = value => {
  if (typeof value === 'string') {
    return value;
  }

  throw new TypeValidationError(value, 'String');
};

exports.parseStringValue = parseStringValue;

const parseIntValue = value => {
  if (typeof value === 'string') {
    const int = Number(value);

    if (Number.isInteger(int)) {
      return int;
    }
  }

  throw new TypeValidationError(value, 'Int');
};

exports.parseIntValue = parseIntValue;

const parseFloatValue = value => {
  if (typeof value === 'string') {
    const float = Number(value);

    if (!isNaN(float)) {
      return float;
    }
  }

  throw new TypeValidationError(value, 'Float');
};

exports.parseFloatValue = parseFloatValue;

const parseBooleanValue = value => {
  if (typeof value === 'boolean') {
    return value;
  }

  throw new TypeValidationError(value, 'Boolean');
};

exports.parseBooleanValue = parseBooleanValue;

const parseValue = value => {
  switch (value.kind) {
    case _graphql.Kind.STRING:
      return parseStringValue(value.value);

    case _graphql.Kind.INT:
      return parseIntValue(value.value);

    case _graphql.Kind.FLOAT:
      return parseFloatValue(value.value);

    case _graphql.Kind.BOOLEAN:
      return parseBooleanValue(value.value);

    case _graphql.Kind.LIST:
      return parseListValues(value.values);

    case _graphql.Kind.OBJECT:
      return parseObjectFields(value.fields);

    default:
      return value.value;
  }
};

exports.parseValue = parseValue;

const parseListValues = values => {
  if (Array.isArray(values)) {
    return values.map(value => parseValue(value));
  }

  throw new TypeValidationError(values, 'List');
};

exports.parseListValues = parseListValues;

const parseObjectFields = fields => {
  if (Array.isArray(fields)) {
    return fields.reduce((object, field) => _objectSpread({}, object, {
      [field.name.value]: parseValue(field.value)
    }), {});
  }

  throw new TypeValidationError(fields, 'Object');
};

exports.parseObjectFields = parseObjectFields;
const ANY = new _graphql.GraphQLScalarType({
  name: 'Any',
  description: 'The Any scalar type is used in operations and types that involve any type of value.',
  parseValue: value => value,
  serialize: value => value,
  parseLiteral: ast => parseValue(ast)
});
exports.ANY = ANY;
const OBJECT = new _graphql.GraphQLScalarType({
  name: 'Object',
  description: 'The Object scalar type is used in operations and types that involve objects.',

  parseValue(value) {
    if (typeof value === 'object') {
      return value;
    }

    throw new TypeValidationError(value, 'Object');
  },

  serialize(value) {
    if (typeof value === 'object') {
      return value;
    }

    throw new TypeValidationError(value, 'Object');
  },

  parseLiteral(ast) {
    if (ast.kind === _graphql.Kind.OBJECT) {
      return parseObjectFields(ast.fields);
    }

    throw new TypeValidationError(ast.kind, 'Object');
  }

});
exports.OBJECT = OBJECT;

const parseDateIsoValue = value => {
  if (typeof value === 'string') {
    const date = new Date(value);

    if (!isNaN(date)) {
      return date;
    }
  } else if (value instanceof Date) {
    return value;
  }

  throw new TypeValidationError(value, 'Date');
};

exports.parseDateIsoValue = parseDateIsoValue;

const serializeDateIso = value => {
  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Date) {
    return value.toUTCString();
  }

  throw new TypeValidationError(value, 'Date');
};

exports.serializeDateIso = serializeDateIso;

const parseDateIsoLiteral = ast => {
  if (ast.kind === _graphql.Kind.STRING) {
    return parseDateIsoValue(ast.value);
  }

  throw new TypeValidationError(ast.kind, 'Date');
};

const DATE = new _graphql.GraphQLScalarType({
  name: 'Date',
  description: 'The Date scalar type is used in operations and types that involve dates.',

  parseValue(value) {
    if (typeof value === 'string' || value instanceof Date) {
      return {
        __type: 'Date',
        iso: parseDateIsoValue(value)
      };
    } else if (typeof value === 'object' && value.__type === 'Date' && value.iso) {
      return {
        __type: value.__type,
        iso: parseDateIsoValue(value.iso)
      };
    }

    throw new TypeValidationError(value, 'Date');
  },

  serialize(value) {
    if (typeof value === 'string' || value instanceof Date) {
      return serializeDateIso(value);
    } else if (typeof value === 'object' && value.__type === 'Date' && value.iso) {
      return serializeDateIso(value.iso);
    }

    throw new TypeValidationError(value, 'Date');
  },

  parseLiteral(ast) {
    if (ast.kind === _graphql.Kind.STRING) {
      return {
        __type: 'Date',
        iso: parseDateIsoLiteral(ast)
      };
    } else if (ast.kind === _graphql.Kind.OBJECT) {
      const __type = ast.fields.find(field => field.name.value === '__type');

      const iso = ast.fields.find(field => field.name.value === 'iso');

      if (__type && __type.value && __type.value.value === 'Date' && iso) {
        return {
          __type: __type.value.value,
          iso: parseDateIsoLiteral(iso.value)
        };
      }
    }

    throw new TypeValidationError(ast.kind, 'Date');
  }

});
exports.DATE = DATE;
const BYTES = new _graphql.GraphQLScalarType({
  name: 'Bytes',
  description: 'The Bytes scalar type is used in operations and types that involve base 64 binary data.',

  parseValue(value) {
    if (typeof value === 'string') {
      return {
        __type: 'Bytes',
        base64: value
      };
    } else if (typeof value === 'object' && value.__type === 'Bytes' && typeof value.base64 === 'string') {
      return value;
    }

    throw new TypeValidationError(value, 'Bytes');
  },

  serialize(value) {
    if (typeof value === 'string') {
      return value;
    } else if (typeof value === 'object' && value.__type === 'Bytes' && typeof value.base64 === 'string') {
      return value.base64;
    }

    throw new TypeValidationError(value, 'Bytes');
  },

  parseLiteral(ast) {
    if (ast.kind === _graphql.Kind.STRING) {
      return {
        __type: 'Bytes',
        base64: ast.value
      };
    } else if (ast.kind === _graphql.Kind.OBJECT) {
      const __type = ast.fields.find(field => field.name.value === '__type');

      const base64 = ast.fields.find(field => field.name.value === 'base64');

      if (__type && __type.value && __type.value.value === 'Bytes' && base64 && base64.value && typeof base64.value.value === 'string') {
        return {
          __type: __type.value.value,
          base64: base64.value.value
        };
      }
    }

    throw new TypeValidationError(ast.kind, 'Bytes');
  }

});
exports.BYTES = BYTES;

const parseFileValue = value => {
  if (typeof value === 'string') {
    return {
      __type: 'File',
      name: value
    };
  } else if (typeof value === 'object' && value.__type === 'File' && typeof value.name === 'string' && (value.url === undefined || typeof value.url === 'string')) {
    return value;
  }

  throw new TypeValidationError(value, 'File');
};

exports.parseFileValue = parseFileValue;
const FILE = new _graphql.GraphQLScalarType({
  name: 'File',
  description: 'The File scalar type is used in operations and types that involve files.',
  parseValue: parseFileValue,
  serialize: value => {
    if (typeof value === 'string') {
      return value;
    } else if (typeof value === 'object' && value.__type === 'File' && typeof value.name === 'string' && (value.url === undefined || typeof value.url === 'string')) {
      return value.name;
    }

    throw new TypeValidationError(value, 'File');
  },

  parseLiteral(ast) {
    if (ast.kind === _graphql.Kind.STRING) {
      return parseFileValue(ast.value);
    } else if (ast.kind === _graphql.Kind.OBJECT) {
      const __type = ast.fields.find(field => field.name.value === '__type');

      const name = ast.fields.find(field => field.name.value === 'name');
      const url = ast.fields.find(field => field.name.value === 'url');

      if (__type && __type.value && name && name.value) {
        return parseFileValue({
          __type: __type.value.value,
          name: name.value.value,
          url: url && url.value ? url.value.value : undefined
        });
      }
    }

    throw new TypeValidationError(ast.kind, 'File');
  }

});
exports.FILE = FILE;
const FILE_INFO = new _graphql.GraphQLObjectType({
  name: 'FileInfo',
  description: 'The FileInfo object type is used to return the information about files.',
  fields: {
    name: {
      description: 'This is the file name.',
      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
    },
    url: {
      description: 'This is the url in which the file can be downloaded.',
      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
    }
  }
});
exports.FILE_INFO = FILE_INFO;
const GEO_POINT_FIELDS = {
  latitude: {
    description: 'This is the latitude.',
    type: new _graphql.GraphQLNonNull(_graphql.GraphQLFloat)
  },
  longitude: {
    description: 'This is the longitude.',
    type: new _graphql.GraphQLNonNull(_graphql.GraphQLFloat)
  }
};
exports.GEO_POINT_FIELDS = GEO_POINT_FIELDS;
const GEO_POINT_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'GeoPointInput',
  description: 'The GeoPointInput type is used in operations that involve inputting fields of type geo point.',
  fields: GEO_POINT_FIELDS
});
exports.GEO_POINT_INPUT = GEO_POINT_INPUT;
const GEO_POINT = new _graphql.GraphQLObjectType({
  name: 'GeoPoint',
  description: 'The GeoPoint object type is used to return the information about geo point fields.',
  fields: GEO_POINT_FIELDS
});
exports.GEO_POINT = GEO_POINT;
const POLYGON_INPUT = new _graphql.GraphQLList(new _graphql.GraphQLNonNull(GEO_POINT_INPUT));
exports.POLYGON_INPUT = POLYGON_INPUT;
const POLYGON = new _graphql.GraphQLList(new _graphql.GraphQLNonNull(GEO_POINT));
exports.POLYGON = POLYGON;
const OBJECT_ID = new _graphql.GraphQLNonNull(_graphql.GraphQLID);
exports.OBJECT_ID = OBJECT_ID;
const CLASS_NAME_ATT = {
  description: 'This is the class name of the object.',
  type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
};
exports.CLASS_NAME_ATT = CLASS_NAME_ATT;
const FIELDS_ATT = {
  description: 'These are the fields of the object.',
  type: OBJECT
};
exports.FIELDS_ATT = FIELDS_ATT;
const OBJECT_ID_ATT = {
  description: 'This is the object id.',
  type: OBJECT_ID,
  resolve: ({
    objectId
  }) => objectId
};
exports.OBJECT_ID_ATT = OBJECT_ID_ATT;
const CREATED_AT_ATT = {
  description: 'This is the date in which the object was created.',
  type: new _graphql.GraphQLNonNull(DATE)
};
exports.CREATED_AT_ATT = CREATED_AT_ATT;
const UPDATED_AT_ATT = {
  description: 'This is the date in which the object was las updated.',
  type: new _graphql.GraphQLNonNull(DATE)
};
exports.UPDATED_AT_ATT = UPDATED_AT_ATT;
const ACL_ATT = {
  description: 'This is the access control list of the object.',
  type: OBJECT
};
exports.ACL_ATT = ACL_ATT;
const INPUT_FIELDS = {
  ACL: ACL_ATT
};
exports.INPUT_FIELDS = INPUT_FIELDS;
const CREATE_RESULT_FIELDS = {
  id: OBJECT_ID_ATT,
  createdAt: CREATED_AT_ATT
};
exports.CREATE_RESULT_FIELDS = CREATE_RESULT_FIELDS;
const CREATE_RESULT = new _graphql.GraphQLObjectType({
  name: 'CreateResult',
  description: 'The CreateResult object type is used in the create mutations to return the data of the recent created object.',
  fields: CREATE_RESULT_FIELDS
});
exports.CREATE_RESULT = CREATE_RESULT;
const UPDATE_RESULT_FIELDS = {
  updatedAt: UPDATED_AT_ATT
};
exports.UPDATE_RESULT_FIELDS = UPDATE_RESULT_FIELDS;
const UPDATE_RESULT = new _graphql.GraphQLObjectType({
  name: 'UpdateResult',
  description: 'The UpdateResult object type is used in the update mutations to return the data of the recent updated object.',
  fields: UPDATE_RESULT_FIELDS
});
exports.UPDATE_RESULT = UPDATE_RESULT;

const PARSE_OBJECT_FIELDS = _objectSpread({}, CREATE_RESULT_FIELDS, {}, UPDATE_RESULT_FIELDS, {}, INPUT_FIELDS);

exports.PARSE_OBJECT_FIELDS = PARSE_OBJECT_FIELDS;
const PARSE_OBJECT = new _graphql.GraphQLInterfaceType({
  name: 'ParseObject',
  description: 'The ParseObject interface type is used as a base type for the auto generated object types.',
  fields: PARSE_OBJECT_FIELDS
});
exports.PARSE_OBJECT = PARSE_OBJECT;
const SESSION_TOKEN_ATT = {
  description: 'The user session token',
  type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
};
exports.SESSION_TOKEN_ATT = SESSION_TOKEN_ATT;
const KEYS_ATT = {
  description: 'The keys of the objects that will be returned.',
  type: _graphql.GraphQLString
};
exports.KEYS_ATT = KEYS_ATT;
const INCLUDE_ATT = {
  description: 'The pointers of the objects that will be returned.',
  type: _graphql.GraphQLString
};
exports.INCLUDE_ATT = INCLUDE_ATT;
const READ_PREFERENCE = new _graphql.GraphQLEnumType({
  name: 'ReadPreference',
  description: 'The ReadPreference enum type is used in queries in order to select in which database replica the operation must run.',
  values: {
    PRIMARY: {
      value: 'PRIMARY'
    },
    PRIMARY_PREFERRED: {
      value: 'PRIMARY_PREFERRED'
    },
    SECONDARY: {
      value: 'SECONDARY'
    },
    SECONDARY_PREFERRED: {
      value: 'SECONDARY_PREFERRED'
    },
    NEAREST: {
      value: 'NEAREST'
    }
  }
});
exports.READ_PREFERENCE = READ_PREFERENCE;
const READ_PREFERENCE_ATT = {
  description: 'The read preference for the main query to be executed.',
  type: READ_PREFERENCE
};
exports.READ_PREFERENCE_ATT = READ_PREFERENCE_ATT;
const INCLUDE_READ_PREFERENCE_ATT = {
  description: 'The read preference for the queries to be executed to include fields.',
  type: READ_PREFERENCE
};
exports.INCLUDE_READ_PREFERENCE_ATT = INCLUDE_READ_PREFERENCE_ATT;
const SUBQUERY_READ_PREFERENCE_ATT = {
  description: 'The read preference for the subqueries that may be required.',
  type: READ_PREFERENCE
};
exports.SUBQUERY_READ_PREFERENCE_ATT = SUBQUERY_READ_PREFERENCE_ATT;
const WHERE_ATT = {
  description: 'These are the conditions that the objects need to match in order to be found',
  type: OBJECT
};
exports.WHERE_ATT = WHERE_ATT;
const SKIP_ATT = {
  description: 'This is the number of objects that must be skipped to return.',
  type: _graphql.GraphQLInt
};
exports.SKIP_ATT = SKIP_ATT;
const LIMIT_ATT = {
  description: 'This is the limit number of objects that must be returned.',
  type: _graphql.GraphQLInt
};
exports.LIMIT_ATT = LIMIT_ATT;
const COUNT_ATT = {
  description: 'This is the total matched objecs count that is returned when the count flag is set.',
  type: new _graphql.GraphQLNonNull(_graphql.GraphQLInt)
};
exports.COUNT_ATT = COUNT_ATT;
const SUBQUERY_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'SubqueryInput',
  description: 'The SubqueryInput type is used to specific a different query to a different class.',
  fields: {
    className: CLASS_NAME_ATT,
    where: Object.assign({}, WHERE_ATT, {
      type: new _graphql.GraphQLNonNull(WHERE_ATT.type)
    })
  }
});
exports.SUBQUERY_INPUT = SUBQUERY_INPUT;
const SELECT_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'SelectInput',
  description: 'The SelectInput type is used to specify a $select operation on a constraint.',
  fields: {
    query: {
      description: 'This is the subquery to be executed.',
      type: new _graphql.GraphQLNonNull(SUBQUERY_INPUT)
    },
    key: {
      description: 'This is the key in the result of the subquery that must match (not match) the field.',
      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
    }
  }
});
exports.SELECT_INPUT = SELECT_INPUT;
const SEARCH_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'SearchInput',
  description: 'The SearchInput type is used to specifiy a $search operation on a full text search.',
  fields: {
    _term: {
      description: 'This is the term to be searched.',
      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
    },
    _language: {
      description: 'This is the language to tetermine the list of stop words and the rules for tokenizer.',
      type: _graphql.GraphQLString
    },
    _caseSensitive: {
      description: 'This is the flag to enable or disable case sensitive search.',
      type: _graphql.GraphQLBoolean
    },
    _diacriticSensitive: {
      description: 'This is the flag to enable or disable diacritic sensitive search.',
      type: _graphql.GraphQLBoolean
    }
  }
});
exports.SEARCH_INPUT = SEARCH_INPUT;
const TEXT_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'TextInput',
  description: 'The TextInput type is used to specify a $text operation on a constraint.',
  fields: {
    _search: {
      description: 'This is the search to be executed.',
      type: new _graphql.GraphQLNonNull(SEARCH_INPUT)
    }
  }
});
exports.TEXT_INPUT = TEXT_INPUT;
const BOX_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'BoxInput',
  description: 'The BoxInput type is used to specifiy a $box operation on a within geo query.',
  fields: {
    bottomLeft: {
      description: 'This is the bottom left coordinates of the box.',
      type: new _graphql.GraphQLNonNull(GEO_POINT_INPUT)
    },
    upperRight: {
      description: 'This is the upper right coordinates of the box.',
      type: new _graphql.GraphQLNonNull(GEO_POINT_INPUT)
    }
  }
});
exports.BOX_INPUT = BOX_INPUT;
const WITHIN_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'WithinInput',
  description: 'The WithinInput type is used to specify a $within operation on a constraint.',
  fields: {
    _box: {
      description: 'This is the box to be specified.',
      type: new _graphql.GraphQLNonNull(BOX_INPUT)
    }
  }
});
exports.WITHIN_INPUT = WITHIN_INPUT;
const CENTER_SPHERE_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'CenterSphereInput',
  description: 'The CenterSphereInput type is used to specifiy a $centerSphere operation on a geoWithin query.',
  fields: {
    center: {
      description: 'This is the center of the sphere.',
      type: new _graphql.GraphQLNonNull(GEO_POINT_INPUT)
    },
    distance: {
      description: 'This is the radius of the sphere.',
      type: new _graphql.GraphQLNonNull(_graphql.GraphQLFloat)
    }
  }
});
exports.CENTER_SPHERE_INPUT = CENTER_SPHERE_INPUT;
const GEO_WITHIN_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'GeoWithinInput',
  description: 'The GeoWithinInput type is used to specify a $geoWithin operation on a constraint.',
  fields: {
    _polygon: {
      description: 'This is the polygon to be specified.',
      type: POLYGON_INPUT
    },
    _centerSphere: {
      description: 'This is the sphere to be specified.',
      type: CENTER_SPHERE_INPUT
    }
  }
});
exports.GEO_WITHIN_INPUT = GEO_WITHIN_INPUT;
const GEO_INTERSECTS_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'GeoIntersectsInput',
  description: 'The GeoIntersectsInput type is used to specify a $geoIntersects operation on a constraint.',
  fields: {
    _point: {
      description: 'This is the point to be specified.',
      type: GEO_POINT_INPUT
    }
  }
});
exports.GEO_INTERSECTS_INPUT = GEO_INTERSECTS_INPUT;

const _eq = type => ({
  description: 'This is the $eq operator to specify a constraint to select the objects where the value of a field equals to a specified value.',
  type
});

exports._eq = _eq;

const _ne = type => ({
  description: 'This is the $ne operator to specify a constraint to select the objects where the value of a field do not equal to a specified value.',
  type
});

exports._ne = _ne;

const _lt = type => ({
  description: 'This is the $lt operator to specify a constraint to select the objects where the value of a field is less than a specified value.',
  type
});

exports._lt = _lt;

const _lte = type => ({
  description: 'This is the $lte operator to specify a constraint to select the objects where the value of a field is less than or equal to a specified value.',
  type
});

exports._lte = _lte;

const _gt = type => ({
  description: 'This is the $gt operator to specify a constraint to select the objects where the value of a field is greater than a specified value.',
  type
});

exports._gt = _gt;

const _gte = type => ({
  description: 'This is the $gte operator to specify a constraint to select the objects where the value of a field is greater than or equal to a specified value.',
  type
});

exports._gte = _gte;

const _in = type => ({
  description: 'This is the $in operator to specify a constraint to select the objects where the value of a field equals any value in the specified array.',
  type: new _graphql.GraphQLList(type)
});

exports._in = _in;

const _nin = type => ({
  description: 'This is the $nin operator to specify a constraint to select the objects where the value of a field do not equal any value in the specified array.',
  type: new _graphql.GraphQLList(type)
});

exports._nin = _nin;
const _exists = {
  description: 'This is the $exists operator to specify a constraint to select the objects where a field exists (or do not exist).',
  type: _graphql.GraphQLBoolean
};
exports._exists = _exists;
const _select = {
  description: 'This is the $select operator to specify a constraint to select the objects where a field equals to a key in the result of a different query.',
  type: SELECT_INPUT
};
exports._select = _select;
const _dontSelect = {
  description: 'This is the $dontSelect operator to specify a constraint to select the objects where a field do not equal to a key in the result of a different query.',
  type: SELECT_INPUT
};
exports._dontSelect = _dontSelect;
const _regex = {
  description: 'This is the $regex operator to specify a constraint to select the objects where the value of a field matches a specified regular expression.',
  type: _graphql.GraphQLString
};
exports._regex = _regex;
const _options = {
  description: 'This is the $options operator to specify optional flags (such as "i" and "m") to be added to a $regex operation in the same set of constraints.',
  type: _graphql.GraphQLString
};
exports._options = _options;
const STRING_WHERE_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'StringWhereInput',
  description: 'The StringWhereInput input type is used in operations that involve filtering objects by a field of type String.',
  fields: {
    _eq: _eq(_graphql.GraphQLString),
    _ne: _ne(_graphql.GraphQLString),
    _lt: _lt(_graphql.GraphQLString),
    _lte: _lte(_graphql.GraphQLString),
    _gt: _gt(_graphql.GraphQLString),
    _gte: _gte(_graphql.GraphQLString),
    _in: _in(_graphql.GraphQLString),
    _nin: _nin(_graphql.GraphQLString),
    _exists,
    _select,
    _dontSelect,
    _regex,
    _options,
    _text: {
      description: 'This is the $text operator to specify a full text search constraint.',
      type: TEXT_INPUT
    }
  }
});
exports.STRING_WHERE_INPUT = STRING_WHERE_INPUT;
const NUMBER_WHERE_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'NumberWhereInput',
  description: 'The NumberWhereInput input type is used in operations that involve filtering objects by a field of type Number.',
  fields: {
    _eq: _eq(_graphql.GraphQLFloat),
    _ne: _ne(_graphql.GraphQLFloat),
    _lt: _lt(_graphql.GraphQLFloat),
    _lte: _lte(_graphql.GraphQLFloat),
    _gt: _gt(_graphql.GraphQLFloat),
    _gte: _gte(_graphql.GraphQLFloat),
    _in: _in(_graphql.GraphQLFloat),
    _nin: _nin(_graphql.GraphQLFloat),
    _exists,
    _select,
    _dontSelect
  }
});
exports.NUMBER_WHERE_INPUT = NUMBER_WHERE_INPUT;
const BOOLEAN_WHERE_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'BooleanWhereInput',
  description: 'The BooleanWhereInput input type is used in operations that involve filtering objects by a field of type Boolean.',
  fields: {
    _eq: _eq(_graphql.GraphQLBoolean),
    _ne: _ne(_graphql.GraphQLBoolean),
    _exists,
    _select,
    _dontSelect
  }
});
exports.BOOLEAN_WHERE_INPUT = BOOLEAN_WHERE_INPUT;
const ARRAY_WHERE_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'ArrayWhereInput',
  description: 'The ArrayWhereInput input type is used in operations that involve filtering objects by a field of type Array.',
  fields: {
    _eq: _eq(ANY),
    _ne: _ne(ANY),
    _lt: _lt(ANY),
    _lte: _lte(ANY),
    _gt: _gt(ANY),
    _gte: _gte(ANY),
    _in: _in(ANY),
    _nin: _nin(ANY),
    _exists,
    _select,
    _dontSelect,
    _containedBy: {
      description: 'This is the $containedBy operator to specify a constraint to select the objects where the values of an array field is contained by another specified array.',
      type: new _graphql.GraphQLList(ANY)
    },
    _all: {
      description: 'This is the $all operator to specify a constraint to select the objects where the values of an array field contain all elements of another specified array.',
      type: new _graphql.GraphQLList(ANY)
    }
  }
});
exports.ARRAY_WHERE_INPUT = ARRAY_WHERE_INPUT;
const KEY_VALUE_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'KeyValueInput',
  description: 'An entry from an object, i.e., a pair of key and value.',
  fields: {
    _key: {
      description: 'The key used to retrieve the value of this entry.',
      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
    },
    _value: {
      description: 'The value of the entry. Could be any type of scalar data.',
      type: new _graphql.GraphQLNonNull(ANY)
    }
  }
});
exports.KEY_VALUE_INPUT = KEY_VALUE_INPUT;
const OBJECT_WHERE_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'ObjectWhereInput',
  description: 'The ObjectWhereInput input type is used in operations that involve filtering result by a field of type Object.',
  fields: {
    _eq: _eq(KEY_VALUE_INPUT),
    _ne: _ne(KEY_VALUE_INPUT),
    _in: _in(KEY_VALUE_INPUT),
    _nin: _nin(KEY_VALUE_INPUT),
    _lt: _lt(KEY_VALUE_INPUT),
    _lte: _lte(KEY_VALUE_INPUT),
    _gt: _gt(KEY_VALUE_INPUT),
    _gte: _gte(KEY_VALUE_INPUT),
    _exists,
    _select,
    _dontSelect
  }
});
exports.OBJECT_WHERE_INPUT = OBJECT_WHERE_INPUT;
const DATE_WHERE_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'DateWhereInput',
  description: 'The DateWhereInput input type is used in operations that involve filtering objects by a field of type Date.',
  fields: {
    _eq: _eq(DATE),
    _ne: _ne(DATE),
    _lt: _lt(DATE),
    _lte: _lte(DATE),
    _gt: _gt(DATE),
    _gte: _gte(DATE),
    _in: _in(DATE),
    _nin: _nin(DATE),
    _exists,
    _select,
    _dontSelect
  }
});
exports.DATE_WHERE_INPUT = DATE_WHERE_INPUT;
const BYTES_WHERE_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'BytesWhereInput',
  description: 'The BytesWhereInput input type is used in operations that involve filtering objects by a field of type Bytes.',
  fields: {
    _eq: _eq(BYTES),
    _ne: _ne(BYTES),
    _lt: _lt(BYTES),
    _lte: _lte(BYTES),
    _gt: _gt(BYTES),
    _gte: _gte(BYTES),
    _in: _in(BYTES),
    _nin: _nin(BYTES),
    _exists,
    _select,
    _dontSelect
  }
});
exports.BYTES_WHERE_INPUT = BYTES_WHERE_INPUT;
const FILE_WHERE_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'FileWhereInput',
  description: 'The FileWhereInput input type is used in operations that involve filtering objects by a field of type File.',
  fields: {
    _eq: _eq(FILE),
    _ne: _ne(FILE),
    _lt: _lt(FILE),
    _lte: _lte(FILE),
    _gt: _gt(FILE),
    _gte: _gte(FILE),
    _in: _in(FILE),
    _nin: _nin(FILE),
    _exists,
    _select,
    _dontSelect,
    _regex,
    _options
  }
});
exports.FILE_WHERE_INPUT = FILE_WHERE_INPUT;
const GEO_POINT_WHERE_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'GeoPointWhereInput',
  description: 'The GeoPointWhereInput input type is used in operations that involve filtering objects by a field of type GeoPoint.',
  fields: {
    _exists,
    _nearSphere: {
      description: 'This is the $nearSphere operator to specify a constraint to select the objects where the values of a geo point field is near to another geo point.',
      type: GEO_POINT_INPUT
    },
    _maxDistance: {
      description: 'This is the $maxDistance operator to specify a constraint to select the objects where the values of a geo point field is at a max distance (in radians) from the geo point specified in the $nearSphere operator.',
      type: _graphql.GraphQLFloat
    },
    _maxDistanceInRadians: {
      description: 'This is the $maxDistanceInRadians operator to specify a constraint to select the objects where the values of a geo point field is at a max distance (in radians) from the geo point specified in the $nearSphere operator.',
      type: _graphql.GraphQLFloat
    },
    _maxDistanceInMiles: {
      description: 'This is the $maxDistanceInMiles operator to specify a constraint to select the objects where the values of a geo point field is at a max distance (in miles) from the geo point specified in the $nearSphere operator.',
      type: _graphql.GraphQLFloat
    },
    _maxDistanceInKilometers: {
      description: 'This is the $maxDistanceInKilometers operator to specify a constraint to select the objects where the values of a geo point field is at a max distance (in kilometers) from the geo point specified in the $nearSphere operator.',
      type: _graphql.GraphQLFloat
    },
    _within: {
      description: 'This is the $within operator to specify a constraint to select the objects where the values of a geo point field is within a specified box.',
      type: WITHIN_INPUT
    },
    _geoWithin: {
      description: 'This is the $geoWithin operator to specify a constraint to select the objects where the values of a geo point field is within a specified polygon or sphere.',
      type: GEO_WITHIN_INPUT
    }
  }
});
exports.GEO_POINT_WHERE_INPUT = GEO_POINT_WHERE_INPUT;
const POLYGON_WHERE_INPUT = new _graphql.GraphQLInputObjectType({
  name: 'PolygonWhereInput',
  description: 'The PolygonWhereInput input type is used in operations that involve filtering objects by a field of type Polygon.',
  fields: {
    _exists,
    _geoIntersects: {
      description: 'This is the $geoIntersects operator to specify a constraint to select the objects where the values of a polygon field intersect a specified point.',
      type: GEO_INTERSECTS_INPUT
    }
  }
});
exports.POLYGON_WHERE_INPUT = POLYGON_WHERE_INPUT;
const FIND_RESULT = new _graphql.GraphQLObjectType({
  name: 'FindResult',
  description: 'The FindResult object type is used in the find queries to return the data of the matched objects.',
  fields: {
    results: {
      description: 'This is the objects returned by the query',
      type: new _graphql.GraphQLNonNull(new _graphql.GraphQLList(new _graphql.GraphQLNonNull(OBJECT)))
    },
    count: COUNT_ATT
  }
});
exports.FIND_RESULT = FIND_RESULT;
const SIGN_UP_RESULT = new _graphql.GraphQLObjectType({
  name: 'SignUpResult',
  description: 'The SignUpResult object type is used in the users sign up mutation to return the data of the recent created user.',
  fields: _objectSpread({}, CREATE_RESULT_FIELDS, {
    sessionToken: SESSION_TOKEN_ATT
  })
});
exports.SIGN_UP_RESULT = SIGN_UP_RESULT;
const ELEMENT = new _graphql.GraphQLObjectType({
  name: 'Element',
  description: 'The SignUpResult object type is used in the users sign up mutation to return the data of the recent created user.',
  fields: {
    value: {
      description: 'Return the value of the element in the array',
      type: new _graphql.GraphQLNonNull(ANY)
    }
  }
}); // Default static union type, we update types and resolveType function later

exports.ELEMENT = ELEMENT;
let ARRAY_RESULT;
exports.ARRAY_RESULT = ARRAY_RESULT;

const loadArrayResult = (parseGraphQLSchema, parseClasses) => {
  const classTypes = parseClasses.filter(parseClass => parseGraphQLSchema.parseClassTypes[parseClass.className].classGraphQLOutputType ? true : false).map(parseClass => parseGraphQLSchema.parseClassTypes[parseClass.className].classGraphQLOutputType);
  exports.ARRAY_RESULT = ARRAY_RESULT = new _graphql.GraphQLUnionType({
    name: 'ArrayResult',
    description: 'Use Inline Fragment on Array to get results: https://graphql.org/learn/queries/#inline-fragments',
    types: () => [ELEMENT, ...classTypes],
    resolveType: value => {
      if (value.__type === 'Object' && value.className && value.objectId) {
        if (parseGraphQLSchema.parseClassTypes[value.className]) {
          return parseGraphQLSchema.parseClassTypes[value.className].classGraphQLOutputType;
        } else {
          return ELEMENT;
        }
      } else {
        return ELEMENT;
      }
    }
  });
  parseGraphQLSchema.graphQLTypes.push(ARRAY_RESULT);
};

exports.loadArrayResult = loadArrayResult;

const load = parseGraphQLSchema => {
  parseGraphQLSchema.addGraphQLType(_graphqlUpload.GraphQLUpload, true);
  parseGraphQLSchema.addGraphQLType(ANY, true);
  parseGraphQLSchema.addGraphQLType(OBJECT, true);
  parseGraphQLSchema.addGraphQLType(DATE, true);
  parseGraphQLSchema.addGraphQLType(BYTES, true);
  parseGraphQLSchema.addGraphQLType(FILE, true);
  parseGraphQLSchema.addGraphQLType(FILE_INFO, true);
  parseGraphQLSchema.addGraphQLType(GEO_POINT_INPUT, true);
  parseGraphQLSchema.addGraphQLType(GEO_POINT, true);
  parseGraphQLSchema.addGraphQLType(CREATE_RESULT, true);
  parseGraphQLSchema.addGraphQLType(UPDATE_RESULT, true);
  parseGraphQLSchema.addGraphQLType(PARSE_OBJECT, true);
  parseGraphQLSchema.addGraphQLType(READ_PREFERENCE, true);
  parseGraphQLSchema.addGraphQLType(SUBQUERY_INPUT, true);
  parseGraphQLSchema.addGraphQLType(SELECT_INPUT, true);
  parseGraphQLSchema.addGraphQLType(SEARCH_INPUT, true);
  parseGraphQLSchema.addGraphQLType(TEXT_INPUT, true);
  parseGraphQLSchema.addGraphQLType(BOX_INPUT, true);
  parseGraphQLSchema.addGraphQLType(WITHIN_INPUT, true);
  parseGraphQLSchema.addGraphQLType(CENTER_SPHERE_INPUT, true);
  parseGraphQLSchema.addGraphQLType(GEO_WITHIN_INPUT, true);
  parseGraphQLSchema.addGraphQLType(GEO_INTERSECTS_INPUT, true);
  parseGraphQLSchema.addGraphQLType(STRING_WHERE_INPUT, true);
  parseGraphQLSchema.addGraphQLType(NUMBER_WHERE_INPUT, true);
  parseGraphQLSchema.addGraphQLType(BOOLEAN_WHERE_INPUT, true);
  parseGraphQLSchema.addGraphQLType(ARRAY_WHERE_INPUT, true);
  parseGraphQLSchema.addGraphQLType(KEY_VALUE_INPUT, true);
  parseGraphQLSchema.addGraphQLType(OBJECT_WHERE_INPUT, true);
  parseGraphQLSchema.addGraphQLType(DATE_WHERE_INPUT, true);
  parseGraphQLSchema.addGraphQLType(BYTES_WHERE_INPUT, true);
  parseGraphQLSchema.addGraphQLType(FILE_WHERE_INPUT, true);
  parseGraphQLSchema.addGraphQLType(GEO_POINT_WHERE_INPUT, true);
  parseGraphQLSchema.addGraphQLType(POLYGON_WHERE_INPUT, true);
  parseGraphQLSchema.addGraphQLType(FIND_RESULT, true);
  parseGraphQLSchema.addGraphQLType(SIGN_UP_RESULT, true);
  parseGraphQLSchema.addGraphQLType(ELEMENT, true);
  parseGraphQLSchema.addGraphQLType(OBJECT_ID, true);
};

exports.load = load;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HcmFwaFFML2xvYWRlcnMvZGVmYXVsdEdyYXBoUUxUeXBlcy5qcyJdLCJuYW1lcyI6WyJUeXBlVmFsaWRhdGlvbkVycm9yIiwiRXJyb3IiLCJjb25zdHJ1Y3RvciIsInZhbHVlIiwidHlwZSIsInBhcnNlU3RyaW5nVmFsdWUiLCJwYXJzZUludFZhbHVlIiwiaW50IiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwicGFyc2VGbG9hdFZhbHVlIiwiZmxvYXQiLCJpc05hTiIsInBhcnNlQm9vbGVhblZhbHVlIiwicGFyc2VWYWx1ZSIsImtpbmQiLCJLaW5kIiwiU1RSSU5HIiwiSU5UIiwiRkxPQVQiLCJCT09MRUFOIiwiTElTVCIsInBhcnNlTGlzdFZhbHVlcyIsInZhbHVlcyIsIk9CSkVDVCIsInBhcnNlT2JqZWN0RmllbGRzIiwiZmllbGRzIiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwicmVkdWNlIiwib2JqZWN0IiwiZmllbGQiLCJuYW1lIiwiQU5ZIiwiR3JhcGhRTFNjYWxhclR5cGUiLCJkZXNjcmlwdGlvbiIsInNlcmlhbGl6ZSIsInBhcnNlTGl0ZXJhbCIsImFzdCIsInBhcnNlRGF0ZUlzb1ZhbHVlIiwiZGF0ZSIsIkRhdGUiLCJzZXJpYWxpemVEYXRlSXNvIiwidG9VVENTdHJpbmciLCJwYXJzZURhdGVJc29MaXRlcmFsIiwiREFURSIsIl9fdHlwZSIsImlzbyIsImZpbmQiLCJCWVRFUyIsImJhc2U2NCIsInBhcnNlRmlsZVZhbHVlIiwidXJsIiwidW5kZWZpbmVkIiwiRklMRSIsIkZJTEVfSU5GTyIsIkdyYXBoUUxPYmplY3RUeXBlIiwiR3JhcGhRTE5vbk51bGwiLCJHcmFwaFFMU3RyaW5nIiwiR0VPX1BPSU5UX0ZJRUxEUyIsImxhdGl0dWRlIiwiR3JhcGhRTEZsb2F0IiwibG9uZ2l0dWRlIiwiR0VPX1BPSU5UX0lOUFVUIiwiR3JhcGhRTElucHV0T2JqZWN0VHlwZSIsIkdFT19QT0lOVCIsIlBPTFlHT05fSU5QVVQiLCJHcmFwaFFMTGlzdCIsIlBPTFlHT04iLCJPQkpFQ1RfSUQiLCJHcmFwaFFMSUQiLCJDTEFTU19OQU1FX0FUVCIsIkZJRUxEU19BVFQiLCJPQkpFQ1RfSURfQVRUIiwicmVzb2x2ZSIsIm9iamVjdElkIiwiQ1JFQVRFRF9BVF9BVFQiLCJVUERBVEVEX0FUX0FUVCIsIkFDTF9BVFQiLCJJTlBVVF9GSUVMRFMiLCJBQ0wiLCJDUkVBVEVfUkVTVUxUX0ZJRUxEUyIsImlkIiwiY3JlYXRlZEF0IiwiQ1JFQVRFX1JFU1VMVCIsIlVQREFURV9SRVNVTFRfRklFTERTIiwidXBkYXRlZEF0IiwiVVBEQVRFX1JFU1VMVCIsIlBBUlNFX09CSkVDVF9GSUVMRFMiLCJQQVJTRV9PQkpFQ1QiLCJHcmFwaFFMSW50ZXJmYWNlVHlwZSIsIlNFU1NJT05fVE9LRU5fQVRUIiwiS0VZU19BVFQiLCJJTkNMVURFX0FUVCIsIlJFQURfUFJFRkVSRU5DRSIsIkdyYXBoUUxFbnVtVHlwZSIsIlBSSU1BUlkiLCJQUklNQVJZX1BSRUZFUlJFRCIsIlNFQ09OREFSWSIsIlNFQ09OREFSWV9QUkVGRVJSRUQiLCJORUFSRVNUIiwiUkVBRF9QUkVGRVJFTkNFX0FUVCIsIklOQ0xVREVfUkVBRF9QUkVGRVJFTkNFX0FUVCIsIlNVQlFVRVJZX1JFQURfUFJFRkVSRU5DRV9BVFQiLCJXSEVSRV9BVFQiLCJTS0lQX0FUVCIsIkdyYXBoUUxJbnQiLCJMSU1JVF9BVFQiLCJDT1VOVF9BVFQiLCJTVUJRVUVSWV9JTlBVVCIsImNsYXNzTmFtZSIsIndoZXJlIiwiT2JqZWN0IiwiYXNzaWduIiwiU0VMRUNUX0lOUFVUIiwicXVlcnkiLCJrZXkiLCJTRUFSQ0hfSU5QVVQiLCJfdGVybSIsIl9sYW5ndWFnZSIsIl9jYXNlU2Vuc2l0aXZlIiwiR3JhcGhRTEJvb2xlYW4iLCJfZGlhY3JpdGljU2Vuc2l0aXZlIiwiVEVYVF9JTlBVVCIsIl9zZWFyY2giLCJCT1hfSU5QVVQiLCJib3R0b21MZWZ0IiwidXBwZXJSaWdodCIsIldJVEhJTl9JTlBVVCIsIl9ib3giLCJDRU5URVJfU1BIRVJFX0lOUFVUIiwiY2VudGVyIiwiZGlzdGFuY2UiLCJHRU9fV0lUSElOX0lOUFVUIiwiX3BvbHlnb24iLCJfY2VudGVyU3BoZXJlIiwiR0VPX0lOVEVSU0VDVFNfSU5QVVQiLCJfcG9pbnQiLCJfZXEiLCJfbmUiLCJfbHQiLCJfbHRlIiwiX2d0IiwiX2d0ZSIsIl9pbiIsIl9uaW4iLCJfZXhpc3RzIiwiX3NlbGVjdCIsIl9kb250U2VsZWN0IiwiX3JlZ2V4IiwiX29wdGlvbnMiLCJTVFJJTkdfV0hFUkVfSU5QVVQiLCJfdGV4dCIsIk5VTUJFUl9XSEVSRV9JTlBVVCIsIkJPT0xFQU5fV0hFUkVfSU5QVVQiLCJBUlJBWV9XSEVSRV9JTlBVVCIsIl9jb250YWluZWRCeSIsIl9hbGwiLCJLRVlfVkFMVUVfSU5QVVQiLCJfa2V5IiwiX3ZhbHVlIiwiT0JKRUNUX1dIRVJFX0lOUFVUIiwiREFURV9XSEVSRV9JTlBVVCIsIkJZVEVTX1dIRVJFX0lOUFVUIiwiRklMRV9XSEVSRV9JTlBVVCIsIkdFT19QT0lOVF9XSEVSRV9JTlBVVCIsIl9uZWFyU3BoZXJlIiwiX21heERpc3RhbmNlIiwiX21heERpc3RhbmNlSW5SYWRpYW5zIiwiX21heERpc3RhbmNlSW5NaWxlcyIsIl9tYXhEaXN0YW5jZUluS2lsb21ldGVycyIsIl93aXRoaW4iLCJfZ2VvV2l0aGluIiwiUE9MWUdPTl9XSEVSRV9JTlBVVCIsIl9nZW9JbnRlcnNlY3RzIiwiRklORF9SRVNVTFQiLCJyZXN1bHRzIiwiY291bnQiLCJTSUdOX1VQX1JFU1VMVCIsInNlc3Npb25Ub2tlbiIsIkVMRU1FTlQiLCJBUlJBWV9SRVNVTFQiLCJsb2FkQXJyYXlSZXN1bHQiLCJwYXJzZUdyYXBoUUxTY2hlbWEiLCJwYXJzZUNsYXNzZXMiLCJjbGFzc1R5cGVzIiwiZmlsdGVyIiwicGFyc2VDbGFzcyIsInBhcnNlQ2xhc3NUeXBlcyIsImNsYXNzR3JhcGhRTE91dHB1dFR5cGUiLCJHcmFwaFFMVW5pb25UeXBlIiwidHlwZXMiLCJyZXNvbHZlVHlwZSIs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Q0FtQixFQUFBQSxrQkFBa0IsQ0FBQ2EsY0FBbkIsQ0FBa0MvQixxQkFBbEMsRUFBeUQsSUFBekQ7QUFDQWtCLEVBQUFBLGtCQUFrQixDQUFDYSxjQUFuQixDQUFrQ3ZCLG1CQUFsQyxFQUF1RCxJQUF2RDtBQUNBVSxFQUFBQSxrQkFBa0IsQ0FBQ2EsY0FBbkIsQ0FBa0NyQixXQUFsQyxFQUErQyxJQUEvQztBQUNBUSxFQUFBQSxrQkFBa0IsQ0FBQ2EsY0FBbkIsQ0FBa0NsQixjQUFsQyxFQUFrRCxJQUFsRDtBQUNBSyxFQUFBQSxrQkFBa0IsQ0FBQ2EsY0FBbkIsQ0FBa0NoQixPQUFsQyxFQUEyQyxJQUEzQztBQUNBRyxFQUFBQSxrQkFBa0IsQ0FBQ2EsY0FBbkIsQ0FBa0MvSCxTQUFsQyxFQUE2QyxJQUE3QztBQUNELENBdENEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgS2luZCxcbiAgR3JhcGhRTE5vbk51bGwsXG4gIEdyYXBoUUxTY2FsYXJUeXBlLFxuICBHcmFwaFFMSUQsXG4gIEdyYXBoUUxTdHJpbmcsXG4gIEdyYXBoUUxPYmplY3RUeXBlLFxuICBHcmFwaFFMSW50ZXJmYWNlVHlwZSxcbiAgR3JhcGhRTEVudW1UeXBlLFxuICBHcmFwaFFMSW50LFxuICBHcmFwaFFMRmxvYXQsXG4gIEdyYXBoUUxMaXN0LFxuICBHcmFwaFFMSW5wdXRPYmplY3RUeXBlLFxuICBHcmFwaFFMQm9vbGVhbixcbiAgR3JhcGhRTFVuaW9uVHlwZSxcbn0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgeyBHcmFwaFFMVXBsb2FkIH0gZnJvbSAnZ3JhcGhxbC11cGxvYWQnO1xuXG5jbGFzcyBUeXBlVmFsaWRhdGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3Rvcih2YWx1ZSwgdHlwZSkge1xuICAgIHN1cGVyKGAke3ZhbHVlfSBpcyBub3QgYSB2YWxpZCAke3R5cGV9YCk7XG4gIH1cbn1cblxuY29uc3QgcGFyc2VTdHJpbmdWYWx1ZSA9IHZhbHVlID0+IHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZVZhbGlkYXRpb25FcnJvcih2YWx1ZSwgJ1N0cmluZycpO1xufTtcblxuY29uc3QgcGFyc2VJbnRWYWx1ZSA9IHZhbHVlID0+IHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25zdCBpbnQgPSBOdW1iZXIodmFsdWUpO1xuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGludCkpIHtcbiAgICAgIHJldHVybiBpbnQ7XG4gICAgfVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVWYWxpZGF0aW9uRXJyb3IodmFsdWUsICdJbnQnKTtcbn07XG5cbmNvbnN0IHBhcnNlRmxvYXRWYWx1ZSA9IHZhbHVlID0+IHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25zdCBmbG9hdCA9IE51bWJlcih2YWx1ZSk7XG4gICAgaWYgKCFpc05hTihmbG9hdCkpIHtcbiAgICAgIHJldHVybiBmbG9hdDtcbiAgICB9XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZVZhbGlkYXRpb25FcnJvcih2YWx1ZSwgJ0Zsb2F0Jyk7XG59O1xuXG5jb25zdCBwYXJzZUJvb2xlYW5WYWx1ZSA9IHZhbHVlID0+IHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVWYWxpZGF0aW9uRXJyb3IodmFsdWUsICdCb29sZWFuJyk7XG59O1xuXG5jb25zdCBwYXJzZVZhbHVlID0gdmFsdWUgPT4ge1xuICBzd2l0Y2ggKHZhbHVlLmtpbmQpIHtcbiAgICBjYXNlIEtpbmQuU1RSSU5HOlxuICAgICAgcmV0dXJuIHBhcnNlU3RyaW5nVmFsdWUodmFsdWUudmFsdWUpO1xuXG4gICAgY2FzZSBLaW5kLklOVDpcbiAgICAgIHJldHVybiBwYXJzZUludFZhbHVlKHZhbHVlLnZhbHVlKTtcblxuICAgIGNhc2UgS2luZC5GTE9BVDpcbiAgICAgIHJldHVybiBwYXJzZUZsb2F0VmFsdWUodmFsdWUudmFsdWUpO1xuXG4gICAgY2FzZSBLaW5kLkJPT0xFQU46XG4gICAgICByZXR1cm4gcGFyc2VCb29sZWFuVmFsdWUodmFsdWUudmFsdWUpO1xuXG4gICAgY2FzZSBLaW5kLkxJU1Q6XG4gICAgICByZXR1cm4gcGFyc2VMaXN0VmFsdWVzKHZhbHVlLnZhbHVlcyk7XG5cbiAgICBjYXNlIEtpbmQuT0JKRUNUOlxuICAgICAgcmV0dXJuIHBhcnNlT2JqZWN0RmllbGRzKHZhbHVlLmZpZWxkcyk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHZhbHVlLnZhbHVlO1xuICB9XG59O1xuXG5jb25zdCBwYXJzZUxpc3RWYWx1ZXMgPSB2YWx1ZXMgPT4ge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSB7XG4gICAgcmV0dXJuIHZhbHVlcy5tYXAodmFsdWUgPT4gcGFyc2VWYWx1ZSh2YWx1ZSkpO1xuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVWYWxpZGF0aW9uRXJyb3IodmFsdWVzLCAnTGlzdCcpO1xufTtcblxuY29uc3QgcGFyc2VPYmplY3RGaWVsZHMgPSBmaWVsZHMgPT4ge1xuICBpZiAoQXJyYXkuaXNBcnJheShmaWVsZHMpKSB7XG4gICAgcmV0dXJuIGZpZWxkcy5yZWR1Y2UoXG4gICAgICAob2JqZWN0LCBmaWVsZCkgPT4gKHtcbiAgICAgICAgLi4ub2JqZWN0LFxuICAgICAgICBbZmllbGQubmFtZS52YWx1ZV06IHBhcnNlVmFsdWUoZmllbGQudmFsdWUpLFxuICAgICAgfSksXG4gICAgICB7fVxuICAgICk7XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZVZhbGlkYXRpb25FcnJvcihmaWVsZHMsICdPYmplY3QnKTtcbn07XG5cbmNvbnN0IEFOWSA9IG5ldyBHcmFwaFFMU2NhbGFyVHlwZSh7XG4gIG5hbWU6ICdBbnknLFxuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhlIEFueSBzY2FsYXIgdHlwZSBpcyB1c2VkIGluIG9wZXJhdGlvbnMgYW5kIHR5cGVzIHRoYXQgaW52b2x2ZSBhbnkgdHlwZSBvZiB2YWx1ZS4nLFxuICBwYXJzZVZhbHVlOiB2YWx1ZSA9PiB2YWx1ZSxcbiAgc2VyaWFsaXplOiB2YWx1ZSA9PiB2YWx1ZSxcbiAgcGFyc2VMaXRlcmFsOiBhc3QgPT4gcGFyc2VWYWx1ZShhc3QpLFxufSk7XG5cbmNvbnN0IE9CSkVDVCA9IG5ldyBHcmFwaFFMU2NhbGFyVHlwZSh7XG4gIG5hbWU6ICdPYmplY3QnLFxuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhlIE9iamVjdCBzY2FsYXIgdHlwZSBpcyB1c2VkIGluIG9wZXJhdGlvbnMgYW5kIHR5cGVzIHRoYXQgaW52b2x2ZSBvYmplY3RzLicsXG4gIHBhcnNlVmFsdWUodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBUeXBlVmFsaWRhdGlvbkVycm9yKHZhbHVlLCAnT2JqZWN0Jyk7XG4gIH0sXG4gIHNlcmlhbGl6ZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IFR5cGVWYWxpZGF0aW9uRXJyb3IodmFsdWUsICdPYmplY3QnKTtcbiAgfSxcbiAgcGFyc2VMaXRlcmFsKGFzdCkge1xuICAgIGlmIChhc3Qua2luZCA9PT0gS2luZC5PQkpFQ1QpIHtcbiAgICAgIHJldHVybiBwYXJzZU9iamVjdEZpZWxkcyhhc3QuZmllbGRzKTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgVHlwZVZhbGlkYXRpb25FcnJvcihhc3Qua2luZCwgJ09iamVjdCcpO1xuICB9LFxufSk7XG5cbmNvbnN0IHBhcnNlRGF0ZUlzb1ZhbHVlID0gdmFsdWUgPT4ge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSk7XG4gICAgaWYgKCFpc05hTihkYXRlKSkge1xuICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuICB9IGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlVmFsaWRhdGlvbkVycm9yKHZhbHVlLCAnRGF0ZScpO1xufTtcblxuY29uc3Qgc2VyaWFsaXplRGF0ZUlzbyA9IHZhbHVlID0+IHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHJldHVybiB2YWx1ZS50b1VUQ1N0cmluZygpO1xuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVWYWxpZGF0aW9uRXJyb3IodmFsdWUsICdEYXRlJyk7XG59O1xuXG5jb25zdCBwYXJzZURhdGVJc29MaXRlcmFsID0gYXN0ID0+IHtcbiAgaWYgKGFzdC5raW5kID09PSBLaW5kLlNUUklORykge1xuICAgIHJldHVybiBwYXJzZURhdGVJc29WYWx1ZShhc3QudmFsdWUpO1xuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVWYWxpZGF0aW9uRXJyb3IoYXN0LmtpbmQsICdEYXRlJyk7XG59O1xuXG5jb25zdCBEQVRFID0gbmV3IEdyYXBoUUxTY2FsYXJUeXBlKHtcbiAgbmFtZTogJ0RhdGUnLFxuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhlIERhdGUgc2NhbGFyIHR5cGUgaXMgdXNlZCBpbiBvcGVyYXRpb25zIGFuZCB0eXBlcyB0aGF0IGludm9sdmUgZGF0ZXMuJyxcbiAgcGFyc2VWYWx1ZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX190eXBlOiAnRGF0ZScsXG4gICAgICAgIGlzbzogcGFyc2VEYXRlSXNvVmFsdWUodmFsdWUpLFxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuICAgICAgdmFsdWUuX190eXBlID09PSAnRGF0ZScgJiZcbiAgICAgIHZhbHVlLmlzb1xuICAgICkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX190eXBlOiB2YWx1ZS5fX3R5cGUsXG4gICAgICAgIGlzbzogcGFyc2VEYXRlSXNvVmFsdWUodmFsdWUuaXNvKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IFR5cGVWYWxpZGF0aW9uRXJyb3IodmFsdWUsICdEYXRlJyk7XG4gIH0sXG4gIHNlcmlhbGl6ZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgcmV0dXJuIHNlcmlhbGl6ZURhdGVJc28odmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG4gICAgICB2YWx1ZS5fX3R5cGUgPT09ICdEYXRlJyAmJlxuICAgICAgdmFsdWUuaXNvXG4gICAgKSB7XG4gICAgICByZXR1cm4gc2VyaWFsaXplRGF0ZUlzbyh2YWx1ZS5pc28pO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBUeXBlVmFsaWRhdGlvbkVycm9yKHZhbHVlLCAnRGF0ZScpO1xuICB9LFxuICBwYXJzZUxpdGVyYWwoYXN0KSB7XG4gICAgaWYgKGFzdC5raW5kID09PSBLaW5kLlNUUklORykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX190eXBlOiAnRGF0ZScsXG4gICAgICAgIGlzbzogcGFyc2VEYXRlSXNvTGl0ZXJhbChhc3QpLFxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGFzdC5raW5kID09PSBLaW5kLk9CSkVDVCkge1xuICAgICAgY29uc3QgX190eXBlID0gYXN0LmZpZWxkcy5maW5kKGZpZWxkID0+IGZpZWxkLm5hbWUudmFsdWUgPT09ICdfX3R5cGUnKTtcbiAgICAgIGNvbnN0IGlzbyA9IGFzdC5maWVsZHMuZmluZChmaWVsZCA9PiBmaWVsZC5uYW1lLnZhbHVlID09PSAnaXNvJyk7XG4gICAgICBpZiAoX190eXBlICYmIF9fdHlwZS52YWx1ZSAmJiBfX3R5cGUudmFsdWUudmFsdWUgPT09ICdEYXRlJyAmJiBpc28pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfX3R5cGU6IF9fdHlwZS52YWx1ZS52YWx1ZSxcbiAgICAgICAgICBpc286IHBhcnNlRGF0ZUlzb0xpdGVyYWwoaXNvLnZhbHVlKSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgVHlwZVZhbGlkYXRpb25FcnJvcihhc3Qua2luZCwgJ0RhdGUnKTtcbiAgfSxcbn0pO1xuXG5jb25zdCBCWVRFUyA9IG5ldyBHcmFwaFFMU2NhbGFyVHlwZSh7XG4gIG5hbWU6ICdCeXRlcycsXG4gIGRlc2NyaXB0aW9uOlxuICAgICdUaGUgQnl0ZXMgc2NhbGFyIHR5cGUgaXMgdXNlZCBpbiBvcGVyYXRpb25zIGFuZCB0eXBlcyB0aGF0IGludm9sdmUgYmFzZSA2NCBiaW5hcnkgZGF0YS4nLFxuICBwYXJzZVZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9fdHlwZTogJ0J5dGVzJyxcbiAgICAgICAgYmFzZTY0OiB2YWx1ZSxcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcbiAgICAgIHZhbHVlLl9fdHlwZSA9PT0gJ0J5dGVzJyAmJlxuICAgICAgdHlwZW9mIHZhbHVlLmJhc2U2NCA9PT0gJ3N0cmluZydcbiAgICApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgVHlwZVZhbGlkYXRpb25FcnJvcih2YWx1ZSwgJ0J5dGVzJyk7XG4gIH0sXG4gIHNlcmlhbGl6ZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcbiAgICAgIHZhbHVlLl9fdHlwZSA9PT0gJ0J5dGVzJyAmJlxuICAgICAgdHlwZW9mIHZhbHVlLmJhc2U2NCA9PT0gJ3N0cmluZydcbiAgICApIHtcbiAgICAgIHJldHVybiB2YWx1ZS5iYXNlNjQ7XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IFR5cGVWYWxpZGF0aW9uRXJyb3IodmFsdWUsICdCeXRlcycpO1xuICB9LFxuICBwYXJzZUxpdGVyYWwoYXN0KSB7XG4gICAgaWYgKGFzdC5raW5kID09PSBLaW5kLlNUUklORykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX190eXBlOiAnQnl0ZXMnLFxuICAgICAgICBiYXNlNjQ6IGFzdC52YWx1ZSxcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChhc3Qua2luZCA9PT0gS2luZC5PQkpFQ1QpIHtcbiAgICAgIGNvbnN0IF9fdHlwZSA9IGFzdC5maWVsZHMuZmluZChmaWVsZCA9PiBmaWVsZC5uYW1lLnZhbHVlID09PSAnX190eXBlJyk7XG4gICAgICBjb25zdCBiYXNlNjQgPSBhc3QuZmllbGRzLmZpbmQoZmllbGQgPT4gZmllbGQubmFtZS52YWx1ZSA9PT0gJ2Jhc2U2NCcpO1xuICAgICAgaWYgKFxuICAgICAgICBfX3R5cGUgJiZcbiAgICAgICAgX190eXBlLnZhbHVlICYmXG4gICAgICAgIF9fdHlwZS52YWx1ZS52YWx1ZSA9PT0gJ0J5dGVzJyAmJlxuICAgICAgICBiYXNlNjQgJiZcbiAgICAgICAgYmFzZTY0LnZhbHVlICYmXG4gICAgICAgIHR5cGVvZiBiYXNlNjQudmFsdWUudmFsdWUgPT09ICdzdHJpbmcnXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfX3R5cGU6IF9fdHlwZS52YWx1ZS52YWx1ZSxcbiAgICAgICAgICBiYXNlNjQ6IGJhc2U2NC52YWx1ZS52YWx1ZSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgVHlwZVZhbGlkYXRpb25FcnJvcihhc3Qua2luZCwgJ0J5dGVzJyk7XG4gIH0sXG59KTtcblxuY29uc3QgcGFyc2VGaWxlVmFsdWUgPSB2YWx1ZSA9PiB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIF9fdHlwZTogJ0ZpbGUnLFxuICAgICAgbmFtZTogdmFsdWUsXG4gICAgfTtcbiAgfSBlbHNlIGlmIChcbiAgICB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG4gICAgdmFsdWUuX190eXBlID09PSAnRmlsZScgJiZcbiAgICB0eXBlb2YgdmFsdWUubmFtZSA9PT0gJ3N0cmluZycgJiZcbiAgICAodmFsdWUudXJsID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIHZhbHVlLnVybCA9PT0gJ3N0cmluZycpXG4gICkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlVmFsaWRhdGlvbkVycm9yKHZhbHVlLCAnRmlsZScpO1xufTtcblxuY29uc3QgRklMRSA9IG5ldyBHcmFwaFFMU2NhbGFyVHlwZSh7XG4gIG5hbWU6ICdGaWxlJyxcbiAgZGVzY3JpcHRpb246XG4gICAgJ1RoZSBGaWxlIHNjYWxhciB0eXBlIGlzIHVzZWQgaW4gb3BlcmF0aW9ucyBhbmQgdHlwZXMgdGhhdCBpbnZvbHZlIGZpbGVzLicsXG4gIHBhcnNlVmFsdWU6IHBhcnNlRmlsZVZhbHVlLFxuICBzZXJpYWxpemU6IHZhbHVlID0+IHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG4gICAgICB2YWx1ZS5fX3R5cGUgPT09ICdGaWxlJyAmJlxuICAgICAgdHlwZW9mIHZhbHVlLm5hbWUgPT09ICdzdHJpbmcnICYmXG4gICAgICAodmFsdWUudXJsID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIHZhbHVlLnVybCA9PT0gJ3N0cmluZycpXG4gICAgKSB7XG4gICAgICByZXR1cm4gdmFsdWUubmFtZTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgVHlwZVZhbGlkYXRpb25FcnJvcih2YWx1ZSwgJ0ZpbGUnKTtcbiAgfSxcbiAgcGFyc2VMaXRlcmFsKGFzdCkge1xuICAgIGlmIChhc3Qua2luZCA9PT0gS2luZC5TVFJJTkcpIHtcbiAgICAgIHJldHVybiBwYXJzZUZpbGVWYWx1ZShhc3QudmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoYXN0LmtpbmQgPT09IEtpbmQuT0JKRUNUKSB7XG4gICAgICBjb25zdCBfX3R5cGUgPSBhc3QuZmllbGRzLmZpbmQoZmllbGQgPT4gZmllbGQubmFtZS52YWx1ZSA9PT0gJ19fdHlwZScpO1xuICAgICAgY29uc3QgbmFtZSA9IGFzdC5maWVsZHMuZmluZChmaWVsZCA9PiBmaWVsZC5uYW1lLnZhbHVlID09PSAnbmFtZScpO1xuICAgICAgY29uc3QgdXJsID0gYXN0LmZpZWxkcy5maW5kKGZpZWxkID0+IGZpZWxkLm5hbWUudmFsdWUgPT09ICd1cmwnKTtcbiAgICAgIGlmIChfX3R5cGUgJiYgX190eXBlLnZhbHVlICYmIG5hbWUgJiYgbmFtZS52YWx1ZSkge1xuICAgICAgICByZXR1cm4gcGFyc2VGaWxlVmFsdWUoe1xuICAgICAgICAgIF9fdHlwZTogX190eXBlLnZhbHVlLnZhbHVlLFxuICAgICAgICAgIG5hbWU6IG5hbWUudmFsdWUudmFsdWUsXG4gICAgICAgICAgdXJsOiB1cmwgJiYgdXJsLnZhbHVlID8gdXJsLnZhbHVlLnZhbHVlIDogdW5kZWZpbmVkLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgVHlwZVZhbGlkYXRpb25FcnJvcihhc3Qua2luZCwgJ0ZpbGUnKTtcbiAgfSxcbn0pO1xuXG5jb25zdCBGSUxFX0lORk8gPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xuICBuYW1lOiAnRmlsZUluZm8nLFxuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhlIEZpbGVJbmZvIG9iamVjdCB0eXBlIGlzIHVzZWQgdG8gcmV0dXJuIHRoZSBpbmZvcm1hdGlvbiBhYm91dCBmaWxlcy4nLFxuICBmaWVsZHM6IHtcbiAgICBuYW1lOiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgdGhlIGZpbGUgbmFtZS4nLFxuICAgICAgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKEdyYXBoUUxTdHJpbmcpLFxuICAgIH0sXG4gICAgdXJsOiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgdGhlIHVybCBpbiB3aGljaCB0aGUgZmlsZSBjYW4gYmUgZG93bmxvYWRlZC4nLFxuICAgICAgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKEdyYXBoUUxTdHJpbmcpLFxuICAgIH0sXG4gIH0sXG59KTtcblxuY29uc3QgR0VPX1BPSU5UX0ZJRUxEUyA9IHtcbiAgbGF0aXR1ZGU6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgdGhlIGxhdGl0dWRlLicsXG4gICAgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKEdyYXBoUUxGbG9hdCksXG4gIH0sXG4gIGxvbmdpdHVkZToge1xuICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyB0aGUgbG9uZ2l0dWRlLicsXG4gICAgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKEdyYXBoUUxGbG9hdCksXG4gIH0sXG59O1xuXG5jb25zdCBHRU9fUE9JTlRfSU5QVVQgPSBuZXcgR3JhcGhRTElucHV0T2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdHZW9Qb2ludElucHV0JyxcbiAgZGVzY3JpcHRpb246XG4gICAgJ1RoZSBHZW9Qb2ludElucHV0IHR5cGUgaXMgdXNlZCBpbiBvcGVyYXRpb25zIHRoYXQgaW52b2x2ZSBpbnB1dHRpbmcgZmllbGRzIG9mIHR5cGUgZ2VvIHBvaW50LicsXG4gIGZpZWxkczogR0VPX1BPSU5UX0ZJRUxEUyxcbn0pO1xuXG5jb25zdCBHRU9fUE9JTlQgPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xuICBuYW1lOiAnR2VvUG9pbnQnLFxuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhlIEdlb1BvaW50IG9iamVjdCB0eXBlIGlzIHVzZWQgdG8gcmV0dXJuIHRoZSBpbmZvcm1hdGlvbiBhYm91dCBnZW8gcG9pbnQgZmllbGRzLicsXG4gIGZpZWxkczogR0VPX1BPSU5UX0ZJRUxEUyxcbn0pO1xuXG5jb25zdCBQT0xZR09OX0lOUFVUID0gbmV3IEdyYXBoUUxMaXN0KG5ldyBHcmFwaFFMTm9uTnVsbChHRU9fUE9JTlRfSU5QVVQpKTtcblxuY29uc3QgUE9MWUdPTiA9IG5ldyBHcmFwaFFMTGlzdChuZXcgR3JhcGhRTE5vbk51bGwoR0VPX1BPSU5UKSk7XG5cbmNvbnN0IE9CSkVDVF9JRCA9IG5ldyBHcmFwaFFMTm9uTnVsbChHcmFwaFFMSUQpO1xuXG5jb25zdCBDTEFTU19OQU1FX0FUVCA9IHtcbiAgZGVzY3JpcHRpb246ICdUaGlzIGlzIHRoZSBjbGFzcyBuYW1lIG9mIHRoZSBvYmplY3QuJyxcbiAgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKEdyYXBoUUxTdHJpbmcpLFxufTtcblxuY29uc3QgRklFTERTX0FUVCA9IHtcbiAgZGVzY3JpcHRpb246ICdUaGVzZSBhcmUgdGhlIGZpZWxkcyBvZiB0aGUgb2JqZWN0LicsXG4gIHR5cGU6IE9CSkVDVCxcbn07XG5cbmNvbnN0IE9CSkVDVF9JRF9BVFQgPSB7XG4gIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyB0aGUgb2JqZWN0IGlkLicsXG4gIHR5cGU6IE9CSkVDVF9JRCxcbiAgcmVzb2x2ZTogKHsgb2JqZWN0SWQgfSkgPT4gb2JqZWN0SWQsXG59O1xuXG5jb25zdCBDUkVBVEVEX0FUX0FUVCA9IHtcbiAgZGVzY3JpcHRpb246ICdUaGlzIGlzIHRoZSBkYXRlIGluIHdoaWNoIHRoZSBvYmplY3Qgd2FzIGNyZWF0ZWQuJyxcbiAgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKERBVEUpLFxufTtcblxuY29uc3QgVVBEQVRFRF9BVF9BVFQgPSB7XG4gIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyB0aGUgZGF0ZSBpbiB3aGljaCB0aGUgb2JqZWN0IHdhcyBsYXMgdXBkYXRlZC4nLFxuICB0eXBlOiBuZXcgR3JhcGhRTE5vbk51bGwoREFURSksXG59O1xuXG5jb25zdCBBQ0xfQVRUID0ge1xuICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgdGhlIGFjY2VzcyBjb250cm9sIGxpc3Qgb2YgdGhlIG9iamVjdC4nLFxuICB0eXBlOiBPQkpFQ1QsXG59O1xuXG5jb25zdCBJTlBVVF9GSUVMRFMgPSB7XG4gIEFDTDogQUNMX0FUVCxcbn07XG5cbmNvbnN0IENSRUFURV9SRVNVTFRfRklFTERTID0ge1xuICBpZDogT0JKRUNUX0lEX0FUVCxcbiAgY3JlYXRlZEF0OiBDUkVBVEVEX0FUX0FUVCxcbn07XG5cbmNvbnN0IENSRUFURV9SRVNVTFQgPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xuICBuYW1lOiAnQ3JlYXRlUmVzdWx0JyxcbiAgZGVzY3JpcHRpb246XG4gICAgJ1RoZSBDcmVhdGVSZXN1bHQgb2JqZWN0IHR5cGUgaXMgdXNlZCBpbiB0aGUgY3JlYXRlIG11dGF0aW9ucyB0byByZXR1cm4gdGhlIGRhdGEgb2YgdGhlIHJlY2VudCBjcmVhdGVkIG9iamVjdC4nLFxuICBmaWVsZHM6IENSRUFURV9SRVNVTFRfRklFTERTLFxufSk7XG5cbmNvbnN0IFVQREFURV9SRVNVTFRfRklFTERTID0ge1xuICB1cGRhdGVkQXQ6IFVQREFURURfQVRfQVRULFxufTtcblxuY29uc3QgVVBEQVRFX1JFU1VMVCA9IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdVcGRhdGVSZXN1bHQnLFxuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhlIFVwZGF0ZVJlc3VsdCBvYmplY3QgdHlwZSBpcyB1c2VkIGluIHRoZSB1cGRhdGUgbXV0YXRpb25zIHRvIHJldHVybiB0aGUgZGF0YSBvZiB0aGUgcmVjZW50IHVwZGF0ZWQgb2JqZWN0LicsXG4gIGZpZWxkczogVVBEQVRFX1JFU1VMVF9GSUVMRFMsXG59KTtcblxuY29uc3QgUEFSU0VfT0JKRUNUX0ZJRUxEUyA9IHtcbiAgLi4uQ1JFQVRFX1JFU1VMVF9GSUVMRFMsXG4gIC4uLlVQREFURV9SRVNVTFRfRklFTERTLFxuICAuLi5JTlBVVF9GSUVMRFMsXG59O1xuXG5jb25zdCBQQVJTRV9PQkpFQ1QgPSBuZXcgR3JhcGhRTEludGVyZmFjZVR5cGUoe1xuICBuYW1lOiAnUGFyc2VPYmplY3QnLFxuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhlIFBhcnNlT2JqZWN0IGludGVyZmFjZSB0eXBlIGlzIHVzZWQgYXMgYSBiYXNlIHR5cGUgZm9yIHRoZSBhdXRvIGdlbmVyYXRlZCBvYmplY3QgdHlwZXMuJyxcbiAgZmllbGRzOiBQQVJTRV9PQkpFQ1RfRklFTERTLFxufSk7XG5cbmNvbnN0IFNFU1NJT05fVE9LRU5fQVRUID0ge1xuICBkZXNjcmlwdGlvbjogJ1RoZSB1c2VyIHNlc3Npb24gdG9rZW4nLFxuICB0eXBlOiBuZXcgR3JhcGhRTE5vbk51bGwoR3JhcGhRTFN0cmluZyksXG59O1xuXG5jb25zdCBLRVlTX0FUVCA9IHtcbiAgZGVzY3JpcHRpb246ICdUaGUga2V5cyBvZiB0aGUgb2JqZWN0cyB0aGF0IHdpbGwgYmUgcmV0dXJuZWQuJyxcbiAgdHlwZTogR3JhcGhRTFN0cmluZyxcbn07XG5cbmNvbnN0IElOQ0xVREVfQVRUID0ge1xuICBkZXNjcmlwdGlvbjogJ1RoZSBwb2ludGVycyBvZiB0aGUgb2JqZWN0cyB0aGF0IHdpbGwgYmUgcmV0dXJuZWQuJyxcbiAgdHlwZTogR3JhcGhRTFN0cmluZyxcbn07XG5cbmNvbnN0IFJFQURfUFJFRkVSRU5DRSA9IG5ldyBHcmFwaFFMRW51bVR5cGUoe1xuICBuYW1lOiAnUmVhZFByZWZlcmVuY2UnLFxuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhlIFJlYWRQcmVmZXJlbmNlIGVudW0gdHlwZSBpcyB1c2VkIGluIHF1ZXJpZXMgaW4gb3JkZXIgdG8gc2VsZWN0IGluIHdoaWNoIGRhdGFiYXNlIHJlcGxpY2EgdGhlIG9wZXJhdGlvbiBtdXN0IHJ1bi4nLFxuICB2YWx1ZXM6IHtcbiAgICBQUklNQVJZOiB7IHZhbHVlOiAnUFJJTUFSWScgfSxcbiAgICBQUklNQVJZX1BSRUZFUlJFRDogeyB2YWx1ZTogJ1BSSU1BUllfUFJFRkVSUkVEJyB9LFxuICAgIFNFQ09OREFSWTogeyB2YWx1ZTogJ1NFQ09OREFSWScgfSxcbiAgICBTRUNPTkRBUllfUFJFRkVSUkVEOiB7IHZhbHVlOiAnU0VDT05EQVJZX1BSRUZFUlJFRCcgfSxcbiAgICBORUFSRVNUOiB7IHZhbHVlOiAnTkVBUkVTVCcgfSxcbiAgfSxcbn0pO1xuXG5jb25zdCBSRUFEX1BSRUZFUkVOQ0VfQVRUID0ge1xuICBkZXNjcmlwdGlvbjogJ1RoZSByZWFkIHByZWZlcmVuY2UgZm9yIHRoZSBtYWluIHF1ZXJ5IHRvIGJlIGV4ZWN1dGVkLicsXG4gIHR5cGU6IFJFQURfUFJFRkVSRU5DRSxcbn07XG5cbmNvbnN0IElOQ0xVREVfUkVBRF9QUkVGRVJFTkNFX0FUVCA9IHtcbiAgZGVzY3JpcHRpb246XG4gICAgJ1RoZSByZWFkIHByZWZlcmVuY2UgZm9yIHRoZSBxdWVyaWVzIHRvIGJlIGV4ZWN1dGVkIHRvIGluY2x1ZGUgZmllbGRzLicsXG4gIHR5cGU6IFJFQURfUFJFRkVSRU5DRSxcbn07XG5cbmNvbnN0IFNVQlFVRVJZX1JFQURfUFJFRkVSRU5DRV9BVFQgPSB7XG4gIGRlc2NyaXB0aW9uOiAnVGhlIHJlYWQgcHJlZmVyZW5jZSBmb3IgdGhlIHN1YnF1ZXJpZXMgdGhhdCBtYXkgYmUgcmVxdWlyZWQuJyxcbiAgdHlwZTogUkVBRF9QUkVGRVJFTkNFLFxufTtcblxuY29uc3QgV0hFUkVfQVRUID0ge1xuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhlc2UgYXJlIHRoZSBjb25kaXRpb25zIHRoYXQgdGhlIG9iamVjdHMgbmVlZCB0byBtYXRjaCBpbiBvcmRlciB0byBiZSBmb3VuZCcsXG4gIHR5cGU6IE9CSkVDVCxcbn07XG5cbmNvbnN0IFNLSVBfQVRUID0ge1xuICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgdGhlIG51bWJlciBvZiBvYmplY3RzIHRoYXQgbXVzdCBiZSBza2lwcGVkIHRvIHJldHVybi4nLFxuICB0eXBlOiBHcmFwaFFMSW50LFxufTtcblxuY29uc3QgTElNSVRfQVRUID0ge1xuICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgdGhlIGxpbWl0IG51bWJlciBvZiBvYmplY3RzIHRoYXQgbXVzdCBiZSByZXR1cm5lZC4nLFxuICB0eXBlOiBHcmFwaFFMSW50LFxufTtcblxuY29uc3QgQ09VTlRfQVRUID0ge1xuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhpcyBpcyB0aGUgdG90YWwgbWF0Y2hlZCBvYmplY3MgY291bnQgdGhhdCBpcyByZXR1cm5lZCB3aGVuIHRoZSBjb3VudCBmbGFnIGlzIHNldC4nLFxuICB0eXBlOiBuZXcgR3JhcGhRTE5vbk51bGwoR3JhcGhRTEludCksXG59O1xuXG5jb25zdCBTVUJRVUVSWV9JTlBVVCA9IG5ldyBHcmFwaFFMSW5wdXRPYmplY3RUeXBlKHtcbiAgbmFtZTogJ1N1YnF1ZXJ5SW5wdXQnLFxuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhlIFN1YnF1ZXJ5SW5wdXQgdHlwZSBpcyB1c2VkIHRvIHNwZWNpZmljIGEgZGlmZmVyZW50IHF1ZXJ5IHRvIGEgZGlmZmVyZW50IGNsYXNzLicsXG4gIGZpZWxkczoge1xuICAgIGNsYXNzTmFtZTogQ0xBU1NfTkFNRV9BVFQsXG4gICAgd2hlcmU6IE9iamVjdC5hc3NpZ24oe30sIFdIRVJFX0FUVCwge1xuICAgICAgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKFdIRVJFX0FUVC50eXBlKSxcbiAgICB9KSxcbiAgfSxcbn0pO1xuXG5jb25zdCBTRUxFQ1RfSU5QVVQgPSBuZXcgR3JhcGhRTElucHV0T2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdTZWxlY3RJbnB1dCcsXG4gIGRlc2NyaXB0aW9uOlxuICAgICdUaGUgU2VsZWN0SW5wdXQgdHlwZSBpcyB1c2VkIHRvIHNwZWNpZnkgYSAkc2VsZWN0IG9wZXJhdGlvbiBvbiBhIGNvbnN0cmFpbnQuJyxcbiAgZmllbGRzOiB7XG4gICAgcXVlcnk6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyB0aGUgc3VicXVlcnkgdG8gYmUgZXhlY3V0ZWQuJyxcbiAgICAgIHR5cGU6IG5ldyBHcmFwaFFMTm9uTnVsbChTVUJRVUVSWV9JTlBVVCksXG4gICAgfSxcbiAgICBrZXk6IHtcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAnVGhpcyBpcyB0aGUga2V5IGluIHRoZSByZXN1bHQgb2YgdGhlIHN1YnF1ZXJ5IHRoYXQgbXVzdCBtYXRjaCAobm90IG1hdGNoKSB0aGUgZmllbGQuJyxcbiAgICAgIHR5cGU6IG5ldyBHcmFwaFFMTm9uTnVsbChHcmFwaFFMU3RyaW5nKSxcbiAgICB9LFxuICB9LFxufSk7XG5cbmNvbnN0IFNFQVJDSF9JTlBVVCA9IG5ldyBHcmFwaFFMSW5wdXRPYmplY3RUeXBlKHtcbiAgbmFtZTogJ1NlYXJjaElucHV0JyxcbiAgZGVzY3JpcHRpb246XG4gICAgJ1RoZSBTZWFyY2hJbnB1dCB0eXBlIGlzIHVzZWQgdG8gc3BlY2lmaXkgYSAkc2VhcmNoIG9wZXJhdGlvbiBvbiBhIGZ1bGwgdGV4dCBzZWFyY2guJyxcbiAgZmllbGRzOiB7XG4gICAgX3Rlcm06IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyB0aGUgdGVybSB0byBiZSBzZWFyY2hlZC4nLFxuICAgICAgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKEdyYXBoUUxTdHJpbmcpLFxuICAgIH0sXG4gICAgX2xhbmd1YWdlOiB7XG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgJ1RoaXMgaXMgdGhlIGxhbmd1YWdlIHRvIHRldGVybWluZSB0aGUgbGlzdCBvZiBzdG9wIHdvcmRzIGFuZCB0aGUgcnVsZXMgZm9yIHRva2VuaXplci4nLFxuICAgICAgdHlwZTogR3JhcGhRTFN0cmluZyxcbiAgICB9LFxuICAgIF9jYXNlU2Vuc2l0aXZlOiB7XG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgJ1RoaXMgaXMgdGhlIGZsYWcgdG8gZW5hYmxlIG9yIGRpc2FibGUgY2FzZSBzZW5zaXRpdmUgc2VhcmNoLicsXG4gICAgICB0eXBlOiBHcmFwaFFMQm9vbGVhbixcbiAgICB9LFxuICAgIF9kaWFjcml0aWNTZW5zaXRpdmU6IHtcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAnVGhpcyBpcyB0aGUgZmxhZyB0byBlbmFibGUgb3IgZGlzYWJsZSBkaWFjcml0aWMgc2Vuc2l0aXZlIHNlYXJjaC4nLFxuICAgICAgdHlwZTogR3JhcGhRTEJvb2xlYW4sXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5jb25zdCBURVhUX0lOUFVUID0gbmV3IEdyYXBoUUxJbnB1dE9iamVjdFR5cGUoe1xuICBuYW1lOiAnVGV4dElucHV0JyxcbiAgZGVzY3JpcHRpb246XG4gICAgJ1RoZSBUZXh0SW5wdXQgdHlwZSBpcyB1c2VkIHRvIHNwZWNpZnkgYSAkdGV4dCBvcGVyYXRpb24gb24gYSBjb25zdHJhaW50LicsXG4gIGZpZWxkczoge1xuICAgIF9zZWFyY2g6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyB0aGUgc2VhcmNoIHRvIGJlIGV4ZWN1dGVkLicsXG4gICAgICB0eXBlOiBuZXcgR3JhcGhRTE5vbk51bGwoU0VBUkNIX0lOUFVUKSxcbiAgICB9LFxuICB9LFxufSk7XG5cbmNvbnN0IEJPWF9JTlBVVCA9IG5ldyBHcmFwaFFMSW5wdXRPYmplY3RUeXBlKHtcbiAgbmFtZTogJ0JveElucHV0JyxcbiAgZGVzY3JpcHRpb246XG4gICAgJ1RoZSBCb3hJbnB1dCB0eXBlIGlzIHVzZWQgdG8gc3BlY2lmaXkgYSAkYm94IG9wZXJhdGlvbiBvbiBhIHdpdGhpbiBnZW8gcXVlcnkuJyxcbiAgZmllbGRzOiB7XG4gICAgYm90dG9tTGVmdDoge1xuICAgICAgZGVzY3JpcHRpb246ICdUaGlzIGlzIHRoZSBib3R0b20gbGVmdCBjb29yZGluYXRlcyBvZiB0aGUgYm94LicsXG4gICAgICB0eXBlOiBuZXcgR3JhcGhRTE5vbk51bGwoR0VPX1BPSU5UX0lOUFVUKSxcbiAgICB9LFxuICAgIHVwcGVyUmlnaHQ6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyB0aGUgdXBwZXIgcmlnaHQgY29vcmRpbmF0ZXMgb2YgdGhlIGJveC4nLFxuICAgICAgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKEdFT19QT0lOVF9JTlBVVCksXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5jb25zdCBXSVRISU5fSU5QVVQgPSBuZXcgR3JhcGhRTElucHV0T2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdXaXRoaW5JbnB1dCcsXG4gIGRlc2NyaXB0aW9uOlxuICAgICdUaGUgV2l0aGluSW5wdXQgdHlwZSBpcyB1c2VkIHRvIHNwZWNpZnkgYSAkd2l0aGluIG9wZXJhdGlvbiBvbiBhIGNvbnN0cmFpbnQuJyxcbiAgZmllbGRzOiB7XG4gICAgX2JveDoge1xuICAgICAgZGVzY3JpcHRpb246ICdUaGlzIGlzIHRoZSBib3ggdG8gYmUgc3BlY2lmaWVkLicsXG4gICAgICB0eXBlOiBuZXcgR3JhcGhRTE5vbk51bGwoQk9YX0lOUFVUKSxcbiAgICB9LFxuICB9LFxufSk7XG5cbmNvbnN0IENFTlRFUl9TUEhFUkVfSU5QVVQgPSBuZXcgR3JhcGhRTElucHV0T2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdDZW50ZXJTcGhlcmVJbnB1dCcsXG4gIGRlc2NyaXB0aW9uOlxuICAgICdUaGUgQ2VudGVyU3BoZXJlSW5wdXQgdHlwZSBpcyB1c2VkIHRvIHNwZWNpZml5IGEgJGNlbnRlclNwaGVyZSBvcGVyYXRpb24gb24gYSBnZW9XaXRoaW4gcXVlcnkuJyxcbiAgZmllbGRzOiB7XG4gICAgY2VudGVyOiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgdGhlIGNlbnRlciBvZiB0aGUgc3BoZXJlLicsXG4gICAgICB0eXBlOiBuZXcgR3JhcGhRTE5vbk51bGwoR0VPX1BPSU5UX0lOUFVUKSxcbiAgICB9LFxuICAgIGRpc3RhbmNlOiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgdGhlIHJhZGl1cyBvZiB0aGUgc3BoZXJlLicsXG4gICAgICB0eXBlOiBuZXcgR3JhcGhRTE5vbk51bGwoR3JhcGhRTEZsb2F0KSxcbiAgICB9LFxuICB9LFxufSk7XG5cbmNvbnN0IEdFT19XSVRISU5fSU5QVVQgPSBuZXcgR3JhcGhRTElucHV0T2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdHZW9XaXRoaW5JbnB1dCcsXG4gIGRlc2NyaXB0aW9uOlxuICAgICdUaGUgR2VvV2l0aGluSW5wdXQgdHlwZSBpcyB1c2VkIHRvIHNwZWNpZnkgYSAkZ2VvV2l0aGluIG9wZXJhdGlvbiBvbiBhIGNvbnN0cmFpbnQuJyxcbiAgZmllbGRzOiB7XG4gICAgX3BvbHlnb246IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyB0aGUgcG9seWdvbiB0byBiZSBzcGVjaWZpZWQuJyxcbiAgICAgIHR5cGU6IFBPTFlHT05fSU5QVVQsXG4gICAgfSxcbiAgICBfY2VudGVyU3BoZXJlOiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgdGhlIHNwaGVyZSB0byBiZSBzcGVjaWZpZWQuJyxcbiAgICAgIHR5cGU6IENFTlRFUl9TUEhFUkVfSU5QVVQsXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5jb25zdCBHRU9fSU5URVJTRUNUU19JTlBVVCA9IG5ldyBHcmFwaFFMSW5wdXRPYmplY3RUeXBlKHtcbiAgbmFtZTogJ0dlb0ludGVyc2VjdHNJbnB1dCcsXG4gIGRlc2NyaXB0aW9uOlxuICAgICdUaGUgR2VvSW50ZXJzZWN0c0lucHV0IHR5cGUgaXMgdXNlZCB0byBzcGVjaWZ5IGEgJGdlb0ludGVyc2VjdHMgb3BlcmF0aW9uIG9uIGEgY29uc3RyYWludC4nLFxuICBmaWVsZHM6IHtcbiAgICBfcG9pbnQ6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyB0aGUgcG9pbnQgdG8gYmUgc3BlY2lmaWVkLicsXG4gICAgICB0eXBlOiBHRU9fUE9JTlRfSU5QVVQsXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5jb25zdCBfZXEgPSB0eXBlID0+ICh7XG4gIGRlc2NyaXB0aW9uOlxuICAgICdUaGlzIGlzIHRoZSAkZXEgb3BlcmF0b3IgdG8gc3BlY2lmeSBhIGNvbnN0cmFpbnQgdG8gc2VsZWN0IHRoZSBvYmplY3RzIHdoZXJlIHRoZSB2YWx1ZSBvZiBhIGZpZWxkIGVxdWFscyB0byBhIHNwZWNpZmllZCB2YWx1ZS4nLFxuICB0eXBlLFxufSk7XG5cbmNvbnN0IF9uZSA9IHR5cGUgPT4gKHtcbiAgZGVzY3JpcHRpb246XG4gICAgJ1RoaXMgaXMgdGhlICRuZSBvcGVyYXRvciB0byBzcGVjaWZ5IGEgY29uc3RyYWludCB0byBzZWxlY3QgdGhlIG9iamVjdHMgd2hlcmUgdGhlIHZhbHVlIG9mIGEgZmllbGQgZG8gbm90IGVxdWFsIHRvIGEgc3BlY2lmaWVkIHZhbHVlLicsXG4gIHR5cGUsXG59KTtcblxuY29uc3QgX2x0ID0gdHlwZSA9PiAoe1xuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhpcyBpcyB0aGUgJGx0IG9wZXJhdG9yIHRvIHNwZWNpZnkgYSBjb25zdHJhaW50IHRvIHNlbGVjdCB0aGUgb2JqZWN0cyB3aGVyZSB0aGUgdmFsdWUgb2YgYSBmaWVsZCBpcyBsZXNzIHRoYW4gYSBzcGVjaWZpZWQgdmFsdWUuJyxcbiAgdHlwZSxcbn0pO1xuXG5jb25zdCBfbHRlID0gdHlwZSA9PiAoe1xuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhpcyBpcyB0aGUgJGx0ZSBvcGVyYXRvciB0byBzcGVjaWZ5IGEgY29uc3RyYWludCB0byBzZWxlY3QgdGhlIG9iamVjdHMgd2hlcmUgdGhlIHZhbHVlIG9mIGEgZmllbGQgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGEgc3BlY2lmaWVkIHZhbHVlLicsXG4gIHR5cGUsXG59KTtcblxuY29uc3QgX2d0ID0gdHlwZSA9PiAoe1xuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhpcyBpcyB0aGUgJGd0IG9wZXJhdG9yIHRvIHNwZWNpZnkgYSBjb25zdHJhaW50IHRvIHNlbGVjdCB0aGUgb2JqZWN0cyB3aGVyZSB0aGUgdmFsdWUgb2YgYSBmaWVsZCBpcyBncmVhdGVyIHRoYW4gYSBzcGVjaWZpZWQgdmFsdWUuJyxcbiAgdHlwZSxcbn0pO1xuXG5jb25zdCBfZ3RlID0gdHlwZSA9PiAoe1xuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhpcyBpcyB0aGUgJGd0ZSBvcGVyYXRvciB0byBzcGVjaWZ5IGEgY29uc3RyYWludCB0byBzZWxlY3QgdGhlIG9iamVjdHMgd2hlcmUgdGhlIHZhbHVlIG9mIGEgZmllbGQgaXMgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIGEgc3BlY2lmaWVkIHZhbHVlLicsXG4gIHR5cGUsXG59KTtcblxuY29uc3QgX2luID0gdHlwZSA9PiAoe1xuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhpcyBpcyB0aGUgJGluIG9wZXJhdG9yIHRvIHNwZWNpZnkgYSBjb25zdHJhaW50IHRvIHNlbGVjdCB0aGUgb2JqZWN0cyB3aGVyZSB0aGUgdmFsdWUgb2YgYSBmaWVsZCBlcXVhbHMgYW55IHZhbHVlIGluIHRoZSBzcGVjaWZpZWQgYXJyYXkuJyxcbiAgdHlwZTogbmV3IEdyYXBoUUxMaXN0KHR5cGUpLFxufSk7XG5cbmNvbnN0IF9uaW4gPSB0eXBlID0+ICh7XG4gIGRlc2NyaXB0aW9uOlxuICAgICdUaGlzIGlzIHRoZSAkbmluIG9wZXJhdG9yIHRvIHNwZWNpZnkgYSBjb25zdHJhaW50IHRvIHNlbGVjdCB0aGUgb2JqZWN0cyB3aGVyZSB0aGUgdmFsdWUgb2YgYSBmaWVsZCBkbyBub3QgZXF1YWwgYW55IHZhbHVlIGluIHRoZSBzcGVjaWZpZWQgYXJyYXkuJyxcbiAgdHlwZTogbmV3IEdyYXBoUUxMaXN0KHR5cGUpLFxufSk7XG5cbmNvbnN0IF9leGlzdHMgPSB7XG4gIGRlc2NyaXB0aW9uOlxuICAgICdUaGlzIGlzIHRoZSAkZXhpc3RzIG9wZXJhdG9yIHRvIHNwZWNpZnkgYSBjb25zdHJhaW50IHRvIHNlbGVjdCB0aGUgb2JqZWN0cyB3aGVyZSBhIGZpZWxkIGV4aXN0cyAob3IgZG8gbm90IGV4aXN0KS4nLFxuICB0eXBlOiBHcmFwaFFMQm9vbGVhbixcbn07XG5cbmNvbnN0IF9zZWxlY3QgPSB7XG4gIGRlc2NyaXB0aW9uOlxuICAgICdUaGlzIGlzIHRoZSAkc2VsZWN0IG9wZXJhdG9yIHRvIHNwZWNpZnkgYSBjb25zdHJhaW50IHRvIHNlbGVjdCB0aGUgb2JqZWN0cyB3aGVyZSBhIGZpZWxkIGVxdWFscyB0byBhIGtleSBpbiB0aGUgcmVzdWx0IG9mIGEgZGlmZmVyZW50IHF1ZXJ5LicsXG4gIHR5cGU6IFNFTEVDVF9JTlBVVCxcbn07XG5cbmNvbnN0IF9kb250U2VsZWN0ID0ge1xuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhpcyBpcyB0aGUgJGRvbnRTZWxlY3Qgb3BlcmF0b3IgdG8gc3BlY2lmeSBhIGNvbnN0cmFpbnQgdG8gc2VsZWN0IHRoZSBvYmplY3RzIHdoZXJlIGEgZmllbGQgZG8gbm90IGVxdWFsIHRvIGEga2V5IGluIHRoZSByZXN1bHQgb2YgYSBkaWZmZXJlbnQgcXVlcnkuJyxcbiAgdHlwZTogU0VMRUNUX0lOUFVULFxufTtcblxuY29uc3QgX3JlZ2V4ID0ge1xuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhpcyBpcyB0aGUgJHJlZ2V4IG9wZXJhdG9yIHRvIHNwZWNpZnkgYSBjb25zdHJhaW50IHRvIHNlbGVjdCB0aGUgb2JqZWN0cyB3aGVyZSB0aGUgdmFsdWUgb2YgYSBmaWVsZCBtYXRjaGVzIGEgc3BlY2lmaWVkIHJlZ3VsYXIgZXhwcmVzc2lvbi4nLFxuICB0eXBlOiBHcmFwaFFMU3RyaW5nLFxufTtcblxuY29uc3QgX29wdGlvbnMgPSB7XG4gIGRlc2NyaXB0aW9uOlxuICAgICdUaGlzIGlzIHRoZSAkb3B0aW9ucyBvcGVyYXRvciB0byBzcGVjaWZ5IG9wdGlvbmFsIGZsYWdzIChzdWNoIGFzIFwiaVwiIGFuZCBcIm1cIikgdG8gYmUgYWRkZWQgdG8gYSAkcmVnZXggb3BlcmF0aW9uIGluIHRoZSBzYW1lIHNldCBvZiBjb25zdHJhaW50cy4nLFxuICB0eXBlOiBHcmFwaFFMU3RyaW5nLFxufTtcblxuY29uc3QgU1RSSU5HX1dIRVJFX0lOUFVUID0gbmV3IEdyYXBoUUxJbnB1dE9iamVjdFR5cGUoe1xuICBuYW1lOiAnU3RyaW5nV2hlcmVJbnB1dCcsXG4gIGRlc2NyaXB0aW9uOlxuICAgICdUaGUgU3RyaW5nV2hlcmVJbnB1dCBpbnB1dCB0eXBlIGlzIHVzZWQgaW4gb3BlcmF0aW9ucyB0aGF0IGludm9sdmUgZmlsdGVyaW5nIG9iamVjdHMgYnkgYSBmaWVsZCBvZiB0eXBlIFN0cmluZy4nLFxuICBmaWVsZHM6IHtcbiAgICBfZXE6IF9lcShHcmFwaFFMU3RyaW5nKSxcbiAgICBfbmU6IF9uZShHcmFwaFFMU3RyaW5nKSxcbiAgICBfbHQ6IF9sdChHcmFwaFFMU3RyaW5nKSxcbiAgICBfbHRlOiBfbHRlKEdyYXBoUUxTdHJpbmcpLFxuICAgIF9ndDogX2d0KEdyYXBoUUxTdHJpbmcpLFxuICAgIF9ndGU6IF9ndGUoR3JhcGhRTFN0cmluZyksXG4gICAgX2luOiBfaW4oR3JhcGhRTFN0cmluZyksXG4gICAgX25pbjogX25pbihHcmFwaFFMU3RyaW5nKSxcbiAgICBfZXhpc3RzLFxuICAgIF9zZWxlY3QsXG4gICAgX2RvbnRTZWxlY3QsXG4gICAgX3JlZ2V4LFxuICAgIF9vcHRpb25zLFxuICAgIF90ZXh0OiB7XG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgJ1RoaXMgaXMgdGhlICR0ZXh0IG9wZXJhdG9yIHRvIHNwZWNpZnkgYSBmdWxsIHRleHQgc2VhcmNoIGNvbnN0cmFpbnQuJyxcbiAgICAgIHR5cGU6IFRFWFRfSU5QVVQsXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5jb25zdCBOVU1CRVJfV0hFUkVfSU5QVVQgPSBuZXcgR3JhcGhRTElucHV0T2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdOdW1iZXJXaGVyZUlucHV0JyxcbiAgZGVzY3JpcHRpb246XG4gICAgJ1RoZSBOdW1iZXJXaGVyZUlucHV0IGlucHV0IHR5cGUgaXMgdXNlZCBpbiBvcGVyYXRpb25zIHRoYXQgaW52b2x2ZSBmaWx0ZXJpbmcgb2JqZWN0cyBieSBhIGZpZWxkIG9mIHR5cGUgTnVtYmVyLicsXG4gIGZpZWxkczoge1xuICAgIF9lcTogX2VxKEdyYXBoUUxGbG9hdCksXG4gICAgX25lOiBfbmUoR3JhcGhRTEZsb2F0KSxcbiAgICBfbHQ6IF9sdChHcmFwaFFMRmxvYXQpLFxuICAgIF9sdGU6IF9sdGUoR3JhcGhRTEZsb2F0KSxcbiAgICBfZ3Q6IF9ndChHcmFwaFFMRmxvYXQpLFxuICAgIF9ndGU6IF9ndGUoR3JhcGhRTEZsb2F0KSxcbiAgICBfaW46IF9pbihHcmFwaFFMRmxvYXQpLFxuICAgIF9uaW46IF9uaW4oR3JhcGhRTEZsb2F0KSxcbiAgICBfZXhpc3RzLFxuICAgIF9zZWxlY3QsXG4gICAgX2RvbnRTZWxlY3QsXG4gIH0sXG59KTtcblxuY29uc3QgQk9PTEVBTl9XSEVSRV9JTlBVVCA9IG5ldyBHcmFwaFFMSW5wdXRPYmplY3RUeXBlKHtcbiAgbmFtZTogJ0Jvb2xlYW5XaGVyZUlucHV0JyxcbiAgZGVzY3JpcHRpb246XG4gICAgJ1RoZSBCb29sZWFuV2hlcmVJbnB1dCBpbnB1dCB0eXBlIGlzIHVzZWQgaW4gb3BlcmF0aW9ucyB0aGF0IGludm9sdmUgZmlsdGVyaW5nIG9iamVjdHMgYnkgYSBmaWVsZCBvZiB0eXBlIEJvb2xlYW4uJyxcbiAgZmllbGRzOiB7XG4gICAgX2VxOiBfZXEoR3JhcGhRTEJvb2xlYW4pLFxuICAgIF9uZTogX25lKEdyYXBoUUxCb29sZWFuKSxcbiAgICBfZXhpc3RzLFxuICAgIF9zZWxlY3QsXG4gICAgX2RvbnRTZWxlY3QsXG4gIH0sXG59KTtcblxuY29uc3QgQVJSQVlfV0hFUkVfSU5QVVQgPSBuZXcgR3JhcGhRTElucHV0T2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdBcnJheVdoZXJlSW5wdXQnLFxuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhlIEFycmF5V2hlcmVJbnB1dCBpbnB1dCB0eXBlIGlzIHVzZWQgaW4gb3BlcmF0aW9ucyB0aGF0IGludm9sdmUgZmlsdGVyaW5nIG9iamVjdHMgYnkgYSBmaWVsZCBvZiB0eXBlIEFycmF5LicsXG4gIGZpZWxkczoge1xuICAgIF9lcTogX2VxKEFOWSksXG4gICAgX25lOiBfbmUoQU5ZKSxcbiAgICBfbHQ6IF9sdChBTlkpLFxuICAgIF9sdGU6IF9sdGUoQU5ZKSxcbiAgICBfZ3Q6IF9ndChBTlkpLFxuICAgIF9ndGU6IF9ndGUoQU5ZKSxcbiAgICBfaW46IF9pbihBTlkpLFxuICAgIF9uaW46IF9uaW4oQU5ZKSxcbiAgICBfZXhpc3RzLFxuICAgIF9zZWxlY3QsXG4gICAgX2RvbnRTZWxlY3QsXG4gICAgX2NvbnRhaW5lZEJ5OiB7XG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgJ1RoaXMgaXMgdGhlICRjb250YWluZWRCeSBvcGVyYXRvciB0byBzcGVjaWZ5IGEgY29uc3RyYWludCB0byBzZWxlY3QgdGhlIG9iamVjdHMgd2hlcmUgdGhlIHZhbHVlcyBvZiBhbiBhcnJheSBmaWVsZCBpcyBjb250YWluZWQgYnkgYW5vdGhlciBzcGVjaWZpZWQgYXJyYXkuJyxcbiAgICAgIHR5cGU6IG5ldyBHcmFwaFFMTGlzdChBTlkpLFxuICAgIH0sXG4gICAgX2FsbDoge1xuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICdUaGlzIGlzIHRoZSAkYWxsIG9wZXJhdG9yIHRvIHNwZWNpZnkgYSBjb25zdHJhaW50IHRvIHNlbGVjdCB0aGUgb2JqZWN0cyB3aGVyZSB0aGUgdmFsdWVzIG9mIGFuIGFycmF5IGZpZWxkIGNvbnRhaW4gYWxsIGVsZW1lbnRzIG9mIGFub3RoZXIgc3BlY2lmaWVkIGFycmF5LicsXG4gICAgICB0eXBlOiBuZXcgR3JhcGhRTExpc3QoQU5ZKSxcbiAgICB9LFxuICB9LFxufSk7XG5cbmNvbnN0IEtFWV9WQUxVRV9JTlBVVCA9IG5ldyBHcmFwaFFMSW5wdXRPYmplY3RUeXBlKHtcbiAgbmFtZTogJ0tleVZhbHVlSW5wdXQnLFxuICBkZXNjcmlwdGlvbjogJ0FuIGVudHJ5IGZyb20gYW4gb2JqZWN0LCBpLmUuLCBhIHBhaXIgb2Yga2V5IGFuZCB2YWx1ZS4nLFxuICBmaWVsZHM6IHtcbiAgICBfa2V5OiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBrZXkgdXNlZCB0byByZXRyaWV2ZSB0aGUgdmFsdWUgb2YgdGhpcyBlbnRyeS4nLFxuICAgICAgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKEdyYXBoUUxTdHJpbmcpLFxuICAgIH0sXG4gICAgX3ZhbHVlOiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSB2YWx1ZSBvZiB0aGUgZW50cnkuIENvdWxkIGJlIGFueSB0eXBlIG9mIHNjYWxhciBkYXRhLicsXG4gICAgICB0eXBlOiBuZXcgR3JhcGhRTE5vbk51bGwoQU5ZKSxcbiAgICB9LFxuICB9LFxufSk7XG5cbmNvbnN0IE9CSkVDVF9XSEVSRV9JTlBVVCA9IG5ldyBHcmFwaFFMSW5wdXRPYmplY3RUeXBlKHtcbiAgbmFtZTogJ09iamVjdFdoZXJlSW5wdXQnLFxuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhlIE9iamVjdFdoZXJlSW5wdXQgaW5wdXQgdHlwZSBpcyB1c2VkIGluIG9wZXJhdGlvbnMgdGhhdCBpbnZvbHZlIGZpbHRlcmluZyByZXN1bHQgYnkgYSBmaWVsZCBvZiB0eXBlIE9iamVjdC4nLFxuICBmaWVsZHM6IHtcbiAgICBfZXE6IF9lcShLRVlfVkFMVUVfSU5QVVQpLFxuICAgIF9uZTogX25lKEtFWV9WQUxVRV9JTlBVVCksXG4gICAgX2luOiBfaW4oS0VZX1ZBTFVFX0lOUFVUKSxcbiAgICBfbmluOiBfbmluKEtFWV9WQUxVRV9JTlBVVCksXG4gICAgX2x0OiBfbHQoS0VZX1ZBTFVFX0lOUFVUKSxcbiAgICBfbHRlOiBfbHRlKEtFWV9WQUxVRV9JTlBVVCksXG4gICAgX2d0OiBfZ3QoS0VZX1ZBTFVFX0lOUFVUKSxcbiAgICBfZ3RlOiBfZ3RlKEtFWV9WQUxVRV9JTlBVVCksXG4gICAgX2V4aXN0cyxcbiAgICBfc2VsZWN0LFxuICAgIF9kb250U2VsZWN0LFxuICB9LFxufSk7XG5cbmNvbnN0IERBVEVfV0hFUkVfSU5QVVQgPSBuZXcgR3JhcGhRTElucHV0T2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdEYXRlV2hlcmVJbnB1dCcsXG4gIGRlc2NyaXB0aW9uOlxuICAgICdUaGUgRGF0ZVdoZXJlSW5wdXQgaW5wdXQgdHlwZSBpcyB1c2VkIGluIG9wZXJhdGlvbnMgdGhhdCBpbnZvbHZlIGZpbHRlcmluZyBvYmplY3RzIGJ5IGEgZmllbGQgb2YgdHlwZSBEYXRlLicsXG4gIGZpZWxkczoge1xuICAgIF9lcTogX2VxKERBVEUpLFxuICAgIF9uZTogX25lKERBVEUpLFxuICAgIF9sdDogX2x0KERBVEUpLFxuICAgIF9sdGU6IF9sdGUoREFURSksXG4gICAgX2d0OiBfZ3QoREFURSksXG4gICAgX2d0ZTogX2d0ZShEQVRFKSxcbiAgICBfaW46IF9pbihEQVRFKSxcbiAgICBfbmluOiBfbmluKERBVEUpLFxuICAgIF9leGlzdHMsXG4gICAgX3NlbGVjdCxcbiAgICBfZG9udFNlbGVjdCxcbiAgfSxcbn0pO1xuXG5jb25zdCBCWVRFU19XSEVSRV9JTlBVVCA9IG5ldyBHcmFwaFFMSW5wdXRPYmplY3RUeXBlKHtcbiAgbmFtZTogJ0J5dGVzV2hlcmVJbnB1dCcsXG4gIGRlc2NyaXB0aW9uOlxuICAgICdUaGUgQnl0ZXNXaGVyZUlucHV0IGlucHV0IHR5cGUgaXMgdXNlZCBpbiBvcGVyYXRpb25zIHRoYXQgaW52b2x2ZSBmaWx0ZXJpbmcgb2JqZWN0cyBieSBhIGZpZWxkIG9mIHR5cGUgQnl0ZXMuJyxcbiAgZmllbGRzOiB7XG4gICAgX2VxOiBfZXEoQllURVMpLFxuICAgIF9uZTogX25lKEJZVEVTKSxcbiAgICBfbHQ6IF9sdChCWVRFUyksXG4gICAgX2x0ZTogX2x0ZShCWVRFUyksXG4gICAgX2d0OiBfZ3QoQllURVMpLFxuICAgIF9ndGU6IF9ndGUoQllURVMpLFxuICAgIF9pbjogX2luKEJZVEVTKSxcbiAgICBfbmluOiBfbmluKEJZVEVTKSxcbiAgICBfZXhpc3RzLFxuICAgIF9zZWxlY3QsXG4gICAgX2RvbnRTZWxlY3QsXG4gIH0sXG59KTtcblxuY29uc3QgRklMRV9XSEVSRV9JTlBVVCA9IG5ldyBHcmFwaFFMSW5wdXRPYmplY3RUeXBlKHtcbiAgbmFtZTogJ0ZpbGVXaGVyZUlucHV0JyxcbiAgZGVzY3JpcHRpb246XG4gICAgJ1RoZSBGaWxlV2hlcmVJbnB1dCBpbnB1dCB0eXBlIGlzIHVzZWQgaW4gb3BlcmF0aW9ucyB0aGF0IGludm9sdmUgZmlsdGVyaW5nIG9iamVjdHMgYnkgYSBmaWVsZCBvZiB0eXBlIEZpbGUuJyxcbiAgZmllbGRzOiB7XG4gICAgX2VxOiBfZXEoRklMRSksXG4gICAgX25lOiBfbmUoRklMRSksXG4gICAgX2x0OiBfbHQoRklMRSksXG4gICAgX2x0ZTogX2x0ZShGSUxFKSxcbiAgICBfZ3Q6IF9ndChGSUxFKSxcbiAgICBfZ3RlOiBfZ3RlKEZJTEUpLFxuICAgIF9pbjogX2luKEZJTEUpLFxuICAgIF9uaW46IF9uaW4oRklMRSksXG4gICAgX2V4aXN0cyxcbiAgICBfc2VsZWN0LFxuICAgIF9kb250U2VsZWN0LFxuICAgIF9yZWdleCxcbiAgICBfb3B0aW9ucyxcbiAgfSxcbn0pO1xuXG5jb25zdCBHRU9fUE9JTlRfV0hFUkVfSU5QVVQgPSBuZXcgR3JhcGhRTElucHV0T2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdHZW9Qb2ludFdoZXJlSW5wdXQnLFxuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhlIEdlb1BvaW50V2hlcmVJbnB1dCBpbnB1dCB0eXBlIGlzIHVzZWQgaW4gb3BlcmF0aW9ucyB0aGF0IGludm9sdmUgZmlsdGVyaW5nIG9iamVjdHMgYnkgYSBmaWVsZCBvZiB0eXBlIEdlb1BvaW50LicsXG4gIGZpZWxkczoge1xuICAgIF9leGlzdHMsXG4gICAgX25lYXJTcGhlcmU6IHtcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAnVGhpcyBpcyB0aGUgJG5lYXJTcGhlcmUgb3BlcmF0b3IgdG8gc3BlY2lmeSBhIGNvbnN0cmFpbnQgdG8gc2VsZWN0IHRoZSBvYmplY3RzIHdoZXJlIHRoZSB2YWx1ZXMgb2YgYSBnZW8gcG9pbnQgZmllbGQgaXMgbmVhciB0byBhbm90aGVyIGdlbyBwb2ludC4nLFxuICAgICAgdHlwZTogR0VPX1BPSU5UX0lOUFVULFxuICAgIH0sXG4gICAgX21heERpc3RhbmNlOiB7XG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgJ1RoaXMgaXMgdGhlICRtYXhEaXN0YW5jZSBvcGVyYXRvciB0byBzcGVjaWZ5IGEgY29uc3RyYWludCB0byBzZWxlY3QgdGhlIG9iamVjdHMgd2hlcmUgdGhlIHZhbHVlcyBvZiBhIGdlbyBwb2ludCBmaWVsZCBpcyBhdCBhIG1heCBkaXN0YW5jZSAoaW4gcmFkaWFucykgZnJvbSB0aGUgZ2VvIHBvaW50IHNwZWNpZmllZCBpbiB0aGUgJG5lYXJTcGhlcmUgb3BlcmF0b3IuJyxcbiAgICAgIHR5cGU6IEdyYXBoUUxGbG9hdCxcbiAgICB9LFxuICAgIF9tYXhEaXN0YW5jZUluUmFkaWFuczoge1xuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICdUaGlzIGlzIHRoZSAkbWF4RGlzdGFuY2VJblJhZGlhbnMgb3BlcmF0b3IgdG8gc3BlY2lmeSBhIGNvbnN0cmFpbnQgdG8gc2VsZWN0IHRoZSBvYmplY3RzIHdoZXJlIHRoZSB2YWx1ZXMgb2YgYSBnZW8gcG9pbnQgZmllbGQgaXMgYXQgYSBtYXggZGlzdGFuY2UgKGluIHJhZGlhbnMpIGZyb20gdGhlIGdlbyBwb2ludCBzcGVjaWZpZWQgaW4gdGhlICRuZWFyU3BoZXJlIG9wZXJhdG9yLicsXG4gICAgICB0eXBlOiBHcmFwaFFMRmxvYXQsXG4gICAgfSxcbiAgICBfbWF4RGlzdGFuY2VJbk1pbGVzOiB7XG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgJ1RoaXMgaXMgdGhlICRtYXhEaXN0YW5jZUluTWlsZXMgb3BlcmF0b3IgdG8gc3BlY2lmeSBhIGNvbnN0cmFpbnQgdG8gc2VsZWN0IHRoZSBvYmplY3RzIHdoZXJlIHRoZSB2YWx1ZXMgb2YgYSBnZW8gcG9pbnQgZmllbGQgaXMgYXQgYSBtYXggZGlzdGFuY2UgKGluIG1pbGVzKSBmcm9tIHRoZSBnZW8gcG9pbnQgc3BlY2lmaWVkIGluIHRoZSAkbmVhclNwaGVyZSBvcGVyYXRvci4nLFxuICAgICAgdHlwZTogR3JhcGhRTEZsb2F0LFxuICAgIH0sXG4gICAgX21heERpc3RhbmNlSW5LaWxvbWV0ZXJzOiB7XG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgJ1RoaXMgaXMgdGhlICRtYXhEaXN0YW5jZUluS2lsb21ldGVycyBvcGVyYXRvciB0byBzcGVjaWZ5IGEgY29uc3RyYWludCB0byBzZWxlY3QgdGhlIG9iamVjdHMgd2hlcmUgdGhlIHZhbHVlcyBvZiBhIGdlbyBwb2ludCBmaWVsZCBpcyBhdCBhIG1heCBkaXN0YW5jZSAoaW4ga2lsb21ldGVycykgZnJvbSB0aGUgZ2VvIHBvaW50IHNwZWNpZmllZCBpbiB0aGUgJG5lYXJTcGhlcmUgb3BlcmF0b3IuJyxcbiAgICAgIHR5cGU6IEdyYXBoUUxGbG9hdCxcbiAgICB9LFxuICAgIF93aXRoaW46IHtcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAnVGhpcyBpcyB0aGUgJHdpdGhpbiBvcGVyYXRvciB0byBzcGVjaWZ5IGEgY29uc3RyYWludCB0byBzZWxlY3QgdGhlIG9iamVjdHMgd2hlcmUgdGhlIHZhbHVlcyBvZiBhIGdlbyBwb2ludCBmaWVsZCBpcyB3aXRoaW4gYSBzcGVjaWZpZWQgYm94LicsXG4gICAgICB0eXBlOiBXSVRISU5fSU5QVVQsXG4gICAgfSxcbiAgICBfZ2VvV2l0aGluOiB7XG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgJ1RoaXMgaXMgdGhlICRnZW9XaXRoaW4gb3BlcmF0b3IgdG8gc3BlY2lmeSBhIGNvbnN0cmFpbnQgdG8gc2VsZWN0IHRoZSBvYmplY3RzIHdoZXJlIHRoZSB2YWx1ZXMgb2YgYSBnZW8gcG9pbnQgZmllbGQgaXMgd2l0aGluIGEgc3BlY2lmaWVkIHBvbHlnb24gb3Igc3BoZXJlLicsXG4gICAgICB0eXBlOiBHRU9fV0lUSElOX0lOUFVULFxuICAgIH0sXG4gIH0sXG59KTtcblxuY29uc3QgUE9MWUdPTl9XSEVSRV9JTlBVVCA9IG5ldyBHcmFwaFFMSW5wdXRPYmplY3RUeXBlKHtcbiAgbmFtZTogJ1BvbHlnb25XaGVyZUlucHV0JyxcbiAgZGVzY3JpcHRpb246XG4gICAgJ1RoZSBQb2x5Z29uV2hlcmVJbnB1dCBpbnB1dCB0eXBlIGlzIHVzZWQgaW4gb3BlcmF0aW9ucyB0aGF0IGludm9sdmUgZmlsdGVyaW5nIG9iamVjdHMgYnkgYSBmaWVsZCBvZiB0eXBlIFBvbHlnb24uJyxcbiAgZmllbGRzOiB7XG4gICAgX2V4aXN0cyxcbiAgICBfZ2VvSW50ZXJzZWN0czoge1xuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICdUaGlzIGlzIHRoZSAkZ2VvSW50ZXJzZWN0cyBvcGVyYXRvciB0byBzcGVjaWZ5IGEgY29uc3RyYWludCB0byBzZWxlY3QgdGhlIG9iamVjdHMgd2hlcmUgdGhlIHZhbHVlcyBvZiBhIHBvbHlnb24gZmllbGQgaW50ZXJzZWN0IGEgc3BlY2lmaWVkIHBvaW50LicsXG4gICAgICB0eXBlOiBHRU9fSU5URVJTRUNUU19JTlBVVCxcbiAgICB9LFxuICB9LFxufSk7XG5cbmNvbnN0IEZJTkRfUkVTVUxUID0gbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcbiAgbmFtZTogJ0ZpbmRSZXN1bHQnLFxuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhlIEZpbmRSZXN1bHQgb2JqZWN0IHR5cGUgaXMgdXNlZCBpbiB0aGUgZmluZCBxdWVyaWVzIHRvIHJldHVybiB0aGUgZGF0YSBvZiB0aGUgbWF0Y2hlZCBvYmplY3RzLicsXG4gIGZpZWxkczoge1xuICAgIHJlc3VsdHM6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyB0aGUgb2JqZWN0cyByZXR1cm5lZCBieSB0aGUgcXVlcnknLFxuICAgICAgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKG5ldyBHcmFwaFFMTGlzdChuZXcgR3JhcGhRTE5vbk51bGwoT0JKRUNUKSkpLFxuICAgIH0sXG4gICAgY291bnQ6IENPVU5UX0FUVCxcbiAgfSxcbn0pO1xuXG5jb25zdCBTSUdOX1VQX1JFU1VMVCA9IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdTaWduVXBSZXN1bHQnLFxuICBkZXNjcmlwdGlvbjpcbiAgICAnVGhlIFNpZ25VcFJlc3VsdCBvYmplY3QgdHlwZSBpcyB1c2VkIGluIHRoZSB1c2VycyBzaWduIHVwIG11dGF0aW9uIHRvIHJldHVybiB0aGUgZGF0YSBvZiB0aGUgcmVjZW50IGNyZWF0ZWQgdXNlci4nLFxuICBmaWVsZHM6IHtcbiAgICAuLi5DUkVBVEVfUkVTVUxUX0ZJRUxEUyxcbiAgICBzZXNzaW9uVG9rZW46IFNFU1NJT05fVE9LRU5fQVRULFxuICB9LFxufSk7XG5cbmNvbnN0IEVMRU1FTlQgPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xuICBuYW1lOiAnRWxlbWVudCcsXG4gIGRlc2NyaXB0aW9uOlxuICAgICdUaGUgU2lnblVwUmVzdWx0IG9iamVjdCB0eXBlIGlzIHVzZWQgaW4gdGhlIHVzZXJzIHNpZ24gdXAgbXV0YXRpb24gdG8gcmV0dXJuIHRoZSBkYXRhIG9mIHRoZSByZWNlbnQgY3JlYXRlZCB1c2VyLicsXG4gIGZpZWxkczoge1xuICAgIHZhbHVlOiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ1JldHVybiB0aGUgdmFsdWUgb2YgdGhlIGVsZW1lbnQgaW4gdGhlIGFycmF5JyxcbiAgICAgIHR5cGU6IG5ldyBHcmFwaFFMTm9uTnVsbChBTlkpLFxuICAgIH0sXG4gIH0sXG59KTtcblxuLy8gRGVmYXVsdCBzdGF0aWMgdW5pb24gdHlwZSwgd2UgdXBkYXRlIHR5cGVzIGFuZCByZXNvbHZlVHlwZSBmdW5jdGlvbiBsYXRlclxubGV0IEFSUkFZX1JFU1VMVDtcblxuY29uc3QgbG9hZEFycmF5UmVzdWx0ID0gKHBhcnNlR3JhcGhRTFNjaGVtYSwgcGFyc2VDbGFzc2VzKSA9PiB7XG4gIGNvbnN0IGNsYXNzVHlwZXMgPSBwYXJzZUNsYXNzZXNcbiAgICAuZmlsdGVyKHBhcnNlQ2xhc3MgPT5cbiAgICAgIHBhcnNlR3JhcGhRTFNjaGVtYS5wYXJzZUNsYXNzVHlwZXNbcGFyc2VDbGFzcy5jbGFzc05hbWVdXG4gICAgICAgIC5jbGFzc0dyYXBoUUxPdXRwdXRUeXBlXG4gICAgICAgID8gdHJ1ZVxuICAgICAgICA6IGZhbHNlXG4gICAgKVxuICAgIC5tYXAoXG4gICAgICBwYXJzZUNsYXNzID0+XG4gICAgICAgIHBhcnNlR3JhcGhRTFNjaGVtYS5wYXJzZUNsYXNzVHlwZXNbcGFyc2VDbGFzcy5jbGFzc05hbWVdXG4gICAgICAgICAgLmNsYXNzR3JhcGhRTE91dHB1dFR5cGVcbiAgICApO1xuICBBUlJBWV9SRVNVTFQgPSBuZXcgR3JhcGhRTFVuaW9uVHlwZSh7XG4gICAgbmFtZTogJ0FycmF5UmVzdWx0JyxcbiAgICBkZXNjcmlwdGlvbjpcbiAgICAgICdVc2UgSW5saW5lIEZyYWdtZW50IG9uIEFycmF5IHRvIGdldCByZXN1bHRzOiBodHRwczovL2dyYXBocWwub3JnL2xlYXJuL3F1ZXJpZXMvI2lubGluZS1mcmFnbWVudHMnLFxuICAgIHR5cGVzOiAoKSA9PiBbRUxFTUVOVCwgLi4uY2xhc3NUeXBlc10sXG4gICAgcmVzb2x2ZVR5cGU6IHZhbHVlID0+IHtcbiAgICAgIGlmICh2YWx1ZS5fX3R5cGUgPT09ICdPYmplY3QnICYmIHZhbHVlLmNsYXNzTmFtZSAmJiB2YWx1ZS5vYmplY3RJZCkge1xuICAgICAgICBpZiAocGFyc2VHcmFwaFFMU2NoZW1hLnBhcnNlQ2xhc3NUeXBlc1t2YWx1ZS5jbGFzc05hbWVdKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcnNlR3JhcGhRTFNjaGVtYS5wYXJzZUNsYXNzVHlwZXNbdmFsdWUuY2xhc3NOYW1lXVxuICAgICAgICAgICAgLmNsYXNzR3JhcGhRTE91dHB1dFR5cGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIEVMRU1FTlQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBFTEVNRU5UO1xuICAgICAgfVxuICAgIH0sXG4gIH0pO1xuICBwYXJzZUdyYXBoUUxTY2hlbWEuZ3JhcGhRTFR5cGVzLnB1c2goQVJSQVlfUkVTVUxUKTtcbn07XG5cbmNvbnN0IGxvYWQgPSBwYXJzZUdyYXBoUUxTY2hlbWEgPT4ge1xuICBwYXJzZUdyYXBoUUxTY2hlbWEuYWRkR3JhcGhRTFR5cGUoR3JhcGhRTFVwbG9hZCwgdHJ1ZSk7XG4gIHBhcnNlR3JhcGhRTFNjaGVtYS5hZGRHcmFwaFFMVHlwZShBTlksIHRydWUpO1xuICBwYXJzZUdyYXBoUUxTY2hlbWEuYWRkR3JhcGhRTFR5cGUoT0JKRUNULCB0cnVlKTtcbiAgcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKERBVEUsIHRydWUpO1xuICBwYXJzZUdyYXBoUUxTY2hlbWEuYWRkR3JhcGhRTFR5cGUoQllURVMsIHRydWUpO1xuICBwYXJzZUdyYXBoUUxTY2hlbWEuYWRkR3JhcGhRTFR5cGUoRklMRSwgdHJ1ZSk7XG4gIHBhcnNlR3JhcGhRTFNjaGVtYS5hZGRHcmFwaFFMVHlwZShGSUxFX0lORk8sIHRydWUpO1xuICBwYXJzZUdyYXBoUUxTY2hlbWEuYWRkR3JhcGhRTFR5cGUoR0VPX1BPSU5UX0lOUFVULCB0cnVlKTtcbiAgcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKEdFT19QT0lOVCwgdHJ1ZSk7XG4gIHBhcnNlR3JhcGhRTFNjaGVtYS5hZGRHcmFwaFFMVHlwZShDUkVBVEVfUkVTVUxULCB0cnVlKTtcbiAgcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKFVQREFURV9SRVNVTFQsIHRydWUpO1xuICBwYXJzZUdyYXBoUUxTY2hlbWEuYWRkR3JhcGhRTFR5cGUoUEFSU0VfT0JKRUNULCB0cnVlKTtcbiAgcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKFJFQURfUFJFRkVSRU5DRSwgdHJ1ZSk7XG4gIHBhcnNlR3JhcGhRTFNjaGVtYS5hZGRHcmFwaFFMVHlwZShTVUJRVUVSWV9JTlBVVCwgdHJ1ZSk7XG4gIHBhcnNlR3JhcGhRTFNjaGVtYS5hZGRHcmFwaFFMVHlwZShTRUxFQ1RfSU5QVVQsIHRydWUpO1xuICBwYXJzZUdyYXBoUUxTY2hlbWEuYWRkR3JhcGhRTFR5cGUoU0VBUkNIX0lOUFVULCB0cnVlKTtcbiAgcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKFRFWFRfSU5QVVQsIHRydWUpO1xuICBwYXJzZUdyYXBoUUxTY2hlbWEuYWRkR3JhcGhRTFR5cGUoQk9YX0lOUFVULCB0cnVlKTtcbiAgcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKFdJVEhJTl9JTlBVVCwgdHJ1ZSk7XG4gIHBhcnNlR3JhcGhRTFNjaGVtYS5hZGRHcmFwaFFMVHlwZShDRU5URVJfU1BIRVJFX0lOUFVULCB0cnVlKTtcbiAgcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKEdFT19XSVRISU5fSU5QVVQsIHRydWUpO1xuICBwYXJzZUdyYXBoUUxTY2hlbWEuYWRkR3JhcGhRTFR5cGUoR0VPX0lOVEVSU0VDVFNfSU5QVVQsIHRydWUpO1xuICBwYXJzZUdyYXBoUUxTY2hlbWEuYWRkR3JhcGhRTFR5cGUoU1RSSU5HX1dIRVJFX0lOUFVULCB0cnVlKTtcbiAgcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKE5VTUJFUl9XSEVSRV9JTlBVVCwgdHJ1ZSk7XG4gIHBhcnNlR3JhcGhRTFNjaGVtYS5hZGRHcmFwaFFMVHlwZShCT09MRUFOX1dIRVJFX0lOUFVULCB0cnVlKTtcbiAgcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKEFSUkFZX1dIRVJFX0lOUFVULCB0cnVlKTtcbiAgcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKEtFWV9WQUxVRV9JTlBVVCwgdHJ1ZSk7XG4gIHBhcnNlR3JhcGhRTFNjaGVtYS5hZGRHcmFwaFFMVHlwZShPQkpFQ1RfV0hFUkVfSU5QVVQsIHRydWUpO1xuICBwYXJzZUdyYXBoUUxTY2hlbWEuYWRkR3JhcGhRTFR5cGUoREFURV9XSEVSRV9JTlBVVCwgdHJ1ZSk7XG4gIHBhcnNlR3JhcGhRTFNjaGVtYS5hZGRHcmFwaFFMVHlwZShCWVRFU19XSEVSRV9JTlBVVCwgdHJ1ZSk7XG4gIHBhcnNlR3JhcGhRTFNjaGVtYS5hZGRHcmFwaFFMVHlwZShGSUxFX1dIRVJFX0lOUFVULCB0cnVlKTtcbiAgcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKEdFT19QT0lOVF9XSEVSRV9JTlBVVCwgdHJ1ZSk7XG4gIHBhcnNlR3JhcGhRTFNjaGVtYS5hZGRHcmFwaFFMVHlwZShQT0xZR09OX1dIRVJFX0lOUFVULCB0cnVlKTtcbiAgcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKEZJTkRfUkVTVUxULCB0cnVlKTtcbiAgcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKFNJR05fVVBfUkVTVUxULCB0cnVlKTtcbiAgcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKEVMRU1FTlQsIHRydWUpO1xuICBwYXJzZUdyYXBoUUxTY2hlbWEuYWRkR3JhcGhRTFR5cGUoT0JKRUNUX0lELCB0cnVlKTtcbn07XG5cbmV4cG9ydCB7XG4gIFR5cGVWYWxpZGF0aW9uRXJyb3IsXG4gIHBhcnNlU3RyaW5nVmFsdWUsXG4gIHBhcnNlSW50VmFsdWUsXG4gIHBhcnNlRmxvYXRWYWx1ZSxcbiAgcGFyc2VCb29sZWFuVmFsdWUsXG4gIHBhcnNlVmFsdWUsXG4gIHBhcnNlTGlzdFZhbHVlcyxcbiAgcGFyc2VPYmplY3RGaWVsZHMsXG4gIEFOWSxcbiAgT0JKRUNULFxuICBwYXJzZURhdGVJc29WYWx1ZSxcbiAgc2VyaWFsaXplRGF0ZUlzbyxcbiAgREFURSxcbiAgQllURVMsXG4gIHBhcnNlRmlsZVZhbHVlLFxuICBGSUxFLFxuICBGSUxFX0lORk8sXG4gIEdFT19QT0lOVF9GSUVMRFMsXG4gIEdFT19QT0lOVF9JTlBVVCxcbiAgR0VPX1BPSU5ULFxuICBQT0xZR09OX0lOUFVULFxuICBQT0xZR09OLFxuICBPQkpFQ1RfSUQsXG4gIENMQVNTX05BTUVfQVRULFxuICBGSUVMRFNfQVRULFxuICBPQkpFQ1RfSURfQVRULFxuICBVUERBVEVEX0FUX0FUVCxcbiAgQ1JFQVRFRF9BVF9BVFQsXG4gIEFDTF9BVFQsXG4gIElOUFVUX0ZJRUxEUyxcbiAgQ1JFQVRFX1JFU1VMVF9GSUVMRFMsXG4gIENSRUFURV9SRVNVTFQsXG4gIFVQREFURV9SRVNVTFRfRklFTERTLFxuICBVUERBVEVfUkVTVUxULFxuICBQQVJTRV9PQkpFQ1RfRklFTERTLFxuICBQQVJTRV9PQkpFQ1QsXG4gIFNFU1NJT05fVE9LRU5fQVRULFxuICBLRVlTX0FUVCxcbiAgSU5DTFVERV9BVFQsXG4gIFJFQURfUFJFRkVSRU5DRSxcbiAgUkVBRF9QUkVGRVJFTkNFX0FUVCxcbiAgSU5DTFVERV9SRUFEX1BSRUZFUkVOQ0VfQVRULFxuICBTVUJRVUVSWV9SRUFEX1BSRUZFUkVOQ0VfQVRULFxuICBXSEVSRV9BVFQsXG4gIFNLSVBfQVRULFxuICBMSU1JVF9BVFQsXG4gIENPVU5UX0FUVCxcbiAgU1VCUVVFUllfSU5QVVQsXG4gIFNFTEVDVF9JTlBVVCxcbiAgU0VBUkNIX0lOUFVULFxuICBURVhUX0lOUFVULFxuICBCT1hfSU5QVVQsXG4gIFdJVEhJTl9JTlBVVCxcbiAgQ0VOVEVSX1NQSEVSRV9JTlBVVCxcbiAgR0VPX1dJVEhJTl9JTlBVVCxcbiAgR0VPX0lOVEVSU0VDVFNfSU5QVVQsXG4gIF9lcSxcbiAgX25lLFxuICBfbHQsXG4gIF9sdGUsXG4gIF9ndCxcbiAgX2d0ZSxcbiAgX2luLFxuICBfbmluLFxuICBfZXhpc3RzLFxuICBfc2VsZWN0LFxuICBfZG9udFNlbGVjdCxcbiAgX3JlZ2V4LFxuICBfb3B0aW9ucyxcbiAgU1RSSU5HX1dIRVJFX0lOUFVULFxuICBOVU1CRVJfV0hFUkVfSU5QVVQsXG4gIEJPT0xFQU5fV0hFUkVfSU5QVVQsXG4gIEFSUkFZX1dIRVJFX0lOUFVULFxuICBLRVlfVkFMVUVfSU5QVVQsXG4gIE9CSkVDVF9XSEVSRV9JTlBVVCxcbiAgREFURV9XSEVSRV9JTlBVVCxcbiAgQllURVNfV0hFUkVfSU5QVVQsXG4gIEZJTEVfV0hFUkVfSU5QVVQsXG4gIEdFT19QT0lOVF9XSEVSRV9JTlBVVCxcbiAgUE9MWUdPTl9XSEVSRV9JTlBVVCxcbiAgRklORF9SRVNVTFQsXG4gIFNJR05fVVBfUkVTVUxULFxuICBBUlJBWV9SRVNVTFQsXG4gIEVMRU1FTlQsXG4gIGxvYWQsXG4gIGxvYWRBcnJheVJlc3VsdCxcbn07XG4iXX0=