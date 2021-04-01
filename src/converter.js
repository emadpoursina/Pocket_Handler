const axios = require('axios').default;
const { spawn } = require('child_process');
const fs = require('fs/promises');
const helper = require('./Helper');
const path = require('path');
const os = require('os');

// Convert options
const options = {
  cwd: __dirname + '/../article/',
};

let count = 0;

/**
 * 
 * @param {String} url 
 * @param {Object} article 
 * @param {String} outputPath 
 */
function urlToMobi(url, outputDir = __dirname + '/../article/mobi') {
  return new Promise(async (resolve, reject) => {
    // Make tmp folder
    fs.mkdtemp(path.join(os.tmpdir(), 'convert-'))
      .then((tmpDir) => {
        console.log('Folder has been made');

        return helper.getWebPage(url, tmpDir);
      })
      // Convert file to mobi
      .then((filePath) => {

				console.log(1, filePath, outputDir + '/' + count + '.mobi');
        const calibre = spawn('ebook-convert', [filePath, outputDir + '/' + count + '.mobi'], options);
				count++;

        calibre.on('error', (err) => {
          console.log('Convertion faild: ' + err);
          throw new Error(err);
        })

        calibre.stderr.pipe(process.stdin);

        calibre.on('close', (code) => {
          //fs.unlink(filePath);
          resolve(code);
        })
      })
      .catch(err => {
        reject(new Error(err));
      })
  })
}

module.exports = urlToMobi;
