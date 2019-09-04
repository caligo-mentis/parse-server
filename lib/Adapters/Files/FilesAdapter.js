"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.FilesAdapter = void 0;

/*eslint no-unused-vars: "off"*/
// Files Adapter
//
// Allows you to change the file storage mechanism.
//
// Adapter classes must implement the following functions:
// * createFile(filename, data, contentType)
// * deleteFile(filename)
// * getFileStream(filename, options)
// * getFileProperties(filename)
// * getFileLocation(config, filename)
//
// Default is GridFSBucketAdapter, which requires mongo
// and for the API server to be using the DatabaseController with Mongo
// database adapter.

/**
 * @module Adapters
 */

/**
 * @interface FilesAdapter
 */
class FilesAdapter {
  /** Responsible for storing the file in order to be retrieved later by its filename
   *
   * @param {string} filename - the filename to save
   * @param {*} data - the buffer of data from the file
   * @param {string} contentType - the supposed contentType
   * @discussion the contentType can be undefined if the controller was not able to determine it
   *
   * @return {Promise} a promise that should fail if the storage didn't succeed
   */
  createFile(filename, data, contentType) {}
  /** Responsible for deleting the specified file
   *
   * @param {string} filename - the filename to delete
   *
   * @return {Promise} a promise that should fail if the deletion didn't succeed
   */


  deleteFile(filename) {}
  /** Responsible for retrieving the data of the specified file as stream
   *
   * @param {string} filename - the name of file to retrieve
   * @param {object} [options.start] - start byte of data range
   * @param {object} [options.end] - end byte of data range
   *
   * @return {Promise} a promise that should pass with the stream object or fail on error
   */


  getFileStream(filename, options) {}
  /** Returns file properties with required `length` property
   *
   * @param {string} filename - the name of file to retrieve
   *
   * @return {Promise} a promise that should pass object with file params
   */


  getFileProperties(filename) {}
  /** Returns an absolute URL where the file can be accessed
   *
   * @param {Config} config - server configuration
   * @param {string} filename
   *
   * @return {string} Absolute URL
   */


  getFileLocation(config, filename) {}

}

