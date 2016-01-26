var request = require('request'),
  async = require('async'),
  cheerio = require('cheerio');

var results = [];

/*
 *PARAMETERS : {keyword : '', language : '', num : '', tld: 'com'}
 */
function Scraper(options) {
  this.searchEngine = 'google';

  this.options = options;
  this.options.tld = (options.tld ? options.tld : "com");
  this.options.ua = options.ua ? options.ua : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
};

/*
 * Public Method
 * Scrapes the given search engine for the keyword and
 * return the results
 */
Scraper.prototype.getSerps = function (callback) {
  var self = this,
    html;

  self._query(function (body) {
    self._parse(body, function () {
      callback(results);
    });
  });

}

/*
 * @private
 * Builds the search url + query string
 */
Scraper.prototype._searchURL = function () {
  switch (this.searchEngine) {
    case 'google':
      return {
        url: 'http://www.google.' + this.options.tld +'/search',
        qs: {hl: this.options.language, num: this.options.num, q: this.options.keyword}
      };

    case 'bing':
      // @todo next versions

    default:
      return {
        url: 'http://www.google.' + this.options.tld +'/search',
        qs: {hl: this.options.language, num: this.options.num, q: this.options.keyword}
      };
  }
}

/*
 * @private
 * Sends get request to google to search for the keyword
 */
Scraper.prototype._query = function (callback) {
  var se = this._searchURL();

  request({
    url: se.url,
    method: 'GET',
    qs: se.qs,
    headers: {
      'Host': 'www.google.' + this.options.tld,
      'Connection': 'keep-alive',
      'Cache-Control': 'max-age=0',
      'User-Agent': this.options.ua,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Referer': 'www.google' + this.options.tld,
      'Accept-Language': this.options.language,
      'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7'
    }
  },function (error, response, body) {
    if (error) {
      throw (error);
    }
    if (response.statusCode == 200) {
      callback(body);
    } else {
      throw new Error("Something went wrong! Status Code: " + response.statusCode);
    }
  });
}

/*
 * @private
 * Extracts the results from the page
 */
Scraper.prototype._parse = function (html, callback) {
  var $ = cheerio.load(html);
  var links = $('h3.r a');
  var i = 0;

  $(links).each(function (i, link) {
    ++i;
    var href = $(link).attr('href'),
      title = $(link).html(),
      redirect = $(link).attr('onmousedown');
    
    results.push({
      position: i,
      href: href,
      title: title,
      redirect: redirect
    });

  })
  callback();
}

exports.Scraper = Scraper;
