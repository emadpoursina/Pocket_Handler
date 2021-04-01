const fs = require('fs');
const axios = require('axios');

class Helper {
  /**
   * Download and save a web page
   * @param {String} url 
   * Url of the web page
   * @param {String} [outputDir=__dirname/article/html/]
   * Where web page will be saved
   * @param {String} [fileName=new URL(url).pathname]
   * Name of the last html file
   * @returns {Promise} Resolve the outputDir, Reject errors
   */
  static #getWebPage(url, outputDir = `${__dirname}/../article/html/`, fileName) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
      })
      .then(response => {
        const webPageData = response.data;

        fs.appendFile(filePath, webPageData, (err) => {
          if(err)
            reject(err);

          console.log('Webpage saved');
          resolve(filePath);
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

        reject(new Error('Failed getting webPage.'));
      });
    });
  }

  /**
   * Validate and merge directory with file name
   * @param {String} directory 
   * @param {String} fileName 
   * @returns valid absolute file path
   */
  static #fullPath(directory, fileName) {
    if(fileName === '/' || !fileName)
      // Handle nameless web pages
      fileName += `Unknown_${new Date().getTime()}`

    // Path validation
    if(directory[directory.length - 1] === '/' && fileName[0] === '/')
      fileName = fileName.slice(1);
    else if(directory[directory.length - 1] !== '/' && fileName[0] !== '/')
      directory += '/';

    return directory + fileName;
  }

  /**
   * Download and save some web page
   * @param {String[]} urls
   * an array of the web pages url
   * @param {String} [outputDir=__dirname/article/html/]
   * Where web page will be saved
   * @param {String} fileName
   * For saving all urls in a sinle file
   * @returns {Promise} Resolve the outputDirs, Reject errors
   */
  getWebPages(urls, outputDir = `${__dirname}/../article/html/`, fileName) {
    return new Promise((resolve, reject) => {
      const processes = [];

      urls.forEach(url => {
        processes.push(Helper.#getWebPage(url, outputDir, fileName));
      });

      Promise.all(processes)
        .then(values => {
          console.log('All the web pages has been downloaded.');
          resolve(values);
        })
        .catch((err) => {
          reject(err);
        });
    })
  }
}

module.exports = new Helper();