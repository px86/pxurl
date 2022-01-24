const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function genRandomString(length = 5) {
  let str = '';
  for (let i=0; i<length; ++i) {
    const indx = Math.floor(Math.random() * chars.length);
    str += chars[indx];
  }
  return str;
}

async function getShortUrl(collection, minlength=5) {
  let str;
  let tries = 0;

  while (true) {
    str = genRandomString(minlength);
    const result = await collection.findOne({ 'shortUrl': str });
    if (result == null) {
      break;
    }
    if (++tries > 25) {
      minlength++;
      tries = 0;
    }
  }
  console.log('short url: ', str);
  return str;
}

module.exports = getShortUrl;
