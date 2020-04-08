const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

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

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
