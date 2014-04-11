var request = require('request'),
    cheerio = require('cheerio'),
    express = require('express'),
    app = express();

var ret = {};

app.use(express.static('public'));
app.get('/api.json', function(req, res) {
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
  /*
  var cantareiraVol = dado[0].children[0].data,
  altoTieteVol = dado[4].children[0].data,
  guarapirangaVol = dado[8].children[0].data,
  altoCotiaVol = dado[12].children[0].data,
  rioGrandeVol = dado[16].children[0].data,
  rioClaroVol = dado[20].children[0].data;
  ret.cantareira = cantareiraVol;
  ret.tiete = altoTieteVol;
  ret.guarapiranga = guarapirangaVol;
  ret.cotia = altoCotiaVol;
  ret.riogrande = rioGrandeVol;
  ret.rioclaro = rioClaroVol;
  */
});

app.listen(3000);
