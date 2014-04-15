//config
var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'app/public/templates/home.html',
            controller: 'homeCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

app.run(function($rootScope, $http) {
    $http({
        method: 'GET',
        url: 'http://api.matheus.co/api.json'
    }).
    success(function(data, status, headers, config) {
        $rootScope.dados = data;
        console.log('success');
    }).
    error(function(data, status, headers, config) {
        console.log('err!');
    });
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=576717435757549";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    ! function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
            p = /^http:/.test(d.location) ? 'http' : 'https';
        if (!d.getElementById(id)) {
            js = d.createElement(s);
            js.id = id;
            js.src = p + '://platform.twitter.com/widgets.js';
            fjs.parentNode.insertBefore(js, fjs);
        }
    }(document, 'script', 'twitter-wjs');
});

//controllers
app.controller('homeCtrl', function($scope, $timeout, $rootScope) {
    var indicatorAnimate = function() {
        $('.indicator').css('top', '62%').removeClass('rotate');
        $('.water').css('height', '35%');
    };
    $timeout(indicatorAnimate, 500);
    $('.represas h3 a').click(function() {
        $('.value').removeClass('rotate-inverse');
        $('.indicator').removeClass('rotate');
        $('.change').css('background', 'url(app/public/assets/images/arrow-down.png) no-repeat 95% 23px rgba(32, 47, 48, 0.9)');
        var wrongVolume = $(this).attr("data-volume"),
            againWrongVolume = wrongVolume.substring(0, wrongVolume.length - 2),
            volume = parseInt(againWrongVolume.replace(',', '.'), 10) + parseInt(1, 10),
            indicator = 97 - volume,
            animate = function() {
                if (id === "none") {
                    $('.water').css('height', '35%');
                    $('.indicator').css('top', '62%');
                } else {
                    if (volume < 100) {
                        $('.indicator').css('top', '' + indicator + '%').removeClass('rotate');
                        $('.water').css('height', '' + volume + '%');
                        $('.value').removeClass('rotate-inverse');
                    } else {
                        $('.indicator').css('top', '1%').addClass('rotate');
                        setTimeout(function() {
                            $('.value').addClass('rotate-inverse');
                        }, 2200);
                        $('.water').css('height', '99%');
                    }
                }
            },
            id = $(this).attr("data-id");
        $timeout(animate, 500);
        $('.represas').toggle();
        $('.change').text('' + $(this).text() + '');
        jQuery({
            someValue: 0
        }).animate({
            someValue: volume
        }, {
            duration: 2000,
            easing: 'swing',
            step: function() {
                if (id != "none") {
                    $('.value').text(parseInt(this.someValue, 0) + "%");
                } else {
                    $('.value').text('!');
                }
            }
        });
        if (id === "none") {
            $('.indicator').css('top', '47%');
            $('.water').css('height', '50%');
            $('article').css('opacity', '0');
        } else {
            $('article').css('opacity', '1');
            $('.volume').text(wrongVolume);
            $('.pday').text($rootScope.dados[parseInt(id, 10) + parseInt(1, 10)].value);
            $('.pmonth').text($rootScope.dados[parseInt(id, 10) + parseInt(2, 10)].value);

            var pmonthmax = $rootScope.dados[parseInt(id, 10) + parseInt(3, 10)].value,
            pmonth = $rootScope.dados[parseInt(id, 10) + parseInt(2, 10)].value;

            $('.pmonthmax').text(pmonthmax);
        }
    });
    $('.change').click(function(event) {
        event.preventDefault();
        $('.represas').toggle();
        if ($('.represas').is(":visible") === true) {
            $('.change').css('background', 'url(app/public/assets/images/close.png) no-repeat 95% 23px rgba(33, 52, 54, 0.9)');
        } else {
            $('.change').css('background', 'url(app/public/assets/images/arrow-down.png) no-repeat 95% 23px rgba(32, 47, 48, 0.9)');
        }
    });
});