const express = require('express');
const axios = require('axios');
const redis = require('redis');

const app = express();
const redisClient = redis.createClient();

app.get('/', (req, res) => {
  const username = req.query.username || 'devahoy';

  const url = `https://api.github.com/users/${username}`;

  redisClient.get(username, async (err, reply) => {
    if (reply) {
      return res.json(JSON.parse(reply));
    }

    const response = await axios.get(url);
    redisClient.setex(username, 60, JSON.stringify(response.data));

    return res.json(response.data);
  });
});

app.listen(9000, () => {
  console.log('running');
});
