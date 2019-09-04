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

import type { Config } from '../../Config';
/**
 * @module Adapters
 */
/**
 * @interface FilesAdapter
 */
export class FilesAdapter {
  /** Responsible for storing the file in order to be retrieved later by its filename
   *
   * @param {string} filename - the filename to save
   * @param {*} data - the buffer of data from the file
   * @param {string} contentType - the supposed contentType
   * @discussion the contentType can be undefined if the controller was not able to determine it
   *
   * @return {Promise} a promise that should fail if the storage didn't succeed
   */
  createFile(filename: string, data, contentType: string): Promise {}

  /** Responsible for deleting the specified file
   *
   * @param {string} filename - the filename to delete
   *
   * @return {Promise} a promise that should fail if the deletion didn't succeed
   */
  deleteFile(filename: string): Promise {}

  /** Responsible for retrieving the data of the specified file as stream
   *
   * @param {string} filename - the name of file to retrieve
   * @param {object} [options.start] - start byte of data range
   * @param {object} [options.end] - end byte of data range
   *
   * @return {Promise} a promise that should pass with the stream object or fail on error
   */
  getFileStream(filename: string, options): Promise {}

  /** Returns file properties with required `length` property
   *
   * @param {string} filename - the name of file to retrieve
   *
   * @return {Promise} a promise that should pass object with file params
   */
  getFileProperties(filename: string): Promise {}

  /** Returns an absolute URL where the file can be accessed
   *
   * @param {Config} config - server configuration
   * @param {string} filename
   *
   * @return {string} Absolute URL
   */
  getFileLocation(config: Config, filename: string): string {}
}

export default FilesAdapter;
