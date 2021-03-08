const axios = require('axios').default;
const { spawn } = require('child_process');
const fs = require('fs');

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
    getWebPage(url)
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
  })
}

/**
 * 
 * @param {String} url 
 * @returns A readable stream of webpage content
 */
function getWebPage(url) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      responseType: 'stream',
    })
    .then(response => {
      const dataStream = response.data;

      dataStream.on('error', (err) => {
        console.log('Download faild: ' + err);
        throw new Error('Download faild');
      });

      resolve(dataStream);
    })
    .catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.headers['x-error-code'], error.response.headers['x-error']);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config.url, error.config.method, error.config.headers, error.config.data);

      reject('Request Faild');
    });
  });
}

module.exports = urlToMobi;