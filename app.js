var request = require('request'),
    cheerio = require('cheerio'),
    express = require('express'),
    logger = require('morgan'),
    app = express();

var ret = {};

function log() {
  if (!arguments.length) return logger(' > :remote-addr - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms');
  var args = Array.prototype.slice.call(arguments);
  args.unshift(' > fetching data - [' + new Date().toUTCString() + '] -');
  console.log.apply(null, args);
}

app.use(log());
app.use(express.static('public'));
app.get('/api.json', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.json(ret);
});

function fetch() {
  request('http://www2.sabesp.com.br/mananciais/DivulgacaoSiteSabesp.aspx', function (err, response, body) {
    if (err) {
      log('failed.', err);
      ret = {};
      return;
    }

    var $ = cheerio.load(body),
        data = [];

    $('.guardaImgBgDetalhe').each(function() {
      var tr = $(this).parent();
      data.push({
        key: tr.find('.guardaImgBg').eq(0).text(),
        value: tr.find('.guardaImgBgDetalhe').eq(0).text()
      });
    });

    log('done.');
    if (data.length) ret = data;
  });
}

console.log('=> Server started');
setInterval(fetch, 1000 * 60 * 60 * 12); // 12 hours interval
fetch(); // first kick off
app.listen(process.env.PORT || 3000);
