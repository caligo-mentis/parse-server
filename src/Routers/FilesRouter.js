import express from 'express';
import BodyParser from 'body-parser';
import * as Middlewares from '../middlewares';
import Parse from 'parse/node';
import Config from '../Config';
import mime from 'mime';
import logger from '../logger';

export class FilesRouter {
  expressRouter({ maxUploadSize = '20Mb' } = {}) {
    var router = express.Router();
    router.get('/files/:appId/:filename', this.getHandler);

    router.post('/files', function(req, res, next) {
      next(
        new Parse.Error(Parse.Error.INVALID_FILE_NAME, 'Filename not provided.')
      );
    });

    router.post(
      '/files/:filename',
      BodyParser.raw({
        type: () => {
          return true;
        },
        limit: maxUploadSize,
      }), // Allow uploads without Content-Type, or with any Content-Type.
      Middlewares.handleParseHeaders,
      this.createHandler
    );

    router.delete(
      '/files/:filename',
      Middlewares.handleParseHeaders,
      Middlewares.enforceMasterKeyAccess,
      this.deleteHandler
    );
    return router;
  }

  getHandler(req, res) {
    const config = Config.get(req.params.appId);
    const filesController = config.filesController;

    const range = req.get('Range');
    const filename = req.params.filename;

    res.set('Content-Type', mime.getType(filename));

    filesController
      .getFileProperties(config, filename)
      .then(properties => {
        const { length } = properties;
        let options;

        if (range) {
          options = getRange(range);

          const { start = 0, end = length } = options;

          res.writeHead(206, {
            'Accept-Ranges': 'bytes',
            'Content-Range': `bytes ${start}-${end}/${length}`,
            'Content-Length': end - start + 1,
          });
        } else {
          res.status(200);
          res.set('Content-Length', length);
        }

        return filesController.getFileStream(config, filename, options);
      })
      .then(stream => stream.pipe(res))
      .catch(() => fileNotFound(res));
  }

  createHandler(req, res, next) {
    if (!req.body || !req.body.length) {
      next(
        new Parse.Error(Parse.Error.FILE_SAVE_ERROR, 'Invalid file upload.')
      );
      return;
    }

    if (req.params.filename.length > 128) {
      next(
        new Parse.Error(Parse.Error.INVALID_FILE_NAME, 'Filename too long.')
      );
      return;
    }

    if (!req.params.filename.match(/^[_a-zA-Z0-9][a-zA-Z0-9@\.\ ~_-]*$/)) {
      next(
        new Parse.Error(
          Parse.Error.INVALID_FILE_NAME,
          'Filename contains invalid characters.'
        )
      );
      return;
    }

    const filename = req.params.filename;
    const contentType = req.get('Content-type');
    const config = req.config;
    const filesController = config.filesController;

    filesController
      .createFile(config, filename, req.body, contentType)
      .then(result => {
        res.status(201);
        res.set('Location', result.url);
        res.json(result);
      })
      .catch(e => {
        logger.error('Error creating a file: ', e);
        next(
          new Parse.Error(
            Parse.Error.FILE_SAVE_ERROR,
            `Could not store file: ${filename}.`
          )
        );
      });
  }

  deleteHandler(req, res, next) {
    const filesController = req.config.filesController;
    filesController
      .deleteFile(req.config, req.params.filename)
      .then(() => {
        res.status(200);
        // TODO: return useful JSON here?
        res.end();
      })
      .catch(() => {
        next(
          new Parse.Error(
            Parse.Error.FILE_DELETE_ERROR,
            'Could not delete file.'
          )
        );
      });
  }
}

function fileNotFound(res) {
  res.status(404);
  res.set('Content-Type', 'text/plain');
  res.end('File not found.');
}

function getRange(range) {
  const parts = range.replace(/bytes=/, '').split('-');
  return {
    start: parseInt(parts[0], 10),
    end: parts[1] ? parseInt(parts[1], 10) : undefined,
  };
}
