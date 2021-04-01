const axios = require('axios').default;
const open = require('open');

class Pocket {
  constructor(consumerKey, redirectUri, accessToken) {
    this.consumerKey = consumerKey;
    this.redirectUri = redirectUri;
    this.accessToken = accessToken;
  }

  /**
   * Pocket authentication 
   * @param {String} consumerKey 
   * The pocket account consumer key witch you need for authorization
   * @param {String} redirectUri 
   * The url that pocket at the end of authorization send you there
   * @returns An object of type pocket
   */
  static async build(consumerKey, redirectUri) {
    const requestToken = await obtainRequestToken(consumerKey, redirectUri);

    await open(`https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirectUri}`, {
      wait: true,
      app: 'google-chrome',
    });

    const accessToken = await obtainAccessToken(consumerKey, requestToken);

    return new Pocket(consumerKey, redirectUri, accessToken);
  }

  /**
   * 
   * @param {Object} filter 
   * @returns Array of articles
   */
  async getArticle(filter) {
    Object.assign(filter, { consumer_key: this.consumerKey, access_token: this.accessToken })

    const response =  await makeRequest('https://getpocket.com/v3/get', filter, { 'Content-Type': 'application/json' });
    return response.list;
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

/**
 * 
 * @param {String} url 
 * @param {Object} body 
 * @param {Object} option 
 * @returns 
 */
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
  })
}

module.exports = Pocket;