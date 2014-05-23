var request = require('request'),
    cheerio = require('cheerio'),
    express = require('express'),
    logger = require('morgan'),
    app = express();

var ret = {};

// connect.logger + customization
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
    request('http://site.sabesp.com.br/imprensa/noticias-detalhe.aspx?secaoId=66&id=6248', function(err, response, body) {
        if (err) {
            log('failed.', err);
            ret = {};
            return;
        }

        var $ = cheerio.load(body),
            data = [];

        $('.bgrBottomLeft table tbody tr').each(function() {
            var td = $(this).children();
            if (td.eq(1).text() === '') return;
            data.push({
                key: td.eq(0).text(),
                value: td.eq(1).text()
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