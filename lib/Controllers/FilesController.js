"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.FilesController = void 0;

var _cryptoUtils = require("../cryptoUtils");

var _AdaptableController = _interopRequireDefault(require("./AdaptableController"));

var _FilesAdapter = require("../Adapters/Files/FilesAdapter");

var _path = _interopRequireDefault(require("path"));

var _mime = _interopRequireDefault(require("mime"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// FilesController.js
const legacyFilesRegex = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}-.*');

class FilesController extends _AdaptableController.default {
  createFile(config, filename, data, contentType) {
    const extname = _path.default.extname(filename);

    const hasExtension = extname.length > 0;

    if (!hasExtension && contentType && _mime.default.getExtension(contentType)) {
      filename = filename + '.' + _mime.default.getExtension(contentType);
    } else if (hasExtension && !contentType) {
      contentType = _mime.default.getType(filename);
    }

    if (!this.options.preserveFileName) {
      filename = (0, _cryptoUtils.randomHexString)(32) + '_' + filename;
    }

    const location = this.adapter.getFileLocation(config, filename);
    return this.adapter.createFile(filename, data, contentType).then(() => {
      return Promise.resolve({
        url: location,
        name: filename
      });
    });
  }

  deleteFile(config, filename) {
    return this.adapter.deleteFile(filename);
  }
  /**
   * Find file references in REST-format object and adds the url key
   * with the current mount point and app id.
   * Object may be a single object or list of REST-format objects.
   */


  expandFilesInObject(config, object) {
    if (object instanceof Array) {
      object.map(obj => this.expandFilesInObject(config, obj));
      return;
    }

    if (typeof object !== 'object') {
      return;
    }

    for (const key in object) {
      const fileObject = object[key];

      if (fileObject && fileObject['__type'] === 'File') {
        if (fileObject['url']) {
          continue;
        }

        const filename = fileObject['name']; // all filenames starting with "tfss-" should be from files.parsetfss.com
        // all filenames starting with a "-" seperated UUID should be from files.parse.com
        // all other filenames have been migrated or created from Parse Server

        if (config.fileKey === undefined) {
          fileObject['url'] = this.adapter.getFileLocation(config, filename);
        } else {
          if (filename.indexOf('tfss-') === 0) {
            fileObject['url'] = 'http://files.parsetfss.com/' + config.fileKey + '/' + encodeURIComponent(filename);
          } else if (legacyFilesRegex.test(filename)) {
            fileObject['url'] = 'http://files.parse.com/' + config.fileKey + '/' + encodeURIComponent(filename);
          } else {
            fileObject['url'] = this.adapter.getFileLocation(config, filename);
          }
        }
      }
    }
  }

  expectedAdapterType() {
    return _FilesAdapter.FilesAdapter;
  }

  getFileProperties(config, filename) {
    return this.adapter.getFileProperties(filename);
  }

  getFileStream(config, filename, options) {
    return this.adapter.getFileStream(filename, options || {});
  }

}

exports.FilesController = FilesController;
var _default = FilesController;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Db250cm9sbGVycy9GaWxlc0NvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsibGVnYWN5RmlsZXNSZWdleCIsIlJlZ0V4cCIsIkZpbGVzQ29udHJvbGxlciIsIkFkYXB0YWJsZUNvbnRyb2xsZXIiLCJjcmVhdGVGaWxlIiwiY29uZmlnIiwiZmlsZW5hbWUiLCJkYXRhIiwiY29udGVudFR5cGUiLCJleHRuYW1lIiwicGF0aCIsImhhc0V4dGVuc2lvbiIsImxlbmd0aCIsIm1pbWUiLCJnZXRFeHRlbnNpb24iLCJnZXRUeXBlIiwib3B0aW9ucyIsInByZXNlcnZlRmlsZU5hbWUiLCJsb2NhdGlvbiIsImFkYXB0ZXIiLCJnZXRGaWxlTG9jYXRpb24iLCJ0aGVuIiwiUHJvbWlzZSIsInJlc29sdmUiLCJ1cmwiLCJuYW1lIiwiZGVsZXRlRmlsZSIsImV4cGFuZEZpbGVzSW5PYmplY3QiLCJvYmplY3QiLCJBcnJheSIsIm1hcCIsIm9iaiIsImtleSIsImZpbGVPYmplY3QiLCJmaWxlS2V5IiwidW5kZWZpbmVkIiwiaW5kZXhPZiIsImVuY29kZVVSSUNvbXBvbmVudCIsInRlc3QiLCJleHBlY3RlZEFkYXB0ZXJUeXBlIiwiRmlsZXNBZGFwdGVyIiwiZ2V0RmlsZVByb3BlcnRpZXMiLCJnZXRGaWxlU3RyZWFtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFMQTtBQU9BLE1BQU1BLGdCQUFnQixHQUFHLElBQUlDLE1BQUosQ0FDdkIsaUZBRHVCLENBQXpCOztBQUlPLE1BQU1DLGVBQU4sU0FBOEJDLDRCQUE5QixDQUFrRDtBQUN2REMsRUFBQUEsVUFBVSxDQUFDQyxNQUFELEVBQVNDLFFBQVQsRUFBbUJDLElBQW5CLEVBQXlCQyxXQUF6QixFQUFzQztBQUM5QyxVQUFNQyxPQUFPLEdBQUdDLGNBQUtELE9BQUwsQ0FBYUgsUUFBYixDQUFoQjs7QUFFQSxVQUFNSyxZQUFZLEdBQUdGLE9BQU8sQ0FBQ0cs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LE1BTUE7QUFDTDJCLFlBQUFBLFVBQVUsQ0FBQyxLQUFELENBQVYsR0FBb0IsS0FBS2QsT0FBTCxDQUFhQyxlQUFiLENBQTZCZixNQUE3QixFQUFxQ0MsUUFBckMsQ0FBcEI7QUFDRDtBQUNGO0FBQ0Y7QUFDRjtBQUNGOztBQUVEaUMsRUFBQUEsbUJBQW1CLEdBQUc7QUFDcEIsV0FBT0MsMEJBQVA7QUFDRDs7QUFFREMsRUFBQUEsaUJBQWlCLENBQUNwQyxNQUFELEVBQVNDLFFBQVQsRUFBbUI7QUFDbEMsV0FBTyxLQUFLYSxPQUFMLENBQWFzQixpQkFBYixDQUErQm5DLFFBQS9CLENBQVA7QUFDRDs7QUFFRG9DLEVBQUFBLGFBQWEsQ0FBQ3JDLE1BQUQsRUFBU0MsUUFBVCxFQUFtQlUsT0FBbkIsRUFBNEI7QUFDdkMsV0FBTyxLQUFLRyxPQUFMLENBQWF1QixhQUFiLENBQTJCcEMsUUFBM0IsRUFBcUNVLE9BQU8sSUFBSSxFQUFoRCxDQUFQO0FBQ0Q7O0FBckZzRDs7O2VBd0YxQ2QsZSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGVzQ29udHJvbGxlci5qc1xuaW1wb3J0IHsgcmFuZG9tSGV4U3RyaW5nIH0gZnJvbSAnLi4vY3J5cHRvVXRpbHMnO1xuaW1wb3J0IEFkYXB0YWJsZUNvbnRyb2xsZXIgZnJvbSAnLi9BZGFwdGFibGVDb250cm9sbGVyJztcbmltcG9ydCB7IEZpbGVzQWRhcHRlciB9IGZyb20gJy4uL0FkYXB0ZXJzL0ZpbGVzL0ZpbGVzQWRhcHRlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBtaW1lIGZyb20gJ21pbWUnO1xuXG5jb25zdCBsZWdhY3lGaWxlc1JlZ2V4ID0gbmV3IFJlZ0V4cChcbiAgJ15bMC05YS1mQS1GXXs4fS1bMC05YS1mQS1GXXs0fS1bMC05YS1mQS1GXXs0fS1bMC05YS1mQS1GXXs0fS1bMC05YS1mQS1GXXsxMn0tLionXG4pO1xuXG5leHBvcnQgY2xhc3MgRmlsZXNDb250cm9sbGVyIGV4dGVuZHMgQWRhcHRhYmxlQ29udHJvbGxlciB7XG4gIGNyZWF0ZUZpbGUoY29uZmlnLCBmaWxlbmFtZSwgZGF0YSwgY29udGVudFR5cGUpIHtcbiAgICBjb25zdCBleHRuYW1lID0gcGF0aC5leHRuYW1lKGZpbGVuYW1lKTtcblxuICAgIGNvbnN0IGhhc0V4dGVuc2lvbiA9IGV4dG5hbWUubGVuZ3RoID4gMDtcblxuICAgIGlmICghaGFzRXh0ZW5zaW9uICYmIGNvbnRlbnRUeXBlICYmIG1pbWUuZ2V0RXh0ZW5zaW9uKGNvbnRlbnRUeXBlKSkge1xuICAgICAgZmlsZW5hbWUgPSBmaWxlbmFtZSArICcuJyArIG1pbWUuZ2V0RXh0ZW5zaW9uKGNvbnRlbnRUeXBlKTtcbiAgICB9IGVsc2UgaWYgKGhhc0V4dGVuc2lvbiAmJiAhY29udGVudFR5cGUpIHtcbiAgICAgIGNvbnRlbnRUeXBlID0gbWltZS5nZXRUeXBlKGZpbGVuYW1lKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5wcmVzZXJ2ZUZpbGVOYW1lKSB7XG4gICAgICBmaWxlbmFtZSA9IHJhbmRvbUhleFN0cmluZygzMikgKyAnXycgKyBmaWxlbmFtZTtcbiAgICB9XG5cbiAgICBjb25zdCBsb2NhdGlvbiA9IHRoaXMuYWRhcHRlci5nZXRGaWxlTG9jYXRpb24oY29uZmlnLCBmaWxlbmFtZSk7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5jcmVhdGVGaWxlKGZpbGVuYW1lLCBkYXRhLCBjb250ZW50VHlwZSkudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgdXJsOiBsb2NhdGlvbixcbiAgICAgICAgbmFtZTogZmlsZW5hbWUsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGRlbGV0ZUZpbGUoY29uZmlnLCBmaWxlbmFtZSkge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZGVsZXRlRmlsZShmaWxlbmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogRmluZCBmaWxlIHJlZmVyZW5jZXMgaW4gUkVTVC1mb3JtYXQgb2JqZWN0IGFuZCBhZGRzIHRoZSB1cmwga2V5XG4gICAqIHdpdGggdGhlIGN1cnJlbnQgbW91bnQgcG9pbnQgYW5kIGFwcCBpZC5cbiAgICogT2JqZWN0IG1heSBiZSBhIHNpbmdsZSBvYmplY3Qgb3IgbGlzdCBvZiBSRVNULWZvcm1hdCBvYmplY3RzLlxuICAgKi9cbiAgZXhwYW5kRmlsZXNJbk9iamVjdChjb25maWcsIG9iamVjdCkge1xuICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgb2JqZWN0Lm1hcChvYmogPT4gdGhpcy5leHBhbmRGaWxlc0luT2JqZWN0KGNvbmZpZywgb2JqKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb2JqZWN0ICE9PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGNvbnN0IGZpbGVPYmplY3QgPSBvYmplY3Rba2V5XTtcbiAgICAgIGlmIChmaWxlT2JqZWN0ICYmIGZpbGVPYmplY3RbJ19fdHlwZSddID09PSAnRmlsZScpIHtcbiAgICAgICAgaWYgKGZpbGVPYmplY3RbJ3VybCddKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmlsZW5hbWUgPSBmaWxlT2JqZWN0WyduYW1lJ107XG4gICAgICAgIC8vIGFsbCBmaWxlbmFtZXMgc3RhcnRpbmcgd2l0aCBcInRmc3MtXCIgc2hvdWxkIGJlIGZyb20gZmlsZXMucGFyc2V0ZnNzLmNvbVxuICAgICAgICAvLyBhbGwgZmlsZW5hbWVzIHN0YXJ0aW5nIHdpdGggYSBcIi1cIiBzZXBlcmF0ZWQgVVVJRCBzaG91bGQgYmUgZnJvbSBmaWxlcy5wYXJzZS5jb21cbiAgICAgICAgLy8gYWxsIG90aGVyIGZpbGVuYW1lcyBoYXZlIGJlZW4gbWlncmF0ZWQgb3IgY3JlYXRlZCBmcm9tIFBhcnNlIFNlcnZlclxuICAgICAgICBpZiAoY29uZmlnLmZpbGVLZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGZpbGVPYmplY3RbJ3VybCddID0gdGhpcy5hZGFwdGVyLmdldEZpbGVMb2NhdGlvbihjb25maWcsIGZpbGVuYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZmlsZW5hbWUuaW5kZXhPZigndGZzcy0nKSA9PT0gMCkge1xuICAgICAgICAgICAgZmlsZU9iamVjdFsndXJsJ10gPVxuICAgICAgICAgICAgICAnaHR0cDovL2ZpbGVzLnBhcnNldGZzcy5jb20vJyArXG4gICAgICAgICAgICAgIGNvbmZpZy5maWxlS2V5ICtcbiAgICAgICAgICAgICAgJy8nICtcbiAgICAgICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KGZpbGVuYW1lKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGxlZ2FjeUZpbGVzUmVnZXgudGVzdChmaWxlbmFtZSkpIHtcbiAgICAgICAgICAgIGZpbGVPYmplY3RbJ3VybCddID1cbiAgICAgICAgICAgICAgJ2h0dHA6Ly9maWxlcy5wYXJzZS5jb20vJyArXG4gICAgICAgICAgICAgIGNvbmZpZy5maWxlS2V5ICtcbiAgICAgICAgICAgICAgJy8nICtcbiAgICAgICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KGZpbGVuYW1lKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmlsZU9iamVjdFsndXJsJ10gPSB0aGlzLmFkYXB0ZXIuZ2V0RmlsZUxvY2F0aW9uKGNvbmZpZywgZmlsZW5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGV4cGVjdGVkQWRhcHRlclR5cGUoKSB7XG4gICAgcmV0dXJuIEZpbGVzQWRhcHRlcjtcbiAgfVxuXG4gIGdldEZpbGVQcm9wZXJ0aWVzKGNvbmZpZywgZmlsZW5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmdldEZpbGVQcm9wZXJ0aWVzKGZpbGVuYW1lKTtcbiAgfVxuXG4gIGdldEZpbGVTdHJlYW0oY29uZmlnLCBmaWxlbmFtZSwgb3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0RmlsZVN0cmVhbShmaWxlbmFtZSwgb3B0aW9ucyB8fCB7fSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRmlsZXNDb250cm9sbGVyO1xuIl19