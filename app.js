var request = require('request'),
    cheerio = require('cheerio'),
    express = require('express'),
    app = express();

var ret = {};

app.use(express.static('public'));
app.get('/api.json', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.json(ret);
});

function fetch() {
  console.log(' -> Fetching data...');
  request('http://www2.sabesp.com.br/mananciais/DivulgacaoSiteSabesp.aspx', function (err, response, body) {
    if (err) {
      console.log('    Something went wrong', err);
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

    console.log('    Done!');
    if (data.length) ret = data;
  });
}

console.log('==> Server started');
setInterval(fetch, 1000 * 60 * 60 * 12); // 12 hours interval
fetch(); // first kick off
app.listen(process.env.PORT || 3000);
