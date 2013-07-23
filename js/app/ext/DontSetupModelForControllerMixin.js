define([
  'ember',
  'app/utils'
], function (Ember, utils) {
  // https://github.com/travis-ci/travis-web/commit/6e632f70330219355d034f2235c22c4731439d44
  /*
    Ember by default sets controller's `model` property which may cause
    weird race conditions when connected with a way we handle setting up
    controller's content - most of the time we bind things.
   */
  var DontSetupModelForControllerMixin = Ember.Mixin.create({
    setup: function (context) {
      utils.debug('DontSetupModelForControllerMixin::setup:>');
      var controller;
      this.redirected = false;
      this._checkingRedirect = true;
      this.redirect(context);
      this._checkingRedirect = false;
      if (this.redirected) {
        return false;
      }
      controller = this.controllerFor(this.routeName, context);
      this.setupController(controller, context);
      return this.renderTemplate(controller, context);
    }
  });

  return DontSetupModelForControllerMixin;
});