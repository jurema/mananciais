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

  // jquery
  var $ = cheerio.load(body);
  var dado = $(body).find('.guardaImgBgDetalhe'),

  cantareiraVol = dado[0].children[0].data,
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
  console.log(dado[0].children[0].data);
});

app.listen(3000);
