const axios = require('axios').default;
const open = require('open');

const consumerKey = "96126-d71e8b7e2255a5075eb0c83c";
const redirectUri = "https://www.google.com";

/**
 * Return an array of pocket account articles
 */
async function getArticle() {
  try {
    const requestToken = await obtainRequestToken(consumerKey, redirectUri);

    await open(`https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirectUri}`);

  } catch (error) {
    console.log(new Error(error));
  }
}

/**
 * 
 * @param {String} consumerKey 
 * @param {String} redirectUri 
 * @returns String - Request Token
 */
async function obtainRequestToken(consumerKey, redirectUri) {
  const requestUrl = 'https://getpocket.com/v3/oauth/request';
  const requestBody = {
    consumer_key: consumerKey,
    redirect_uri: redirectUri,
  }
  const option = {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Accept': 'application/json'
    }
  };

  const data = await makeRequest(requestUrl, requestBody, option);
  return data.code;
}

function makeRequest(url, body, option) {
  return new Promise((resolve, reject) => {
    axios.post(url, body, option)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);

        reject(error);
      });
  })
}

module.exports = getArticle;