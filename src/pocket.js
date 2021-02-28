const axios = require('axios').default;
const { pocketInfo } = require('../.config');

const url = 'https://getpocket.com/v3/get';
const body = {
  consumer_key: pocketInfo.consumer_key,
  redirect_uri: 'Pocket2kindle:authorizationFinished'
};

const option = {
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Accept': 'application/json'
  }
};