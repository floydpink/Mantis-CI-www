define([
  'jquery'
], function ($) {
  var jQuery = $;
  $.extend({
    isEmpty    : function (obj) {
      if ($.isArray(obj)) {
        return !obj.length;
      } else if ($.isObject(obj)) {
        return !$.keys(obj).length;
      } else {
        return !obj;
      }
    },
    isObject   : function (obj) {
      return Object.prototype.toString.call(obj) === '[object Object]';
    },
    keys       : function (obj) {
      var keys;
      keys = [];
      $.each(obj, function (key) {
        return keys.push(key);
      });
      return keys;
    },
    values     : function (obj) {
      var values;
      values = [];
      $.each(obj, function (key, value) {
        return values.push(value);
      });
      return values;
    },
    underscore : function (string) {
      return string[0].toLowerCase() + string.substring(1).replace(/([A-Z])?/g, function (match, chr) {
        if (chr) {
          return "_" + (chr.toUpperCase());
        } else {
          return '';
        }
      });
    },
    titleize   : function (string) {
      return $.capitalize(string).replace(/_(.)?/g, function (match, chr) {
        if (chr) {
          return ' ' + chr.toUpperCase();
        } else {
          return '';
        }
      });
    },
    camelize   : function (string, uppercase) {
      string = uppercase === false ? $.underscore(string) : $.capitalize(string);
      return string.replace(/_(.)?/g, function (match, chr) {
        if (chr) {
          return chr.toUpperCase();
        } else {
          return '';
        }
      });
    },
    capitalize : function (string) {
      return string[0].toUpperCase() + string.substring(1);
    },
    compact    : function (object) {
      return $.grep(object, function (value) {
        return !!value;
      });
    },
    all        : function (array, callback) {
      var args, i;
      args = Array.prototype.slice.apply(arguments);
      callback = args.pop();
      array = args.pop() || this;
      i = 0;
      while (i < array.length) {
        if (callback(array[i])) {
          return false;
        }
        i++;
      }
      return true;
    },
    detect     : function (array, callback) {
      var args, i;
      args = Array.prototype.slice.apply(arguments);
      callback = args.pop();
      array = args.pop() || this;
      i = 0;
      while (i < array.length) {
        if (callback(array[i])) {
          return array[i];
        }
        i++;
      }
    },
    select     : function (array, callback) {
      var args, i, result;
      args = Array.prototype.slice.apply(arguments);
      callback = args.pop();
      array = args.pop() || this;
      result = [];
      i = 0;
      while (i < array.length) {
        if (callback(array[i])) {
          result.push(array[i]);
        }
        i++;
      }
      return result;
    },
    slice      : function (object, key) {
      var keys, result;
      keys = Array.prototype.slice.apply(arguments);
      object = (typeof keys[0] === 'object' ? keys.shift() : this);
      result = {};
      for (key in object) {
        if (keys.indexOf(key) > -1) {
          result[key] = object[key];
        }
      }
      return result;
    },
    only       : function (object) {
      var key, keys, result;
      keys = Array.prototype.slice.apply(arguments);
      object = (typeof keys[0] === 'object' ? keys.shift() : this);
      result = {};
      for (key in object) {
        if (keys.indexOf(key) !== -1) {
          result[key] = object[key];
        }
      }
      return result;
    },
    except     : function (object) {
      var key, keys, result;
      keys = Array.prototype.slice.apply(arguments);
      object = (typeof keys[0] === 'object' ? keys.shift() : this);
      result = {};
      for (key in object) {
        if (keys.indexOf(key) === -1) {
          result[key] = object[key];
        }
      }
      return result;
    },
    intersect  : function (array, other) {
      return array.filter(function (element) {
        return other.indexOf(element) !== -1;
      });
    },
    map        : function (elems, callback, arg) {
      var i, isArray, key, length, ret, value;
      value = void 0;
      key = void 0;
      ret = [];
      i = 0;
      length = elems.length;
      isArray = elems instanceof jQuery || length !== void 0 && typeof length === 'number' && (length > 0 && elems[0] && elems[length - 1]) || length === 0 || jQuery.isArray(elems);
      if (isArray) {
        while (i < length) {
          value = callback(elems[i], i, arg);
          if (value != null) {
            ret[ret.length] = value;
          }
          i++;
        }
      } else {
        for (key in elems) {
          value = callback(elems[key], key, arg);
          if (value != null) {
            ret[ret.length] = value;
          }
        }
      }
      return ret.concat.apply([], ret);
    },
    shuffle    : function (array) {
      var current, tmp, top;
      array = array.slice();
      top = array.length;
      while (top && --top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
      }
      return array;
    },
    truncate   : function (string, length) {
      if (string.length > length) {
        return string.trim().substring(0, length) + '...';
      } else {
        return string;
      }
    }
  });
});
