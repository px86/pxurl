const urlInput = document.getElementById('url');
const result  = document.getElementById('result');
const updates = document.getElementById('updates');
const shortenBtn = document.getElementById('shorten-btn');
const label = document.querySelector('label[for="result"]');

label.addEventListener('click', () => {
  const shortUrl = result.value;
  if (shortUrl) {
    navigator.clipboard.writeText(shortUrl);
    updateMsg('Copied to clipboard!');
  }
});

shortenBtn.addEventListener('click', async () => {
  const url = urlInput.value;
  if (!url) {
    reportError('Please enter a valid URL!');
    return;
  }
  const data = { url };
  updateMsg('shortening... please wait!');
  const response = await postData('/', data);
  if (response.shortUrl) {
    updateMsg('URL shortened :)');
    result.value = response.shortUrl;
  } else {
    reportError('Oops, some error occured, please try later!');
  }
});

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return response.json();
}

function reportError(msg='') {
  updates.innerText = msg;
  const color = updates.style.color;
  updates.style.color = 'red';
  setTimeout(() => {
    updates.innerText = 'Paste the URL and hit the shorten button';
    updates.style.color = color;
  }, 3500);
}

function updateMsg(msg='') {
  updates.innerText = msg;
}
