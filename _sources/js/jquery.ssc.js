/*!
 * Social Shared Count - jQuery plugin
 * Author: KUCKLU ( VisuAlive )
 * Created date: 11.27.2014
 * Updated date: 09.16.2015
 * Version: 1.1.4
 * Licensed under the MIT license or GNU General Public License v2
 */
;(function ($, window, document, undefined) {
	"use strict";

	var ClassSocialSharedCount,
		defaults = {
			facebook       : false,
			twitter        : false,
			google         : false,
			hatena         : false,
			linkedin       : false,
			pocket         : false,
			twitterVia     : null,
			twitterRelated : null
		};

	function sscNumberFormat(number) {
		var num = parseInt(number, 10);

		if ( num === null ) {
			return 0;
		}
		if (num >= 1000000000) {
			return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
		}
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
		}
		if (num >= 1000) {
			return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
		}

		return num;
	}

	ClassSocialSharedCount = function (triggerHolder, options) {
		return {
			init: function () {
				this.settings      = $.extend({}, defaults, options);
				this.triggerHolder = triggerHolder;
				this.$container    = $(triggerHolder);
				this.$url          = $(triggerHolder).attr('data-ssc-url');
				this.$title        = $(triggerHolder).attr('data-ssc-title');
				this.sns           = {
					'facebook':{'name':'Facebook','url':'https://www.facebook.com/sharer/sharer.php?t=' + encodeURIComponent(this.$title) + '&u=' + encodeURIComponent(this._sanitizeUrl(this.$url))},
					'twitter':{'name':'Twitter','url':'https://twitter.com/intent/tweet?text=' + encodeURIComponent(this.$title) + '&url=' + encodeURIComponent(this._sanitizeUrl(this.$url)) + this._sanitizeText(this.settings.twitterVia, 'via') + this._sanitizeText(this.settings.twitterRelated, 'related')},
					'google':{'name':'Google+','url':'https://plus.google.com/share?hl=' + encodeURIComponent(this.$title) + '&url=' + encodeURIComponent(this._sanitizeUrl(this.$url))},
					'hatena':{'name':'Hatena','url':'http://b.hatena.ne.jp/append?' + encodeURIComponent(this._sanitizeUrl(this.$url))},
					'linkedin':{'name':'LinkedIn','url':'https://www.linkedin.com/shareArticle?mini=true&title=' + encodeURIComponent(this.$title) + '&url=' + encodeURIComponent(this._sanitizeUrl(this.$url))},
					'pocket':{'name':'Pocket','url':'https://getpocket.com/save?title=' + encodeURIComponent(this.$title) + '&url=' + encodeURIComponent(this._sanitizeUrl(this.$url))}
				};
				this.listClass     = String(this.triggerHolder.className) +'_list';
				this.listItemClass = String(this.listClass) +'_items';
				this.anchorClass   = String(this.listItemClass) +'_anchor';
				this.snsNameClass  = String(this.listItemClass) +'_name';
				this.countClass    = String(this.listItemClass) +'_count';

				if (!this.$url || this._sanitizeUrl(this.$url) === null || !this.$title) {
					return;
				} else {
					this._createCountBox();
					if (this.settings.facebook === true) { this._facebook(); }
					if (this.settings.twitter === true) { this._twitter(); }
					if (this.settings.google === true) { this._google(); }
					if (this.settings.hatena === true) { this._hatena(); }
					if (this.settings.linkedin === true) { this._linkedin(); }
					if (this.settings.pocket === true) { this._pocket(); }
				}
			},
			_sanitizeHtml: function (text) {
				return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
			},
			_sanitizeText: function (text, mode) {
				if (text !== undefined || text !== null) {
					var match = text.match(/^[\w]+$/i);
					if (mode === 'via') {
						return (match !== null) ? '&via=' + encodeURIComponent(match[0]) : '';
					} else if (mode === 'related') {
						return (match !== null) ? '&related=' + encodeURIComponent(match[0]) : '';
					} else {
						return (match !== null) ? match[0] : '';
					}
				}
				return '';
			},
			_sanitizeUrl: function (url) {
				if (url !== undefined || url !== null) {
					var match = url.match(/^https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+$/i);
					return (match !== null) ? match[0] : null;
				}
				return '';
			},
			_createCountBox: function () {
				var container = this.$container;
				var ul        = document.createElement('ul');
				var li        = [];
				ul.className  = String(this.listClass);

				for (var i in this.sns) {
					if (this.settings[i] === true) {
						li.push(
							'<li class="' + String(this.listItemClass) + ' ' + String(this.listItemClass) + '-' + i +'">' +
							'<a class="' + String(this.anchorClass) + '" href="' + this.sns[i].url + '" target="_blank">' +
							'<span class="' + String(this.snsNameClass) + '">' + this._sanitizeHtml(this.sns[i].name) + '</span>' +
							'<span class="' + String(this.countClass) + '">0</span>' +
							'</a>' +
							'</li>'
						);
					}
				}

				container[0].appendChild(ul);
				ul.insertAdjacentHTML('afterbegin', li.join(''));
			},
			_countElements: function (snsName) {
				var container = this.$container;

				return container.find('.' + String(this.listItemClass) + '-' + snsName).find('.' + String(this.countClass));
			},
			_facebook: function () {
				var countElements = this._countElements('facebook');

				$.ajax({
					type: "GET",
					dataType: "jsonp",
					url: "https://api.facebook.com/method/links.getStats?callback=?",
					data: {
						urls: this.$url,
						format: 'json'
					},
					success: function(data) {
						var count = sscNumberFormat(data[0].share_count + data[0].like_count);

						countElements.text(count);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						countElements.text(0);
					}
				});
			},
			_twitter: function () {
				var countElements = this._countElements('twitter');

				$.ajax({
					type: "GET",
					dataType: "jsonp",
					url: "https://urls.api.twitter.com/1/urls/count.json?callback=?",
					data: {
						url: this.$url
					},
					success: function(data) {
						var count = sscNumberFormat(data.count);

						countElements.text(count);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						countElements.text(0);
					}
				});
			},
			_google: function () {
				var countElements = this._countElements('google');

				$.ajax({
					type: "GET",
					dataType: "xml",
					url: "https://query.yahooapis.com/v1/public/yql",
					data: {
						q: "SELECT content FROM data.headers WHERE url='https://plusone.google.com/_/+1/fastbutton?hl=ja&url=" + this.$url + "' and ua='#Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36'",
						format: "xml",
						env: "http://datatables.org/alltables.env"
					},
					success: function (data) {
						var dataContent = $(data).find("content").text();
						var dataMatch   = dataContent.match(/window\.__SSR[\s*]=[\s*]{c:[\s*](\d+)/i);
						var count       = (dataMatch !== null) ? sscNumberFormat(dataMatch[1]) : 0;

						countElements.text(count);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						countElements.text(0);
					}
				});
			},
			_hatena: function () {
				var countElements = this._countElements('hatena');

				$.ajax({
					type: "GET",
					dataType: "jsonp",
					url: "https://b.hatena.ne.jp/entry.count?callback=?",
					data: {
						url: this.$url
					},
					success: function(data) {
						var count = sscNumberFormat(data);

						countElements.text(count);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						countElements.text(0);
					}
				});
			},
			_linkedin: function () {
				var countElements = this._countElements('linkedin');

				$.ajax({
					type: "GET",
					dataType: "jsonp",
					url: "https://www.linkedin.com/countserv/count/share?callback=?",
					data: {
						url: this.$url
					},
					success: function(data) {
						var count = sscNumberFormat(data.count);

						countElements.text(count);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						countElements.text(0);
					}
				});
			},
			_pocket: function () {
				var countElements = this._countElements('pocket');

				$.ajax({
					type: "GET",
					dataType: "xml",
					url: "https://query.yahooapis.com/v1/public/yql",
					data: {
						q: "SELECT content FROM data.headers WHERE url='https://widgets.getpocket.com/v1/button?label=pocket&count=horizontal&v=1&url=" + this.$url + "' and ua='#Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36'",
						format: "xml",
						env: "http://datatables.org/alltables.env"
					},
					success: function (data) {
						var dataContent = $(data).find("content").text();
						var dataMatch   = dataContent.match(/<em\sid=\"cnt\">([0-9]+)<\/em>/i);
						var count       = (dataMatch !== null) ? sscNumberFormat(dataMatch[1]) : 0;

						countElements.text(count);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						countElements.text(0);
					}
				});
			}
		};
	};

	ClassSocialSharedCount.defaults = defaults;
	$.fn.socialSharedCount = function (options) {
		return this.each(function () {
			new ClassSocialSharedCount(this, options).init();
		});
	};

	return ClassSocialSharedCount;
})(jQuery, window, document);