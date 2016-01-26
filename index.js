var scraper = require('./lib/scraper');

var options = {
  keyword: "decoda.com",
  language: "en",
  num: 10,
  tld: "com"
};

var scrape = new scraper.Scraper(options);

try {
	scrape.getSerps(function(results){
	  console.log(results);
	});
} catch (ex) {
	console(ex);
}

