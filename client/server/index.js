const { resolve } = require('path');
const express = require('express');

const rootFolder = resolve('.');
const app = express();
const port = 5600;
const host = '0.0.0.0';

app.use(express.static(`${rootFolder}/dist`));

app.get('/*', (req, res) => {
  res.sendFile(`${rootFolder}/dist/index.html`);
});

app.listen(port, host, async (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('app started');
});
