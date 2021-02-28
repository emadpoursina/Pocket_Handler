const axios = require('axios').default;
const { pocketInfo } = require('../.config');

const url = 'https://getpocket.com/v3/oauth/request';
const body = {
  consumer_key: pocketInfo.consumer_key,
  redirect_uri: "pocketapp1234:authorizationFinished"
};

const option = {
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Accept': 'application/json'
  }
};

function getArticle() {
  axios.post(url, body, option)
  .then(res => {
    if(res.status === 200) {
      const requestToken = res.data.code;
    }
  })
  .catch(function (error) {
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
  });
}

getArticle();

module.exports = getArticle;