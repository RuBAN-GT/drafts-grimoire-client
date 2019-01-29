var path          = require('path');
var express       = require('express');
var prerenderNode = require('prerender-node');
var redis         = require('redis');

var cache = redis.createClient();
var port  = process.env.PORT || 8080;
var host  = process.env.HOST || '0.0.0.0';
var app   = express();

prerenderNode.set(
  'crawlerUserAgents',
  prerenderNode.crawlerUserAgents.concat([
    'googlebot',
    'bingbot',
    'yahoo',
    'Mail.RU',
    'yandexbot',
    'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)'
  ])
);
prerenderNode.set('prerenderServiceUrl', 'http://localhost:3103/');
prerenderNode.set('beforeRender', function(req, done) {
  cache.get(req.url, done);
});
prerenderNode.set('afterRender', function(err, req, prerender_res) {
  cache.set(req.url, prerender_res.body);
});

app.use(prerenderNode);
app.use(express.static(__dirname + '/dist'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

console.info('Starting of server...');

app.listen(port, host, function(error) {
  console.info(`Listening ${host}:${port}. Visit http://${host}:${port} in your browser.`);

  if (error) console.error(error);
});
