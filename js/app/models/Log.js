define([
  'ext/jquery.ext',
  'ember',
  'ext/ChunkBuffer',
  'ext/TravisUrls',
  'ext/TravisAjax',
  'app/utils'
], function ($, Ember, ChunkBuffer, TravisUrls, TravisAjax, utils) {
  var Log = Ember.Object.extend({
    version   : 0,
    isLoaded  : false,
    length    : 0,
    //>>excludeStart('appBuildExclude', pragmas.appBuildExclude);
    DEBUG     : true,
    //>>excludeEnd('appBuildExclude');
    init      : function () {
      return this.setParts();
    },
    setParts  : function () {
      return this.set('parts', ChunkBuffer.create({
        content : []
      }));
    },
    fetch     : function () {
      var handlers, id,
          _this = this;
      utils.debug('log model: fetching log');
      this.setParts();
      handlers = {
        json : function (json) {
          return _this.loadParts(json['log']['parts']);
        },
        text : function (text) {
          return _this.loadText(text);
        }
      };
      if (id = this.get('job.id')) {
        return Log.Request.create({
          id       : id,
          handlers : handlers
        }).run();
      }
    },
    clear     : function () {
      this.setParts();
      return this.incrementProperty('version');
    },
    append    : function (part) {
      return this.get('parts').pushObject(part);
    },
    loadParts : function (parts) {
      var part, _i, _len;
      utils.debug('log model: load parts');
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        part = parts[_i];
        this.append(part);
      }
      return this.set('isLoaded', true);
    },
    loadText  : function (text) {
      utils.debug('log model: load text');
      this.append({
        number  : 1,
        content : text,
        final   : true
      });
      return this.set('isLoaded', true);
    }
  });

  Log.Request = Ember.Object.extend({
    HEADERS    : {
      accept : 'application/json; chunked=true; version=2, text/plain; version=2'
    },
    run        : function () {
      var _this = this;
      return TravisAjax.ajax("/jobs/" + this.id + "/log?cors_hax=true", 'GET', {
        dataType : 'text',
        headers  : this.HEADERS,
        success  : function (body, status, xhr) {
          return _this.handle(body, status, xhr);
        }
      });
    },
    handle     : function (body, status, xhr) {
      if (xhr.status === 204) {
        return $.ajax({
          url     : this.redirectTo(xhr),
          type    : 'GET',
          success : this.handlers.text
        });
      } else if (this.isJson(xhr, body)) {
        return this.handlers.json(body);
      } else {
        return this.handlers.text(body);
      }
    },
    redirectTo : function (xhr) {
      return xhr.getResponseHeader('Location');
    },
    isJson     : function (xhr) {
      var type;
      type = xhr.getResponseHeader('Content-Type') || '';
      return type.indexOf('json') > -1;
    }
  });

  return Log;
});