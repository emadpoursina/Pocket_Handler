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
    console.log(requestToken);
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

  return makeRequest(requestUrl, requestBody, option);
}

function makeRequest(url, body, option) {
  return new Promise((resolve, reject) => {
    axios.post(url, body, option)
      .then(response => {
        if(response.status === 200) {
          resolve(response.data.code);
        }else {
          reject(new Error(response.status.toString()));
        }
      })
      .catch(e => {
        resolve(e);
      })
  })
}

module.exports = getArticle;