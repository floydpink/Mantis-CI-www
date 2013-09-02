define([
  'jquery',
  'handlebars',
  'app/utils',
  'ext/Emoji',
  'jquery-timeago'
], function ($, Handlebars, utils, Emoji) {
  var Helpers = {
    updateInterval          : 1000,
    currentDate             : function () {
      return new Date();
    },
    COLORS                  : {
      "default" : 'yellow',
      passed    : 'green',
      failed    : 'red',
      errored   : 'gray',
      canceled  : 'gray'
    },
    CONFIG_KEYS             : ['go', 'rvm', 'gemfile', 'env', 'jdk', 'otp_release', 'php', 'node_js', 'perl', 'python', 'scala', 'compiler'],
    pusher_key              : '5df8ac576dcccf4fd076',
    styleActiveNavbarButton : function () {
      utils.debug('Helpers::styleActiveNavbarButton:>');
      var $navbar = $('div[data-role="navbar"]');
      $navbar.find('a').removeClass('ui-btn-active');
      $navbar.find('a.active').addClass('ui-btn-active');
    },
    compact                 : function (object) {
      var key, result, value, _ref;
      result = {};
      _ref = object || {};
      for (key in _ref) {
        value = _ref[key];
        if (!$.isEmpty(value)) {
          result[key] = value;
        }
      }
      return result;
    },
    safe                    : function (string) {
      return new Handlebars.SafeString(string);
    },
    colorForState           : function (state) {
      return Helpers.COLORS[state] || Helpers.COLORS['default'];
    },
    formatCommit            : function (sha, branch) {
      return Helpers.formatSha(sha) + (branch ? " (" + branch + ")" : '');
    },
    formatSha               : function (sha) {
      return (sha || '').substr(0, 7);
    },
    formatConfig            : function (config) {
      var values;
      config = $.only(config, 'go', 'rvm', 'gemfile', 'env', 'jdk', 'otp_release', 'php', 'node_js', 'perl', 'python', 'scala', 'compiler');
      values = $.map(config, function (value, key) {
        value = (value && value.join ? value.join(', ') : value) || '';
        if (key === 'rvm' && ("" + value).match(/^\d+$/)) {
          value = "" + value + ".0";
        }
        return '%@: %@'.fmt($.camelize(key), value);
      });
      if (values.length === 0) {
        return '-';
      } else {
        return values.join(', ');
      }
    },
    formatMessage           : function (message, options) {
      message = message || '';
      if (options.short) {
        message = message.split(/\n/)[0];
      }
      message = this._emojize(this._escape(message));
      if (!!options.repo) {
        message = this.githubify(message, options.repo.get('owner'), options.repo.get('name'));
      }
      return message.replace(/\n/g, '<br/>');
    },
    pathFrom                : function (url) {
      return (url || '').split('/').pop();
    },
    timeAgoInWords          : function (date) {
      return $.timeago.distanceInWords(date);
    },
    durationFrom            : function (started, finished) {
      started = started && this._toUtc(new Date(this._normalizeDateString(started)));
      finished = finished ? this._toUtc(new Date(this._normalizeDateString(finished))) : this._nowUtc();
      if (started && finished) {
        return Math.round((finished - started) / 1000);
      } else {
        return 0;
      }
    },
    timeInWords             : function (duration) {
      var days, hours, minutes, result, seconds;
      days = Math.floor(duration / 86400);
      hours = Math.floor(duration % 86400 / 3600);
      minutes = Math.floor(duration % 3600 / 60);
      seconds = duration % 60;
      if (days > 0) {
        return 'more than 24 hrs';
      } else {
        result = [];
        if (hours === 1) {
          result.push(hours + ' hr');
        }
        if (hours > 1) {
          result.push(hours + ' hrs');
        }
        if (minutes > 0) {
          result.push(minutes + ' min');
        }
        if (seconds > 0) {
          result.push(seconds + ' sec');
        }
        if (result.length > 0) {
          return result.join(' ');
        } else {
          return '-';
        }
      }
    },
    githubify               : function (text, owner, repo) {
      var self;
      self = this;
      text = text.replace(this._githubReferenceRegexp, function (reference, matchedOwner, matchedRepo, matchedNumber) {
        return self._githubReferenceLink(reference, {
          owner : owner,
          repo  : repo
        }, {
          owner  : matchedOwner,
          repo   : matchedRepo,
          number : matchedNumber
        });
      });
      text = text.replace(this._githubUserRegexp, function (reference, username) {
        return self._githubUserLink(reference, username);
      });
      return text;
    },
    _githubReferenceLink    : function (reference, current, matched) {
      var owner, repo;
      owner = matched.owner || current.owner;
      repo = matched.repo || current.repo;
      return "<a href=\"http://github.com/" + owner + "/" + repo + "/issues/" + matched.number + "\">" + reference + "</a>";
    },
    _githubReferenceRegexp  : new RegExp("([\\w-]+)?\\/?([\\w-]+)?(?:#|gh-)(\\d+)", 'g'),
    _githubUserRegexp       : new RegExp("@([\\w-]+)", 'g'),
    _githubUserLink         : function (reference, username) {
      return "<a href=\"http://github.com/" + username + "\">" + reference + "</a>";
    },
    _normalizeDateString    : function (string) {
      if (window.JHW) {
        string = string.replace('T', ' ').replace(/-/g, '/');
        string = string.replace('Z', '').replace(/\..*$/, '');
      }
      return string;
    },
    _nowUtc                 : function () {
      return this._toUtc(Helpers.currentDate());
    },
    _toUtc                  : function (date) {
      return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    },
    _emojize                : function (text) {
      var emojis = text.match(/:\S+?:/g);
      if (emojis !== null) {
        $.each(emojis.uniq(), function (ix, emoji) {
          var image, strippedEmoji;
          strippedEmoji = emoji.substring(1, emoji.length - 1);
          if (Emoji.indexOf(strippedEmoji) !== -1) {
            image = '<img class=\'emoji\' title=\'' + emoji + '\' alt=\'' + emoji + '\' src=\'' + '/img/emoji/' + strippedEmoji + '.png\'/>';
            return text = text.replace(new RegExp(emoji, 'g'), image);
          }
        });
      }
      return text;
    },
    _escape                 : function (text) {
      return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  };

  return Helpers;
});
