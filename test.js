const express = require('express');
const config = require('config');
const proxy = require('express-http-proxy');
const app = express();

// Middleware
app.use(express.json({ extended: false }));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
// app.use('/api/proxy', require('./routes/api/proxy'));
app.use('/api/notifications', require('./routes/api/notifications'));



let items = ['prev','last','first','next'];
var randomItem = items[Math.floor(Math.random()*items.length)];
// let 
// //Proxy Setup 
app.use('/proxy', proxy(`https://api.github.com/users/bradtraversy/repos?per_page=1&sort=created:asc&client_id=${
    config.get('githubClientId' )
}&client_secret=${
    config.get('githubSecret')}`, {
        userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
            console.log(proxyResData.length);
            return proxyResData;
          }
}));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
