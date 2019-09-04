"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.GridFSBucketAdapter = void 0;

var _mongodb = require("mongodb");

var _FilesAdapter = require("./FilesAdapter");

var _defaults = _interopRequireDefault(require("../../defaults"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GridFSBucketAdapter extends _FilesAdapter.FilesAdapter {
  constructor(mongoDatabaseURI = _defaults.default.DefaultMongoURI, mongoOptions = {}) {
    super();
    this._databaseURI = mongoDatabaseURI;
    const defaultMongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    this._mongoOptions = Object.assign(defaultMongoOptions, mongoOptions);
  }

  _connect() {
    if (!this._connectionPromise) {
      this._connectionPromise = _mongodb.MongoClient.connect(this._databaseURI, this._mongoOptions).then(client => {
        this._client = client;
        return client.db(client.s.options.dbName);
      });
    }

    return this._connectionPromise;
  }

  _getBucket() {
    return this._connect().then(database => new _mongodb.GridFSBucket(database));
  } // For a given config object, filename, and data, store a file
  // Returns a promise


  async createFile(filename, data) {
    const bucket = await this._getBucket();
    const stream = await bucket.openUploadStream(filename);
    await stream.write(data);
    stream.end();
    return new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  }

  async deleteFile(filename) {
    const bucket = await this._getBucket();
    const documents = await bucket.find({
      filename: filename
    }).toArray();

    if (documents.length === 0) {
      throw new Error('FileNotFound');
    }

    return Promise.all(documents.map(doc => {
      return bucket.delete(doc._id);
    }));
  }

  async getFileData(filename) {
    const {
      stream
    } = await this.getFileStream(filename);
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', data => {
        chunks.push(data);
      });
      stream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      stream.on('error', err => {
        reject(err);
      });
    });
  }

  getFileLocation(config, filename) {
    return config.mount + '/files/' + config.applicationId + '/' + encodeURIComponent(filename);
  }

  async getFileStream(filename, options) {
    const bucket = await this._getBucket();
    const {
      start = 0,
      end
    } = options;
    let expectedEnd;
    if (end) expectedEnd = end + 1;
    const stream = bucket.openDownloadStreamByName(filename, {
      start,
      end: expectedEnd
    }); // Start reading from stream to get file meta

    stream.resume();
    return new Promise(resolve => stream.on('file', () => {
      const {
        file
      } = stream.s;
      resolve({
        stream,
        meta: _objectSpread({}, file, {
          start,
          end: end || file.length
        })
      });
    }));
  }

  handleShutdown() {
    if (!this._client) {
      return Promise.resolve();
    }

    return this._client.close(false);
  }

}