exports.FilesAdapter = FilesAdapter;
var _default = FilesAdapter;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9BZGFwdGVycy9GaWxlcy9GaWxlc0FkYXB0ZXIuanMiXSwibmFtZXMiOlsiRmlsZXNBZGFwdGVyIiwiY3JlYXRlRmlsZSIsImZpbGVuYW1lIiwiZGF0YSIsImNvbnRlbnRUeXBlIiwiZGVsZXRlRmlsZSIsImdldEZpbGVTdHJlYW0iLCJvcHRpb25zIiwiZ2V0RmlsZVByb3BlcnRpZXMiLCJnZXRGaWxlTG9jYXRpb24iLCJjb25maWciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7Ozs7QUFHQTs7O0FBR08sTUFBTUEsWUFBTixDQUFtQjtBQUN4Qjs7Ozs7Ozs7O0FBU0FDLEVBQUFBLFVBQVUsQ0FBQ0MsUUFBRCxFQUFtQkMsSUFBbkIsRUFBeUJDLFdBQXpCLEVBQXVELENBQUU7QUFFbkU7Ozs7Ozs7O0FBTUFDLEVBQUFBLFVBQVUsQ0FBQ0gsUUFBRCxFQUE0QixDQUFFO0FBRXhDOzs7Ozs7Ozs7O0FBUUFJLEVBQUFBLGFBQWEsQ0FBQ0osUUFBRCxFQUFtQkssT0FBbkIsRUFBcUMsQ0FBRTtBQUVwRDs7Ozs7Ozs7QUFNQUMsRUFBQUEsaUJBQWlCLENBQUNOLFFBQUQsRUFBNEIsQ0FBRTtBQUUvQzs7Ozs7Ozs7O0FBT0FPLEVBQUFBLGVBQWUsQ0FBQ0MsTUFBRCxFQUFpQlIsUUFBakIsRUFBMkMsQ0FBRTs7QUE3Q3BDOzs7ZUFnRFhGLFkiLCJzb3VyY2VzQ29udGVudCI6WyIvKmVzbGludCBuby11bnVzZWQtdmFyczogXCJvZmZcIiovXG4vLyBGaWxlcyBBZGFwdGVyXG4vL1xuLy8gQWxsb3dzIHlvdSB0byBjaGFuZ2UgdGhlIGZpbGUgc3RvcmFnZSBtZWNoYW5pc20uXG4vL1xuLy8gQWRhcHRlciBjbGFzc2VzIG11c3QgaW1wbGVtZW50IHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zOlxuLy8gKiBjcmVhdGVGaWxlKGZpbGVuYW1lLCBkYXRhLCBjb250ZW50VHlwZSlcbi8vICogZGVsZXRlRmlsZShmaWxlbmFtZSlcbi8vICogZ2V0RmlsZVN0cmVhbShmaWxlbmFtZSwgb3B0aW9ucylcbi8vICogZ2V0RmlsZVByb3BlcnRpZXMoZmlsZW5hbWUpXG4vLyAqIGdldEZpbGVMb2NhdGlvbihjb25maWcsIGZpbGVuYW1lKVxuLy9cbi8vIERlZmF1bHQgaXMgR3JpZEZTQnVja2V0QWRhcHRlciwgd2hpY2ggcmVxdWlyZXMgbW9uZ29cbi8vIGFuZCBmb3IgdGhlIEFQSSBzZXJ2ZXIgdG8gYmUgdXNpbmcgdGhlIERhdGFiYXNlQ29udHJvbGxlciB3aXRoIE1vbmdvXG4vLyBkYXRhYmFzZSBhZGFwdGVyLlxuXG5pbXBvcnQgdHlwZSB7IENvbmZpZyB9IGZyb20gJy4uLy4uL0NvbmZpZyc7XG4vKipcbiAqIEBtb2R1bGUgQWRhcHRlcnNcbiAqL1xuLyoqXG4gKiBAaW50ZXJmYWNlIEZpbGVzQWRhcHRlclxuICovXG5leHBvcnQgY2xhc3MgRmlsZXNBZGFwdGVyIHtcbiAgLyoqIFJlc3BvbnNpYmxlIGZvciBzdG9yaW5nIHRoZSBmaWxlIGluIG9yZGVyIHRvIGJlIHJldHJpZXZlZCBsYXRlciBieSBpdHMgZmlsZW5hbWVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVuYW1lIC0gdGhlIGZpbGVuYW1lIHRvIHNhdmVcbiAgICogQHBhcmFtIHsqfSBkYXRhIC0gdGhlIGJ1ZmZlciBvZiBkYXRhIGZyb20gdGhlIGZpbGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnRUeXBlIC0gdGhlIHN1cHBvc2VkIGNvbnRlbnRUeXBlXG4gICAqIEBkaXNjdXNzaW9uIHRoZSBjb250ZW50VHlwZSBjYW4gYmUgdW5kZWZpbmVkIGlmIHRoZSBjb250cm9sbGVyIHdhcyBub3QgYWJsZSB0byBkZXRlcm1pbmUgaXRcbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgc2hvdWxkIGZhaWwgaWYgdGhlIHN0b3JhZ2UgZGlkbid0IHN1Y2NlZWRcbiAgICovXG4gIGNyZWF0ZUZpbGUoZmlsZW5hbWU6IHN0cmluZywgZGF0YSwgY29udGVudFR5cGU6IHN0cmluZyk6IFByb21pc2Uge31cblxuICAvKiogUmVzcG9uc2libGUgZm9yIGRlbGV0aW5nIHRoZSBzcGVjaWZpZWQgZmlsZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZW5hbWUgLSB0aGUgZmlsZW5hbWUgdG8gZGVsZXRlXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB0aGF0IHNob3VsZCBmYWlsIGlmIHRoZSBkZWxldGlvbiBkaWRuJ3Qgc3VjY2VlZFxuICAgKi9cbiAgZGVsZXRlRmlsZShmaWxlbmFtZTogc3RyaW5nKTogUHJvbWlzZSB7fVxuXG4gIC8qKiBSZXNwb25zaWJsZSBmb3IgcmV0cmlldmluZyB0aGUgZGF0YSBvZiB0aGUgc3BlY2lmaWVkIGZpbGUgYXMgc3RyZWFtXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlbmFtZSAtIHRoZSBuYW1lIG9mIGZpbGUgdG8gcmV0cmlldmVcbiAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zLnN0YXJ0XSAtIHN0YXJ0IGJ5dGUgb2YgZGF0YSByYW5nZVxuICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnMuZW5kXSAtIGVuZCBieXRlIG9mIGRhdGEgcmFuZ2VcbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgc2hvdWxkIHBhc3Mgd2l0aCB0aGUgc3RyZWFtIG9iamVjdCBvciBmYWlsIG9uIGVycm9yXG4gICAqL1xuICBnZXRGaWxlU3RyZWFtKGZpbGVuYW1lOiBzdHJpbmcsIG9wdGlvbnMpOiBQcm9taXNlIHt9XG5cbiAgLyoqIFJldHVybnMgZmlsZSBwcm9wZXJ0aWVzIHdpdGggcmVxdWlyZWQgYGxlbmd0aGAgcHJvcGVydHlcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVuYW1lIC0gdGhlIG5hbWUgb2YgZmlsZSB0byByZXRyaWV2ZVxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgdGhhdCBzaG91bGQgcGFzcyBvYmplY3Qgd2l0aCBmaWxlIHBhcmFtc1xuICAgKi9cbiAgZ2V0RmlsZVByb3BlcnRpZXMoZmlsZW5hbWU6IHN0cmluZyk6IFByb21pc2Uge31cblxuICAvKiogUmV0dXJucyBhbiBhYnNvbHV0ZSBVUkwgd2hlcmUgdGhlIGZpbGUgY2FuIGJlIGFjY2Vzc2VkXG4gICAqXG4gICAqIEBwYXJhbSB7Q29uZmlnfSBjb25maWcgLSBzZXJ2ZXIgY29uZmlndXJhdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZW5hbWVcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBBYnNvbHV0ZSBVUkxcbiAgICovXG4gIGdldEZpbGVMb2NhdGlvbihjb25maWc6IENvbmZpZywgZmlsZW5hbWU6IHN0cmluZyk6IHN0cmluZyB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBGaWxlc0FkYXB0ZXI7XG4iXX0=