define([
  'ember',
  'ext/Helpers',
  'ext/ember/handlebars'
], function (Ember, Helpers) {
  var ReposListView = Ember.CollectionView.extend({
    elementId         : 'repositories',
    tagName           : 'ul',
    attributeBindings : ['data-role'],
    'data-role'       : 'listview',
    classNames        : ['ui-listview'],
    emptyView         : Ember.View.extend({
      //template: Ember.Handlebars.compile('<div class="loading"></div>')
      template : Ember.Handlebars.compile(
          '              <li class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-count ui-first-child ui-btn-up-c">' +
              '                <div class="ui-btn-inner ui-li">' +
              '                  <div class="ui-btn-text">' +
              '                    <a class="ui-link-inherit">No repos.</a>' +
              '                  </div>' +
              '                </div>' +
              '              </li>')
    }),
    itemViewClass     : Ember.View.extend({
      repoBinding       : 'content',
      classNames        : ['ui-btn',
                           'ui-btn-icon-right',
                           'ui-li-has-arrow',
                           'ui-li',
                           'ui-li-has-count',
                           'ui-first-child',
                           'ui-btn-up-c',
                           'repo'],
      classNameBindings : ['color'],
      color             : function () {
        return Helpers.colorForState(this.get('repo.lastBuildState'));
      }.property('repo.lastBuildState')
    })
  });

  return ReposListView;
});