exports.GridFSBucketAdapter = GridFSBucketAdapter;
var _default = GridFSBucketAdapter;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9BZGFwdGVycy9GaWxlcy9HcmlkRlNCdWNrZXRBZGFwdGVyLmpzIl0sIm5hbWVzIjpbIkdyaWRGU0J1Y2tldEFkYXB0ZXIiLCJGaWxlc0FkYXB0ZXIiLCJjb25zdHJ1Y3RvciIsIm1vbmdvRGF0YWJhc2VVUkkiLCJkZWZhdWx0cyIsIkRlZmF1bHRNb25nb1VSSSIsIm1vbmdvT3B0aW9ucyIsIl9kYXRhYmFzZVVSSSIsImRlZmF1bHRNb25nb09wdGlvbnMiLCJ1c2VOZXdVcmxQYXJzZXIiLCJ1c2VVbmlmaWVkVG9wb2xvZ3kiLCJfbW9uZ29PcHRpb25zIiwiT2JqZWN0IiwiYXNzaWduIiwiX2Nvbm5lY3QiLCJfY29ubmVjdGlvblByb21pc2UiLCJNb25nb0NsaWVudCIsImNvbm5lY3QiLCJ0aGVuIiwiY2xpZW50IiwiX2NsaWVudCIsImRiIiwicyIsIm9wdGlvbnMiLCJkYk5hbWUiLCJfZ2V0QnVja2V0IiwiZGF0YWJhc2UiLCJHcmlkRlNCdWNrZXQiLCJjcmVhdGVGaWxlIiwiZmlsZW5hbWUiLCJkYXRhIiwiYnVja2V0Iiwic3RyZWFtIiwib3BlblVwbG9hZFN0cmVhbSIsIndyaXRlIiwiZW5kIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbiIsImRlbGV0ZUZpbGUiLCJkb2N1bWVudHMiLCJmaW5kIiwidG9BcnJheSIsImxlbmd0aCIsIkVycm9yIiwiYWxsIiwibWFwIiwiZG9jIiwiZGVsZXRlIiwiX2lkIiwiZ2V0RmlsZURhdGEiLCJnZXRGaWxlU3RyZWFtIiwiY2h1bmtzIiwicHVzaCIsIkJ1ZmZlciIsImNvbmNhdCIsImVyciIsImdldEZpbGVMb2NhdGlvbiIsImNvbmZpZyIsIm1vdW50IiwiYXBwbGljYXRpb25JZCIsImVuY29kZVVSSUNvbXBvbmVudCIsInN0YXJ0IiwiZXhwZWN0ZWRFbmQiLCJvcGVuRG93bmxvYWRTdHJlYW1CeU5hbWUiLCJyZXN1bWUiLCJmaWxlIiwibWV0YSIsImhhbmRsZVNodXRkb3duIiwi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O0FBQ0FoQyxJQUFBQSxNQUFNLENBQUNrQyxNQUFQO0FBRUEsV0FBTyxJQUFJOUIsT0FBSixDQUFZQyxPQUFPLElBQ3hCTCxNQUFNLENBQUNPLEVBQVAsQ0FBVSxNQUFWLEVBQWtCLE1BQU07QUFDdEIsWUFBTTtBQUFFNEIsUUFBQUE7QUFBRixVQUFXbkMsTUFBTSxDQUFDVixDQUF4QjtBQUVBZSxNQUFBQSxPQUFPLENBQUM7QUFDTkwsUUFBQUEsTUFETTtBQUVOb0MsUUFBQUEsSUFBSSxvQkFDQ0QsSUFERDtBQUVGSixVQUFBQSxLQUZFO0FBR0Y1QixVQUFBQSxHQUFHLEVBQUVBLEdBQUcsSUFBSWdDLElBQUksQ0FBQ3ZCO0FBSGY7QUFGRSxPQUFELENBQVA7QUFRRCxLQVhELENBREssQ0FBUDtBQWNEOztBQUVEeUIsRUFBQUEsY0FBYyxHQUFHO0FBQ2YsUUFBSSxDQUFDLEtBQUtqRCxPQUFWLEVBQW1CO0FBQ2pCLGFBQU9nQixPQUFPLENBQUNDLE9BQVIsRUFBUDtBQUNEOztBQUNELFdBQU8sS0FBS2pCLE9BQUwsQ0FBYWtELEtBQWIsQ0FBbUIsS0FBbkIsQ0FBUDtBQUNEOztBQTNIbUQ7OztlQThIdkN0RSxtQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuIEdyaWRGU0J1Y2tldEFkYXB0ZXJcbiBTdG9yZXMgZmlsZXMgaW4gTW9uZ28gdXNpbmcgR3JpZFN0b3JlXG4gUmVxdWlyZXMgdGhlIGRhdGFiYXNlIGFkYXB0ZXIgdG8gYmUgYmFzZWQgb24gbW9uZ29jbGllbnRcblxuIEBmbG93IHdlYWtcbiAqL1xuXG4vLyBAZmxvdy1kaXNhYmxlLW5leHRcbmltcG9ydCB7IE1vbmdvQ2xpZW50LCBHcmlkRlNCdWNrZXQsIERiIH0gZnJvbSAnbW9uZ29kYic7XG5pbXBvcnQgeyBGaWxlc0FkYXB0ZXIgfSBmcm9tICcuL0ZpbGVzQWRhcHRlcic7XG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi4vLi4vZGVmYXVsdHMnO1xuXG5leHBvcnQgY2xhc3MgR3JpZEZTQnVja2V0QWRhcHRlciBleHRlbmRzIEZpbGVzQWRhcHRlciB7XG4gIF9kYXRhYmFzZVVSSTogc3RyaW5nO1xuICBfY29ubmVjdGlvblByb21pc2U6IFByb21pc2U8RGI+O1xuICBfbW9uZ29PcHRpb25zOiBPYmplY3Q7XG5cbiAgY29uc3RydWN0b3IobW9uZ29EYXRhYmFzZVVSSSA9IGRlZmF1bHRzLkRlZmF1bHRNb25nb1VSSSwgbW9uZ29PcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2RhdGFiYXNlVVJJID0gbW9uZ29EYXRhYmFzZVVSSTtcblxuICAgIGNvbnN0IGRlZmF1bHRNb25nb09wdGlvbnMgPSB7XG4gICAgICB1c2VOZXdVcmxQYXJzZXI6IHRydWUsXG4gICAgICB1c2VVbmlmaWVkVG9wb2xvZ3k6IHRydWUsXG4gICAgfTtcbiAgICB0aGlzLl9tb25nb09wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRNb25nb09wdGlvbnMsIG1vbmdvT3B0aW9ucyk7XG4gIH1cblxuICBfY29ubmVjdCgpIHtcbiAgICBpZiAoIXRoaXMuX2Nvbm5lY3Rpb25Qcm9taXNlKSB7XG4gICAgICB0aGlzLl9jb25uZWN0aW9uUHJvbWlzZSA9IE1vbmdvQ2xpZW50LmNvbm5lY3QoXG4gICAgICAgIHRoaXMuX2RhdGFiYXNlVVJJLFxuICAgICAgICB0aGlzLl9tb25nb09wdGlvbnNcbiAgICAgICkudGhlbihjbGllbnQgPT4ge1xuICAgICAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XG4gICAgICAgIHJldHVybiBjbGllbnQuZGIoY2xpZW50LnMub3B0aW9ucy5kYk5hbWUpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9uUHJvbWlzZTtcbiAgfVxuXG4gIF9nZXRCdWNrZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3QoKS50aGVuKGRhdGFiYXNlID0+IG5ldyBHcmlkRlNCdWNrZXQoZGF0YWJhc2UpKTtcbiAgfVxuXG4gIC8vIEZvciBhIGdpdmVuIGNvbmZpZyBvYmplY3QsIGZpbGVuYW1lLCBhbmQgZGF0YSwgc3RvcmUgYSBmaWxlXG4gIC8vIFJldHVybnMgYSBwcm9taXNlXG4gIGFzeW5jIGNyZWF0ZUZpbGUoZmlsZW5hbWU6IHN0cmluZywgZGF0YSkge1xuICAgIGNvbnN0IGJ1Y2tldCA9IGF3YWl0IHRoaXMuX2dldEJ1Y2tldCgpO1xuICAgIGNvbnN0IHN0cmVhbSA9IGF3YWl0IGJ1Y2tldC5vcGVuVXBsb2FkU3RyZWFtKGZpbGVuYW1lKTtcbiAgICBhd2FpdCBzdHJlYW0ud3JpdGUoZGF0YSk7XG4gICAgc3RyZWFtLmVuZCgpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBzdHJlYW0ub24oJ2ZpbmlzaCcsIHJlc29sdmUpO1xuICAgICAgc3RyZWFtLm9uKCdlcnJvcicsIHJlamVjdCk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBkZWxldGVGaWxlKGZpbGVuYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBidWNrZXQgPSBhd2FpdCB0aGlzLl9nZXRCdWNrZXQoKTtcbiAgICBjb25zdCBkb2N1bWVudHMgPSBhd2FpdCBidWNrZXQuZmluZCh7IGZpbGVuYW1lOiBmaWxlbmFtZSB9KS50b0FycmF5KCk7XG4gICAgaWYgKGRvY3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRmlsZU5vdEZvdW5kJyk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgIGRvY3VtZW50cy5tYXAoZG9jID0+IHtcbiAgICAgICAgcmV0dXJuIGJ1Y2tldC5kZWxldGUoZG9jLl9pZCk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBhc3luYyBnZXRGaWxlRGF0YShmaWxlbmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgeyBzdHJlYW0gfSA9IGF3YWl0IHRoaXMuZ2V0RmlsZVN0cmVhbShmaWxlbmFtZSk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgY2h1bmtzID0gW107XG4gICAgICBzdHJlYW0ub24oJ2RhdGEnLCBkYXRhID0+IHtcbiAgICAgICAgY2h1bmtzLnB1c2goZGF0YSk7XG4gICAgICB9KTtcbiAgICAgIHN0cmVhbS5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICByZXNvbHZlKEJ1ZmZlci5jb25jYXQoY2h1bmtzKSk7XG4gICAgICB9KTtcbiAgICAgIHN0cmVhbS5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0RmlsZUxvY2F0aW9uKGNvbmZpZywgZmlsZW5hbWUpIHtcbiAgICByZXR1cm4gKFxuICAgICAgY29uZmlnLm1vdW50ICtcbiAgICAgICcvZmlsZXMvJyArXG4gICAgICBjb25maWcuYXBwbGljYXRpb25JZCArXG4gICAgICAnLycgK1xuICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KGZpbGVuYW1lKVxuICAgICk7XG4gIH1cblxuICBhc3luYyBnZXRGaWxlU3RyZWFtKGZpbGVuYW1lOiBzdHJpbmcsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBidWNrZXQgPSBhd2FpdCB0aGlzLl9nZXRCdWNrZXQoKTtcbiAgICBjb25zdCB7IHN0YXJ0ID0gMCwgZW5kIH0gPSBvcHRpb25zO1xuXG4gICAgbGV0IGV4cGVjdGVkRW5kO1xuXG4gICAgaWYgKGVuZCkgZXhwZWN0ZWRFbmQgPSBlbmQgKyAxO1xuXG4gICAgY29uc3Qgc3RyZWFtID0gYnVja2V0Lm9wZW5Eb3dubG9hZFN0cmVhbUJ5TmFtZShmaWxlbmFtZSwge1xuICAgICAgc3RhcnQsXG4gICAgICBlbmQ6IGV4cGVjdGVkRW5kLFxuICAgIH0pO1xuXG4gICAgLy8gU3RhcnQgcmVhZGluZyBmcm9tIHN0cmVhbSB0byBnZXQgZmlsZSBtZXRhXG4gICAgc3RyZWFtLnJlc3VtZSgpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT5cbiAgICAgIHN0cmVhbS5vbignZmlsZScsICgpID0+IHtcbiAgICAgICAgY29uc3QgeyBmaWxlIH0gPSBzdHJlYW0ucztcblxuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICBzdHJlYW0sXG4gICAgICAgICAgbWV0YToge1xuICAgICAgICAgICAgLi4uZmlsZSxcbiAgICAgICAgICAgIHN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBlbmQgfHwgZmlsZS5sZW5ndGgsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBoYW5kbGVTaHV0ZG93bigpIHtcbiAgICBpZiAoIXRoaXMuX2NsaWVudCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY2xpZW50LmNsb3NlKGZhbHNlKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHcmlkRlNCdWNrZXRBZGFwdGVyO1xuIl19