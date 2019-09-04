"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilesRouter = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var Middlewares = _interopRequireWildcard(require("../middlewares"));

var _node = _interopRequireDefault(require("parse/node"));

var _Config = _interopRequireDefault(require("../Config"));

var _mime = _interopRequireDefault(require("mime"));

var _logger = _interopRequireDefault(require("../logger"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FilesRouter {
  expressRouter({
    maxUploadSize = '20Mb'
  } = {}) {
    var router = _express.default.Router();

    router.get('/files/:appId/:filename', this.getHandler);
    router.post('/files', function (req, res, next) {
      next(new _node.default.Error(_node.default.Error.INVALID_FILE_NAME, 'Filename not provided.'));
    });
    router.post('/files/:filename', _bodyParser.default.raw({
      type: () => {
        return true;
      },
      limit: maxUploadSize
    }), // Allow uploads without Content-Type, or with any Content-Type.
    Middlewares.handleParseHeaders, this.createHandler);
    router.delete('/files/:filename', Middlewares.handleParseHeaders, Middlewares.enforceMasterKeyAccess, this.deleteHandler);
    return router;
  }

  getHandler(req, res) {
    const config = _Config.default.get(req.params.appId);

    const filesController = config.filesController;
    const filename = req.params.filename;

    const contentType = _mime.default.getType(filename);

    const range = req.get('Range');

    if (range) {
      filesController.getFileStream(config, filename, getRange(range)).then(({
        stream,
        meta
      }) => {
        handleFileStream(stream, res, _objectSpread({}, meta, {
          contentType
        }));
      }).catch(() => {
        res.status(404);
        res.set('Content-Type', 'text/plain');
        res.end('File not found.');
      });
    } else {
      filesController.getFileStream(config, filename).then(({
        stream,
        meta
      }) => {
        res.status(200);
        res.set('Content-Type', contentType);
        res.set('Content-Length', meta.length);
        stream.pipe(res);
      }).catch(() => {
        res.status(404);
        res.set('Content-Type', 'text/plain');
        res.end('File not found.');
      });
    }
  }

  createHandler(req, res, next) {
    if (!req.body || !req.body.length) {
      next(new _node.default.Error(_node.default.Error.FILE_SAVE_ERROR, 'Invalid file upload.'));
      return;
    }

    if (req.params.filename.length > 128) {
      next(new _node.default.Error(_node.default.Error.INVALID_FILE_NAME, 'Filename too long.'));
      return;
    }

    if (!req.params.filename.match(/^[_a-zA-Z0-9][a-zA-Z0-9@\.\ ~_-]*$/)) {
      next(new _node.default.Error(_node.default.Error.INVALID_FILE_NAME, 'Filename contains invalid characters.'));
      return;
    }

    const filename = req.params.filename;
    const contentType = req.get('Content-type');
    const config = req.config;
    const filesController = config.filesController;
    filesController.createFile(config, filename, req.body, contentType).then(result => {
      res.status(201);
      res.set('Location', result.url);
      res.json(result);
    }).catch(e => {
      _logger.default.error('Error creating a file: ', e);

      next(new _node.default.Error(_node.default.Error.FILE_SAVE_ERROR, `Could not store file: ${filename}.`));
    });
  }

  deleteHandler(req, res, next) {
    const filesController = req.config.filesController;
    filesController.deleteFile(req.config, req.params.filename).then(() => {
      res.status(200); // TODO: return useful JSON here?

      res.end();
    }).catch(() => {
      next(new _node.default.Error(_node.default.Error.FILE_DELETE_ERROR, 'Could not delete file.'));
    });
  }

}

exports.FilesRouter = FilesRouter;

function getRange(range) {
  const parts = range.replace(/bytes=/, '').split('-');
  return {
    start: parseInt(parts[0], 10),
    end: parts[1] ? parseInt(parts[1], 10) : undefined
  };
}

function handleFileStream(stream, res, meta) {
  const {
    start,
    end,
    length,
    contentType
  } = meta;
  res.writeHead(206, {
    'Content-Range': 'bytes ' + start + '-' + end + '/' + length,
    'Accept-Ranges': 'bytes',
    'Content-Length': end - start + 1,
    'Content-Type': contentType
  });
  stream.pipe(res);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Sb3V0ZXJzL0ZpbGVzUm91dGVyLmpzIl0sIm5hbWVzIjpbIkZpbGVzUm91dGVyIiwiZXhwcmVzc1JvdXRlciIsIm1heFVwbG9hZFNpemUiLCJyb3V0ZXIiLCJleHByZXNzIiwiUm91dGVyIiwiZ2V0IiwiZ2V0SGFuZGxlciIsInBvc3QiLCJyZXEiLCJyZXMiLCJuZXh0IiwiUGFyc2UiLCJFcnJvciIsIklOVkFMSURfRklMRV9OQU1FIiwiQm9keVBhcnNlciIsInJhdyIsInR5cGUiLCJsaW1pdCIsIk1pZGRsZXdhcmVzIiwiaGFuZGxlUGFyc2VIZWFkZXJzIiwiY3JlYXRlSGFuZGxlciIsImRlbGV0ZSIsImVuZm9yY2VNYXN0ZXJLZXlBY2Nlc3MiLCJkZWxldGVIYW5kbGVyIiwiY29uZmlnIiwiQ29uZmlnIiwicGFyYW1zIiwiYXBwSWQiLCJmaWxlc0NvbnRyb2xsZXIiLCJmaWxlbmFtZSIsImNvbnRlbnRUeXBlIiwibWltZSIsImdldFR5cGUiLCJyYW5nZSIsImdldEZpbGVTdHJlYW0iLCJnZXRSYW5nZSIsInRoZW4iLCJzdHJlYW0iLCJtZXRhIiwiaGFuZGxlRmlsZVN0cmVhbSIsImNhdGNoIiwic3RhdHVzIiwic2V0IiwiZW5kIiwibGVuZ3RoIiwicGlwZSIsImJvZHkiLCJGSUxFX1NBVkVfRVJST1IiLCJtYXRjaCIsImNyZWF0ZUZpbGUiLCJyZXN1bHQiLCJ1cmwiLCJqc29uIiwiZSIsImxvZ2dlciIsImVycm9yIiwiZGVsZXRlRmlsZSIsIkZJTEVfREVMRVRFX0VSUk9SIiwicGFydHMiLCJyZXBsYWNlIiwic3BsaXQiLCJzdGFydCIsInBhcnNlSW50IiwidW5kZWZpbmVkIiwid3JpdGVIZWFkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVPLE1BQU1BLFdBQU4sQ0FBa0I7QUFDdkJDLEVBQUFBLGFBQWEsQ0FBQztBQUFFQyxJQUFBQSxhQUFh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QUFNRCxLQWRIO0FBZUQ7O0FBcklzQjs7OztBQXdJekIsU0FBU3RCLFFBQVQsQ0FBa0JGLEtBQWxCLEVBQXlCO0FBQ3ZCLFFBQU15QixLQUFLLEdBQUd6QixLQUFLLENBQUMwQixPQUFOLENBQWMsUUFBZCxFQUF3QixFQUF4QixFQUE0QkMsS0FBNUIsQ0FBa0MsR0FBbEMsQ0FBZDtBQUNBLFNBQU87QUFDTEMsSUFBQUEsS0FBSyxFQUFFQyxRQUFRLENBQUNKLEtBQUssQ0FBQyxDQUFELENBQU4sRUFBVyxFQUFYLENBRFY7QUFFTGYsSUFBQUEsR0FBRyxFQUFFZSxLQUFLLENBQUMsQ0FBRCxDQUFMLEdBQVdJLFFBQVEsQ0FBQ0osS0FBSyxDQUFDLENBQUQsQ0FBTixFQUFXLEVBQVgsQ0FBbkIsR0FBb0NLO0FBRnBDLEdBQVA7QUFJRDs7QUFFRCxTQUFTeEIsZ0JBQVQsQ0FBMEJGLE1BQTFCLEVBQWtDNUIsR0FBbEMsRUFBdUM2QixJQUF2QyxFQUE2QztBQUMzQyxRQUFNO0FBQUV1QixJQUFBQSxLQUFGO0FBQVNsQixJQUFBQSxHQUFUO0FBQWNDLElBQUFBLE1BQWQ7QUFBc0JkLElBQUFBO0FBQXRCLE1BQXNDUSxJQUE1QztBQUVBN0IsRUFBQUEsR0FBRyxDQUFDdUQsU0FBSixDQUFjLEdBQWQsRUFBbUI7QUFDakIscUJBQWlCLFdBQVdILEtBQVgsR0FBbUIsR0FBbkIsR0FBeUJsQixHQUF6QixHQUErQixHQUEvQixHQUFxQ0MsTUFEckM7QUFFakIscUJBQWlCLE9BRkE7QUFHakIsc0JBQWtCRCxHQUFHLEdBQUdrQixLQUFOLEdBQWMsQ0FIZjtBQUlqQixvQkFBZ0IvQjtBQUpDLEdBQW5CO0FBT0FPLEVBQUFBLE1BQU0sQ0FBQ1EsSUFBUCxDQUFZcEMsR0FBWjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgQm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcic7XG5pbXBvcnQgKiBhcyBNaWRkbGV3YXJlcyBmcm9tICcuLi9taWRkbGV3YXJlcyc7XG5pbXBvcnQgUGFyc2UgZnJvbSAncGFyc2Uvbm9kZSc7XG5pbXBvcnQgQ29uZmlnIGZyb20gJy4uL0NvbmZpZyc7XG5pbXBvcnQgbWltZSBmcm9tICdtaW1lJztcbmltcG9ydCBsb2dnZXIgZnJvbSAnLi4vbG9nZ2VyJztcblxuZXhwb3J0IGNsYXNzIEZpbGVzUm91dGVyIHtcbiAgZXhwcmVzc1JvdXRlcih7IG1heFVwbG9hZFNpemUgPSAnMjBNYicgfSA9IHt9KSB7XG4gICAgdmFyIHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG4gICAgcm91dGVyLmdldCgnL2ZpbGVzLzphcHBJZC86ZmlsZW5hbWUnLCB0aGlzLmdldEhhbmRsZXIpO1xuXG4gICAgcm91dGVyLnBvc3QoJy9maWxlcycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgICBuZXh0KFxuICAgICAgICBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuSU5WQUxJRF9GSUxFX05BTUUsICdGaWxlbmFtZSBub3QgcHJvdmlkZWQuJylcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICByb3V0ZXIucG9zdChcbiAgICAgICcvZmlsZXMvOmZpbGVuYW1lJyxcbiAgICAgIEJvZHlQYXJzZXIucmF3KHtcbiAgICAgICAgdHlwZTogKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICBsaW1pdDogbWF4VXBsb2FkU2l6ZSxcbiAgICAgIH0pLCAvLyBBbGxvdyB1cGxvYWRzIHdpdGhvdXQgQ29udGVudC1UeXBlLCBvciB3aXRoIGFueSBDb250ZW50LVR5cGUuXG4gICAgICBNaWRkbGV3YXJlcy5oYW5kbGVQYXJzZUhlYWRlcnMsXG4gICAgICB0aGlzLmNyZWF0ZUhhbmRsZXJcbiAgICApO1xuXG4gICAgcm91dGVyLmRlbGV0ZShcbiAgICAgICcvZmlsZXMvOmZpbGVuYW1lJyxcbiAgICAgIE1pZGRsZXdhcmVzLmhhbmRsZVBhcnNlSGVhZGVycyxcbiAgICAgIE1pZGRsZXdhcmVzLmVuZm9yY2VNYXN0ZXJLZXlBY2Nlc3MsXG4gICAgICB0aGlzLmRlbGV0ZUhhbmRsZXJcbiAgICApO1xuICAgIHJldHVybiByb3V0ZXI7XG4gIH1cblxuICBnZXRIYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgY29uc3QgY29uZmlnID0gQ29uZmlnLmdldChyZXEucGFyYW1zLmFwcElkKTtcbiAgICBjb25zdCBmaWxlc0NvbnRyb2xsZXIgPSBjb25maWcuZmlsZXNDb250cm9sbGVyO1xuICAgIGNvbnN0IGZpbGVuYW1lID0gcmVxLnBhcmFtcy5maWxlbmFtZTtcbiAgICBjb25zdCBjb250ZW50VHlwZSA9IG1pbWUuZ2V0VHlwZShmaWxlbmFtZSk7XG4gICAgY29uc3QgcmFuZ2UgPSByZXEuZ2V0KCdSYW5nZScpO1xuXG4gICAgaWYgKHJhbmdlKSB7XG4gICAgICBmaWxlc0NvbnRyb2xsZXJcbiAgICAgICAgLmdldEZpbGVTdHJlYW0oY29uZmlnLCBmaWxlbmFtZSwgZ2V0UmFuZ2UocmFuZ2UpKVxuICAgICAgICAudGhlbigoeyBzdHJlYW0sIG1ldGEgfSkgPT4ge1xuICAgICAgICAgIGhhbmRsZUZpbGVTdHJlYW0oc3RyZWFtLCByZXMsIHsgLi4ubWV0YSwgY29udGVudFR5cGUgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgcmVzLnN0YXR1cyg0MDQpO1xuICAgICAgICAgIHJlcy5zZXQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3BsYWluJyk7XG4gICAgICAgICAgcmVzLmVuZCgnRmlsZSBub3QgZm91bmQuJyk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaWxlc0NvbnRyb2xsZXJcbiAgICAgICAgLmdldEZpbGVTdHJlYW0oY29uZmlnLCBmaWxlbmFtZSlcbiAgICAgICAgLnRoZW4oKHsgc3RyZWFtLCBtZXRhIH0pID0+IHtcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCk7XG4gICAgICAgICAgcmVzLnNldCgnQ29udGVudC1UeXBlJywgY29udGVudFR5cGUpO1xuICAgICAgICAgIHJlcy5zZXQoJ0NvbnRlbnQtTGVuZ3RoJywgbWV0YS5sZW5ndGgpO1xuXG4gICAgICAgICAgc3RyZWFtLnBpcGUocmVzKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICByZXMuc3RhdHVzKDQwNCk7XG4gICAgICAgICAgcmVzLnNldCgnQ29udGVudC1UeXBlJywgJ3RleHQvcGxhaW4nKTtcbiAgICAgICAgICByZXMuZW5kKCdGaWxlIG5vdCBmb3VuZC4nKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlSGFuZGxlcihyZXEsIHJlcywgbmV4dCkge1xuICAgIGlmICghcmVxLmJvZHkgfHwgIXJlcS5ib2R5Lmxlbmd0aCkge1xuICAgICAgbmV4dChcbiAgICAgICAgbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLkZJTEVfU0FWRV9FUlJPUiwgJ0ludmFsaWQgZmlsZSB1cGxvYWQuJylcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHJlcS5wYXJhbXMuZmlsZW5hbWUubGVuZ3RoID4gMTI4KSB7XG4gICAgICBuZXh0KFxuICAgICAgICBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuSU5WQUxJRF9GSUxFX05BTUUsICdGaWxlbmFtZSB0b28gbG9uZy4nKVxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXJlcS5wYXJhbXMuZmlsZW5hbWUubWF0Y2goL15bX2EtekEtWjAtOV1bYS16QS1aMC05QFxcLlxcIH5fLV0qJC8pKSB7XG4gICAgICBuZXh0KFxuICAgICAgICBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgUGFyc2UuRXJyb3IuSU5WQUxJRF9GSUxFX05BTUUsXG4gICAgICAgICAgJ0ZpbGVuYW1lIGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycy4nXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZW5hbWUgPSByZXEucGFyYW1zLmZpbGVuYW1lO1xuICAgIGNvbnN0IGNvbnRlbnRUeXBlID0gcmVxLmdldCgnQ29udGVudC10eXBlJyk7XG4gICAgY29uc3QgY29uZmlnID0gcmVxLmNvbmZpZztcbiAgICBjb25zdCBmaWxlc0NvbnRyb2xsZXIgPSBjb25maWcuZmlsZXNDb250cm9sbGVyO1xuXG4gICAgZmlsZXNDb250cm9sbGVyXG4gICAgICAuY3JlYXRlRmlsZShjb25maWcsIGZpbGVuYW1lLCByZXEuYm9keSwgY29udGVudFR5cGUpXG4gICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICByZXMuc3RhdHVzKDIwMSk7XG4gICAgICAgIHJlcy5zZXQoJ0xvY2F0aW9uJywgcmVzdWx0LnVybCk7XG4gICAgICAgIHJlcy5qc29uKHJlc3VsdCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGNyZWF0aW5nIGEgZmlsZTogJywgZSk7XG4gICAgICAgIG5leHQoXG4gICAgICAgICAgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgICAgUGFyc2UuRXJyb3IuRklMRV9TQVZFX0VSUk9SLFxuICAgICAgICAgICAgYENvdWxkIG5vdCBzdG9yZSBmaWxlOiAke2ZpbGVuYW1lfS5gXG4gICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgfSk7XG4gIH1cblxuICBkZWxldGVIYW5kbGVyKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgY29uc3QgZmlsZXNDb250cm9sbGVyID0gcmVxLmNvbmZpZy5maWxlc0NvbnRyb2xsZXI7XG4gICAgZmlsZXNDb250cm9sbGVyXG4gICAgICAuZGVsZXRlRmlsZShyZXEuY29uZmlnLCByZXEucGFyYW1zLmZpbGVuYW1lKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXMuc3RhdHVzKDIwMCk7XG4gICAgICAgIC8vIFRPRE86IHJldHVybiB1c2VmdWwgSlNPTiBoZXJlP1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgbmV4dChcbiAgICAgICAgICBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgICBQYXJzZS5FcnJvci5GSUxFX0RFTEVURV9FUlJPUixcbiAgICAgICAgICAgICdDb3VsZCBub3QgZGVsZXRlIGZpbGUuJ1xuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFJhbmdlKHJhbmdlKSB7XG4gIGNvbnN0IHBhcnRzID0gcmFuZ2UucmVwbGFjZSgvYnl0ZXM9LywgJycpLnNwbGl0KCctJyk7XG4gIHJldHVybiB7XG4gICAgc3RhcnQ6IHBhcnNlSW50KHBhcnRzWzBdLCAxMCksXG4gICAgZW5kOiBwYXJ0c1sxXSA/IHBhcnNlSW50KHBhcnRzWzFdLCAxMCkgOiB1bmRlZmluZWQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUZpbGVTdHJlYW0oc3RyZWFtLCByZXMsIG1ldGEpIHtcbiAgY29uc3QgeyBzdGFydCwgZW5kLCBsZW5ndGgsIGNvbnRlbnRUeXBlIH0gPSBtZXRhO1xuXG4gIHJlcy53cml0ZUhlYWQoMjA2LCB7XG4gICAgJ0NvbnRlbnQtUmFuZ2UnOiAnYnl0ZXMgJyArIHN0YXJ0ICsgJy0nICsgZW5kICsgJy8nICsgbGVuZ3RoLFxuICAgICdBY2NlcHQtUmFuZ2VzJzogJ2J5dGVzJyxcbiAgICAnQ29udGVudC1MZW5ndGgnOiBlbmQgLSBzdGFydCArIDEsXG4gICAgJ0NvbnRlbnQtVHlwZSc6IGNvbnRlbnRUeXBlLFxuICB9KTtcblxuICBzdHJlYW0ucGlwZShyZXMpO1xufVxuIl19