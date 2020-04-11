const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const http = require('http');
const https = require('https');
const fs = require('fs');

const app = express();
const port = 3000;

// App configuration
app.use(express.json());
app.use(cookieParser('secret', {
  sameSite: true,
}));

app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../static/login.html')));

app.post('/authenticate', (req, res) => {
  const {idToken} = req.body;
  if (idToken) {
    res.cookie('idToken', idToken, {
      sameSite: true,
      signed: 'secret',
    });
    res.send('Successful authentication');
  } else {
    res.status(500).send('Invalid ID Token');
  }
});

app.post('/logout', (req, res) => {
  res.cookie('idToken', '', {
    maxAge: 0
  });
  res.send('Successful logout');
});

// Authentication
app.use((req, res, next) => {
  const { idToken } = req.signedCookies;
  if (idToken) {
    return next();
  }

  return res.redirect('/login?redirect_url=' + encodeURI(req.url));
});

app.use(express.static('../static'));

app.get('/', (req, res) => res.send('Home endpoint'));
app.get('/test', (req, res) => res.send('Test endpoint'));

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

let server;
if (process.env.NODE_ENV === 'production') {
  const credentials = {
    key: fs.readFileSync('/etc/letsencrypt/live/wiki-test.johndyer.dev/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/wiki-test.johndyer.dev/cert.pem', 'utf8'),
    ca: fs.readFileSync('/etc/letsencrypt/live/wiki-test.johndyer.dev/chain.pem', 'utf8')
  }
  server = https.createServer(credentials, app);
} else {
  server = http.createServer(app);
}

server.listen(port, () => console.log(`App listening at http://localhost:${port}`));
