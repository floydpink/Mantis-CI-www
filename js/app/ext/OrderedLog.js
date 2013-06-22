/* jshint -W100 */
define([
         'ansiparse',
         'handlebars',
         'ember'
       ], function (ansiparse, Handlebars, Ember) {
  var FOLDS = [
        Ember.Object.create({
                              name         : 'schema',
                              startPattern : /^\$ (?:bundle exec )?rake( db:create)? db:schema:load/,
                              endPattern   : /^(<\/span>)?\$/
                            }), Ember.Object.create({
                                                      name         : 'migrate',
                                                      startPattern : /^\$ (?:bundle exec )?rake( db:create)? db:migrate/,
                                                      endPattern   : /^(<\/span>)?\$/
                                                    }), Ember.Object.create({
                                                                              name         : 'bundle',
                                                                              startPattern : /^\$ bundle install/,
                                                                              endPattern   : /^(<\/span>)?\$/
                                                                            })
      ],
      OrderedLog = Ember.Object.extend({
                                         linesLimit   : 5000,
                                         init         : function () {
                                           var fold, _i, _len, _results;
                                           this.set('folds', []);
                                           this.set('line', 1);
                                           this.set('lineNumber', 1);
                                           this.initial = true;
                                           _results = [];
                                           for (_i = 0, _len = FOLDS.length; _i < _len; _i++) {
                                             fold = FOLDS[_i];
                                             _results.push(this.addFold(fold));
                                           }
                                           return _results;
                                         },
                                         append       : function (lines) {
                                           var currentFold, index, line, log, nextLineNumber, payload, result, start, target, _i, _len;
                                           if (!lines) {
                                             return;
                                           }
                                           if (this.get('lineNumber') > this.get('linesLimit')) {
                                             return;
                                           }
                                           log = this.join(lines);
                                           log = this.escape(log);
                                           log = this.deansi(log);
                                           lines = this.split(log);
                                           target = this.get('target');
                                           index = 0;
                                           currentFold = this.currentFold;
                                           result = [];
                                           for (_i = 0, _len = lines.length; _i < _len; _i++) {
                                             line = lines[_i];
                                             if (line === '\r') {
                                               this.set('replace', true);
                                             } else if (line === '\n') {
                                               this.set('newline', true);
                                               index += 1;
                                             } else {
                                               if (currentFold && (this.isFoldEnding(currentFold, line))) {
                                                 if (result.length > 0) {
                                                   result.slice(-1)[0].foldEnd = true;
                                                   target.appendLog(result);
                                                 }
                                                 this.currentFold = currentFold = null;
                                                 this.set('foldContinuation', false);
                                                 result = [];
                                               }
                                               if (!currentFold && (currentFold = this.foldByStart(line))) {
                                                 if (result.length > 0) {
                                                   target.appendLog(result);
                                                 }
                                                 result = [];
                                                 start = index;
                                               }
                                               payload = {
                                                 content : line
                                               };
                                               if (currentFold) {
                                                 payload.fold = currentFold.get('name');
                                               }
                                               if (this.get('foldContinuation')) {
                                                 payload.foldContinuation = true;
                                               }
                                               payload.number = this.get('lineNumber') + index;
                                               if (this.get('replace')) {
                                                 this.set('replace', false);
                                                 payload.replace = true;
                                               } else if (this.get('newline')) {
                                                 this.set('newline', false);
                                               } else if (!this.initial) {
                                                 payload.append = true;
                                               }
                                               this.initial = false;
                                               if (payload.foldContinuation && payload.content.match(/Done. Build script exited|Your build has been stopped/)) {
                                                 payload.foldContinuation = null;
                                                 payload.openFold = payload.fold;
                                                 payload.fold = null;
                                               }
                                               result.pushObject(payload);
                                               if (currentFold) {
                                                 this.set('foldContinuation', true);
                                               }
                                               if (this.get('lineNumber') + index >= this.get('linesLimit')) {
                                                 result.pushObject({
                                                                     logWasCut : true
                                                                   });
                                                 break;
                                               }
                                             }
                                           }
                                           if (result.length > 0) {
                                             if (currentFold) {
                                               this.currentFold = currentFold;
                                             }
                                             target.appendLog(result);
                                           }
                                           nextLineNumber = this.get('lineNumber') + index;
                                           return this.set('lineNumber', nextLineNumber);
                                         },
                                         join         : function (lines) {
                                           if (typeof lines === 'string') {
                                             return lines;
                                           } else {
                                             return lines.toArray().join('');
                                           }
                                         },
                                         split        : function (log) {
                                           var line, lines, result, _i, _len;
                                           log = log.replace(/\r\n/g, '\n');
                                           lines = log.split(/(\n)/);
                                           if (lines.slice(-1)[0] === '') {
                                             lines.popObject();
                                           }
                                           result = [];
                                           for (_i = 0, _len = lines.length; _i < _len; _i++) {
                                             line = lines[_i];
                                             result.pushObjects(line.split(/(\r)/));
                                           }
                                           return result;
                                         },
                                         escape       : function (log) {
                                           return Handlebars.Utils.escapeExpression(log);
                                         },
                                         deansi       : function (log) {
                                           var ansi, text;
                                           log = log.replace(/\r\r/g, '\r').replace(/\033\[K\r/g, '\r').replace(/\[2K/g, '').replace(/\033\(B/g, '').replace(/\033\[\d+G/g, '');
                                           ansi = ansiparse(log);
                                           text = '';
                                           ansi.forEach(function (part) {
                                             var classes;
                                             classes = [];
                                             if (part.foreground) {
                                               classes.push(part.foreground);
                                             }
                                             if (part.background) {
                                               classes.push('bg-' + part.background);
                                             }
                                             if (part.bold) {
                                               classes.push('bold');
                                             }
                                             if (part.italic) {
                                               classes.push('italic');
                                             }
                                             return text += (classes.length ? '<span class=\'' + classes.join(' ') + '\'>' + part.text + '</span>' : part.text);
                                           });
                                           return text.replace(/\033/g, '');
                                         },
                                         addFold      : function (fold) {
                                           return this.get('folds').pushObject(fold);
                                         },
                                         foldByStart  : function (line) {
                                           return this.get('folds').find(function (fold) {
                                             return line.match(fold.get('startPattern'));
                                           });
                                         },
                                         isFoldEnding : function (fold, line) {
                                           return line.match(fold.get('endPattern'));
                                         }
                                       });
  return OrderedLog;

});
