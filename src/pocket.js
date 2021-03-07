const axios = require('axios').default;
const open = require('open');

class Pocket {
  constructor(consumerKey, redirectUri) {
    this.consumerKey = consumerKey;
    this.redirectUri = redirectUri;

    obtainRequestToken(consumerKey, redirectUri)
      .then(async requestToken => {
        await open(`https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirectUri}`, {
          wait: true,
          app: 'google-chrome',
        });

        return 0;
      })
      .then(() => {
        this.AccessToken = obtainAccessToken(consumerKey, requestToken);
      })
  }
}


/**
 * 
 * @param {String} consumerKey 
 * @param {String} redirectUri 
 * @returns String - Exchange request token with access token
 */
async function obtainAccessToken(consumer_key, requestToken) {
  const requestUrl = 'https://getpocket.com/v3/oauth/authorize';
  const requestBody = {
    consumer_key,
    code: requestToken,
  }
  const option = {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Accept': 'application/json'
    }
  };

  const data = await makeRequest(requestUrl, requestBody, option);
  return data.access_token;
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

module.exports = new Pocket('96126-d71e8b7e2255a5075eb0c83c', 'https://www.google.com');