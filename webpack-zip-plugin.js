/* eslint-disable class-methods-use-this */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const archive = archiver('zip', {
  zip: true,
  zlib: { level: 9 },
});
class WebpackZipPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.done.tap('WebpackZipPlugin', (stats) => {
      const filePath = stats.compilation.options.output.path;
      const output = fs.createWriteStream(path.resolve(filePath, this.options.filename));
      archive.on('error', (err) => {
        throw err;
      });
      archive.pipe(output);
      fs.readdir(filePath, (error, files) => {
        files.forEach((file) => {
          if (this.options.include.indexOf(file) !== -1) {
            archive.file(path.resolve(filePath, file), { name: file });
          }
        });
        archive.finalize();
      });
    });
  }
}
module.exports = WebpackZipPlugin;
