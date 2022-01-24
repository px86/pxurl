const express = require('express');
const dotenv  = require('dotenv');
const path    = require('path');
const initDB  = require('./db');
const getShortUrl = require('./util');

dotenv.config();
const port = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));

app.get('/', (_req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

app.post('/', async (req, res) => {
  const url = req.body.url;
  const shortUrl = await getShortUrl(collection);
  console.log(shortUrl);
  try {
    await collection.insertOne({ url, shortUrl });
    const resData = {
      'url': url,
      'shortUrl': req.hostname + '/' + shortUrl
    };
    res.status(200).json(resData);
  } catch (err) {
    console.error(`Error: insertion failed ${err}`);
    res.status(500).json({
      error: 'internal server error'
    });
  }
});

app.get(new RegExp('/[a-zA-Z0-9]{5,}'), async (req, res) => {
  const shortUrl = req.url.substring(1);
  if (shortUrl.length < 5) {
    res.redirect('/');
  } else {
    const result = await collection.findOne({ 'shortUrl': shortUrl });
    if (result == null) res.send('nope');
    else res.redirect(result.url);
  }
});

let collection;
async function main() {
  const dbData = {
    dbURI: process.env.DB_URI,
    dbName: process.env.DB_NAME,
    collectionName: process.env.COLLECTION_NAME
  };

  collection = await initDB(dbData);
  console.log(collection);

  app.listen(port, () => {
    console.log(`Server is listening at port: ${port}`);
  });
}

main();
