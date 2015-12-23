var phantom = require('phantom'),cheerio = require('cheerio'),sm = require('sitemap'),fs = require('fs'),argv = require('yargs').argv,_ = require('underscore');
var jsonMaps = require('./app/get-json-maps')();
if (!argv.origin) {
    console.log('Please enter to generate Sitemap site URL');
    return;
}
//
var browser  =  function(browser){
    browser.createPage(function(page) {
        page.open(argv.origin , function(status) {
            page.evaluate(evaluate, resultSource);
            function evaluate(){
                return document.all[0].innerHTML;
            };
            function resultSource(pageSource){
                var $ = cheerio.load(pageSource);
                var staticJsonData = jsonMaps.get();
                try {
                    staticJsonData = JSON.parse(staticJsonData);
                } catch (e) {
                    throw e;
                };
                // get document links
                $('a[ui-sref],a').each(function(i){
                    var a = $(this), url = a.attr('href'), title = a.text(),metaData;
                    if(url){
                        // To write the JSON data
                        metaData = {
                            url: url,
                            changefreq: 'daily',
                            priority: 0.3
                        }
                        var line = _.findWhere(staticJsonData, {"url": url});
                        if (!line) {
                            // add new line
                            line = _.extend({}, metaData);
                            staticJsonData.push(line);
                        };
                        
                    }
                })

                // write data into JSON files
                fs.writeFile("./data/data.json", JSON.stringify(staticJsonData) ,function (err){
                    if (err) throw err;
                    var sitemap = sm.createSitemap({
                        hostname: 'http://example.com',
                        cacheTime: 600000,
                        urls: staticJsonData,
                    });
                    console.log('json file saved!');
                    fs.writeFile("./sitemap.xml", sitemap.toString(), function(err){
                        if (err) throw err;
                        console.log('sitemap.xml saved!');
                    });
                });
                
                browser.exit();
            }
        })
    })
}
phantom.create(browser);
