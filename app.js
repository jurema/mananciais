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

// setInterval here
request('http://www2.sabesp.com.br/mananciais/DivulgacaoSiteSabesp.aspx', function (err, response, body) {
  if (err) {
    console.log('err');
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

  ret = data;
  return;

});

app.listen(3000);
