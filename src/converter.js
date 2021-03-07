const axios = require('axios').default;

/**
 * 
 * @param {String} url 
 * @param {Object} article 
 * @param {String} outputPath 
 */
function urlToEpub(url, article, outputDir = __dirname + '/../article/') {
}

/**
 * 
 * @param {String} url 
 * @returns Webpage content
 */
function getWebPage(url) {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(response => {
        resolve(response.data);
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

module.exports = urlToEpub;