const express = require('express');
const axios = require('axios');
const redis = require('redis');
const { promisify } = require('util');

const app = express();
const redisClient = redis.createClient();

const asyncGet = promisify(redisClient.get).bind(redisClient);

app.get('/', async (req, res) => {
  const username = req.query.username || 'devahoy';

  const url = `https://api.github.com/users/${username}`;

  const reply = await asyncGet(username);
  if (reply) {
    return res.json(JSON.parse(reply));
  }

  const response = await axios.get(url);
  redisClient.setex(username, 60, JSON.stringify(response.data));

  return res.json(response.data);
});

app.listen(9000, () => {
  console.log('running');
});
