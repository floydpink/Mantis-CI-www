/* global App, console */
define([
         'ext/jquery.ext',
         'ember',
         'models/Build',
         'models/Log',
         'ext/TravisUrls',
         'ext/OrderedLog',
         'app/utils',
         'hbs!jobs/log',
         'hbs!jobs/pre'
       ], function ($, Ember, Build, Log, TravisUrls, OrderedLog, utils) {

  Log.DEBUG = true;

  var OrderedLogEngineMixin = Ember.Mixin.create({
                                                   setupEngine                  : function () {
                                                     utils.debug('LogViews::OrderedLogEngineMixin::setupEngine:>');
                                                     this.set('logManager', OrderedLog.create({
                                                                                                target : this
                                                                                              }));
                                                     this.get('logManager').append(this.get('log.parts'));
                                                     return this.get('log.parts').addArrayObserver(this, {
                                                       didChange  : 'partsDidChange',
                                                       willChange : 'noop'
                                                     });
                                                   },
                                                   destroyEngine                : function () {
                                                     this.get('logManager').destroy();
                                                     return this.get('log.parts').removeArrayObserver(this, {
                                                       didChange  : 'partsDidChange',
                                                       willChange : 'noop'
                                                     });
                                                   },
                                                   partsDidChange               : function (parts, index, removedCount, addedCount) {
                                                     var addedParts;
                                                     addedParts = parts.slice(index, index + addedCount);
                                                     return this.get('logManager').append(addedParts);
                                                   },
                                                   lineNumberDidChange          : function () {
                                                     var number;
                                                     if (number = this.get('controller.lineNumber')) {
                                                       return this.tryScrollingToHashLineNumber(number);
                                                     }
                                                   }.observes('controller.lineNumber'),
                                                   scrollTo                     : function (id) {
                                                     $('#main').scrollTop(0);
                                                     $('html,body').scrollTop($(id).offset().top);
                                                     return this.set('controller.lineNumber', null);
                                                   },
                                                   tryScrollingToHashLineNumber : function (number) {
                                                     var checker, id,
                                                         _this = this;
                                                     id = "#L" + number;
                                                     checker = function () {
                                                       if (_this.get('isDestroyed')) {
                                                         return;
                                                       }
                                                       if ($(id).length) {
                                                         return _this.scrollTo(id);
                                                       } else {
                                                         return setTimeout(checker, 100);
                                                       }
                                                     };
                                                     return checker();
                                                   },
                                                   appendLog                    : function (payloads) {
                                                     var cut, div, fold, folds, fragment, leftOut, line, link, number, p, pathWithNumber, payload, url, _i, _len;
                                                     url = this.get('logUrl');
                                                     leftOut = [];
                                                     cut = false;
                                                     fragment = document.createDocumentFragment();
                                                     for (_i = 0, _len = payloads.length; _i < _len; _i++) {
                                                       payload = payloads[_i];
                                                       line = payload.content;
                                                       number = payload.number;
                                                       if (payload.logWasCut) {
                                                         cut = true;
                                                       } else {
                                                         if (!payload.append) {
                                                           pathWithNumber = "" + url + "#L" + number;
                                                           p = document.createElement('p');
                                                           p.innerHTML = "<a href=\"" + pathWithNumber + "\" id=\"L" + number + "\"></a>" + line;
                                                           line = p;
                                                         }
                                                         if (payload.fold && !payload.foldContinuation) {
                                                           div = document.createElement('div');
                                                           div.appendChild(line);
                                                           div.className = "fold " + payload.fold + " show-first-line";
                                                           line = div;
                                                         }
                                                         if (payload.replace) {
                                                           if (link = fragment.querySelector("#L" + number)) {
                                                             link.parentElement.innerHTML = line.innerHTML;
                                                           } else {
                                                             this.$("#L" + number).parent().replaceWith(line);
                                                           }
                                                         } else if (payload.append) {
                                                           if (link = fragment.querySelector("#L" + number)) {
                                                             link.parentElement.innerHTML += line;
                                                           } else {
                                                             this.$("#L" + number).parent().append(line);
                                                           }
                                                         } else if (payload.foldContinuation) {
                                                           folds = fragment.querySelectorAll(".fold." + payload.fold);
                                                           if (fold = folds[folds.length - 1]) {
                                                             fold.appendChild(line);
                                                           } else {
                                                             this.$("#log .fold." + payload.fold + ":last").append(line);
                                                           }
                                                         } else {
                                                           fragment.appendChild(line);
                                                         }
                                                         if (payload.openFold) {
                                                           folds = fragment.querySelectorAll(".fold." + payload.openFold);
                                                           if (fold = folds[folds.length - 1]) {
                                                             fold = $(fold);
                                                           } else {
                                                             fold = this.$(".fold." + payload.openFold + ":last");
                                                           }
                                                           fold.removeClass('show-first-line').addClass('open');
                                                         }
                                                         if (payload.foldEnd) {
                                                           folds = fragment.querySelectorAll(".fold." + payload.fold);
                                                           if (fold = folds[folds.length - 1]) {
                                                             fold = $(fold);
                                                           } else {
                                                             fold = this.$(".fold." + payload.fold + ":last");
                                                           }
                                                           fold.removeClass('show-first-line');
                                                         }
                                                       }
                                                     }
                                                     this.$('#log')[0].appendChild(fragment);
                                                     if (cut) {
                                                       url = TravisUrls.plainTextLog(this.get('log.job.id'));
                                                       return this.$("#log").append($("<div class=\"cut\">Log was too long to display. Download the <a href=\"" + url + "\">the raw version</a> to get the full log.</div>"));
                                                     }
                                                   }
                                                 });

  var LogViews = {
    LogView : Ember.View.extend({
                                  templateName       : 'jobs/log',
                                  logBinding         : 'job.log',
                                  contextBinding     : 'job',
                                  didInsertElement   : function () {
                                    var job;
                                    job = this.get('job');
                                    if (job) {
                                      job.get('log').fetch();
                                      if (!job.get('isFinished')) {
                                        return job.subscribe();
                                      }
                                    }
                                  },
                                  willDestroyElement : function () {
                                    var job;
                                    job = this.get('job');
                                    if (job) {
                                      return job.unsubscribe();
                                    }
                                  },
                                  toTop              : function () {
                                    return $(window).scrollTop(0);
                                  }
                                }),
    PreView : Ember.View.extend(OrderedLogEngineMixin, {
      templateName       : 'jobs/pre',
      didInsertElement   : function () {
        if (Log.DEBUG) {
          console.log('log view: did insert');
        }
        this._super.apply(this, arguments);
        this.setupEngine();
        return this.lineNumberDidChange();
      },
      willDestroyElement : function () {
        if (Log.DEBUG) {
          console.log('log view: will destroy');
        }
        return this.destroyEngine();
      },
      versionDidChange   : function () {
        if (this.get('inDOM')) {
          return this.rerender();
        }
      }.observes('log.version'),
      logDidChange       : function () {
        if (Log.DEBUG) {
          console.log('log view: log did change: rerender');
        }
        if (this.get('inDOM')) {
          return this.rerender();
        }
      }.observes('log'),
      plainTextLogUrl    : function () {
        var id;
        if (id = this.get('log.job.id')) {
          return TravisUrls.plainTextLog(id);
        }
      }.property('job.log.id'),
      toggleTailing      : function () {
        App.tailing.toggle();
        return event.preventDefault();
      },
      numberLineOnHover  : function () {
        return $('#log').on('mouseenter', 'a', function () {
          return $(this).attr('href', '#L' + ($(this.parentNode).prevAll('p:visible').length + 1));
        });
      },
      click              : function (event) {
        var href, matches, target;
        if ((href = $(event.target).attr('href')) && (matches = href != null ? href.match(/#L(\d+)$/) : void 0)) {
          this.lineNumberClicked(matches[1]);
          event.stopPropagation();
          return false;
        } else {
          target = $(event.target);
          return target.closest('.fold').toggleClass('open');
        }
      },
      logUrl             : function () {
        var item, name, repo;
        if (item = this.get('controller.currentItem')) {
          if (repo = item.get('repo')) {
            name = item.constructor === Build ? 'build' : 'job';
            return App.__container__.lookup('router:main').generate(name, repo, item);
          }
        }
      }.property('controller.currentItem.repo', 'controller.currentItem'),
      lineNumberClicked  : function (number) {
        var path;
        path = this.get('logUrl') + ("#L" + number);
        window.history.replaceState({
                                      path : path
                                    }, null, path);
        return this.set('controller.lineNumber', number);
      },
      noop               : function () {
      }
    })
  };

  /*
  Log.Scroll = function() {};

  Log.Scroll.prototype = $.extend(new Log.Listener, {
    set: function(number) {
      if (!number) {
        return;
      }
      this.number = number;
      return this.tryScroll();
    },
    insert: function() {
      if (this.number) {
        this.tryScroll();
      }
      return true;
    },
    tryScroll: function() {
      var element, _ref;
      if (element = $("#log p:visible")[this.number - 1]) {
        $('#main').scrollTop(0);
        $('html, body').scrollTop((_ref = $(element).offset()) != null ? _ref.top : void 0);
        this.highlight(element);
        return this.number = void 0;
      }
    },
    highlight: function(element) {
      $('#log p.highlight').removeClass('highlight');
      return $(element).addClass('highlight');
    }
  });

  Log.Logger = function() {};

  Log.Logger.prototype = $.extend(new Log.Listener, {
    receive: function(log, num, string) {
      this.log("rcv " + num + " " + (JSON.stringify(string)));
      return true;
    },
    insert: function(log, element, pos) {
      return this.log("ins " + element.id + ", " + (pos.before ? 'before' : 'after') + ": " + (pos.before || pos.after || '?') + ", " + (JSON.stringify(element)));
    },
    remove: function(log, element) {
      return this.log("rem " + element.id);
    },
    log: function(line) {
      return console.log(line);
    }
  });
  */

  return LogViews;

});
