const axios = require('axios').default;
const { spawn } = require('child_process');
const fs = require('fs');
const helper = require('./Helper');

// Convert options
const options = {
  cwd: __dirname + '/../article/',
};
// Temprory folder for application
const tmpDir = '/tmp/ebookConverter/';

/**
 * 
 * @param {String} url 
 * @param {Object} article 
 * @param {String} outputPath 
 */
function urlToMobi(url, outputDir = __dirname + '/../article/') {
  return new Promise((resolve, reject) => {
    helper.getWebPage(url)
      // Make tmp folder
      .then(dataStream => {
        console.log(1);

        if (!fs.existsSync(tmpDir)) {
          fs.mkdir(tmpDir, (err) => {
            if (err){
              console.log('Folder creation faild because ' + err);
              throw new Error('Folder creation faild because ' + err);
            }

            return dataStream;
          })
        }
        return dataStream;
      })
      // Save data to html file
      .then((dataStream) => {
        console.log(2);

        const inputDir = tmpDir + new Date().toString() + '.html';

        dataStream.pipe(fs.createWriteStream(inputDir));
        dataStream.on('end', () => {
          console.log('No more data to download.');

          return spawn('ebook-convert', [inputDir, outputDir], options);
        });

        console.log(inputDir, outputDir);
        return spawn('ebook-convert', [inputDir, outputDir], options);
      })
      // Convert file to mobi
      .then((calibre) => {
        console.log(3);

        calibre.on('error', (err) => {
          console.log('Convertion faild: ' + err);
          throw new Error(err);
        })
      })
      .then((code) => {
        resolve('Opration ended with code ' + code);
      })
      .catch(err => {
        reject(new Error('Failed to generate Ebook because of ', err));
      })
  })
}

module.exports = urlToMobi;