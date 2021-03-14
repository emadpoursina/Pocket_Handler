const fs = require('fs');

class Helper {
  /**
   * 
   * @param {String} url 
   * @returns A readable stream of webpage content
   */
  getWebPage(url, outputPath = '../article/html') {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
      })
      .then(response => {
        const webPageData = response.data;

        console.log('webPage recived!');

        fs.appendFile(outputPath, webPageData, () => {
          console.log('Webpage saved.');

          resolve(200);
        });
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

        reject('Failed getting webPage.');
      });
    });
  }
}

module.exports = new Helper();