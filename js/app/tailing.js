/* global window */
define([
  'ext/jquery.ext',
  'ember',
  'jquery-throttle'
], function ($, Ember) {
  var Tailing = function () {
    this.position = $(window).scrollTop();
    $(window).scroll($.throttle(200, this.onScroll.bind(this)));
    return this;
  };

  $.extend(Tailing.prototype, {
    options        : {
      timeout : 200
    },
    run            : function () {
      this.autoScroll();
      this.positionButton();
      if (this.active()) {
        return Ember.run.later(this, this.run.bind(this), this.options.timeout);
      }
    },
    toggle         : function () {
      if (this.active()) {
        return this.stop();
      } else {
        return this.start();
      }
    },
    active         : function () {
      return $('#tail').hasClass('active');
    },
    start          : function () {
      $('#tail').addClass('active');
      return this.run();
    },
    stop           : function () {
      return $('#tail').removeClass('active');
    },
    autoScroll     : function () {
      var log, logBottom, win, winBottom, footerHeight;
      if (!this.active()) {
        return;
      }
      footerHeight = $('div[data-role="footer"]').outerHeight();
      win = $(window);
      log = $('#log');
      logBottom = log.offset().top + log.outerHeight() + 40 + footerHeight;
      winBottom = win.scrollTop() + win.height();
      if (logBottom - winBottom > 0) {
        return win.scrollTop(logBottom - win.height());
      }
    },
    onScroll       : function () {
      var position;
      this.positionButton();
      position = $(window).scrollTop();
      if (position < this.position) {
        this.stop();
      }
      return this.position = position;
    },
    positionButton : function () {
      var max, offset, tail, headerHeight;
      tail = $('#tail');
      if (tail.length === 0) {
        return;
      }
      headerHeight = $('div[data-role="header"]').outerHeight();
      offset = $(window).scrollTop() + headerHeight - $('#log').offset().top;
      max = $('#log').height() - $('#tail').height() + 5;
      if (offset > max) {
        offset = max;
      }
      if (offset > 0) {
        return tail.css({
          top : offset - 2
        });
      } else {
        return tail.css({
          top : 0
        });
      }
    }
  });

  return Tailing;
});