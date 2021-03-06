define([
  'ember',
  'views/MainView',
  'ext/Helpers',
  'ext/ember/handlebars',
  'hbs!repos',
  'hbs!repos/index',
  'hbs!reposlistcontrol',
  'hbs!repo'
], function (Ember, MainView, Helpers) {

  var RepoViews = {
    RepoView             : MainView.extend({
      templateName      : 'repo',
      attributeBindings : ['id'],
      'id'              : 'repo'
    }),
    ReposView            : MainView.extend({
      templateName      : 'repos',
      attributeBindings : ['id'],
      'id'              : 'repos'
    }),
    ReposIndexView       : Ember.View.extend({
      templateName : 'repos/index'
    }),
    ReposListControlView : Ember.View.extend({
      templateName : 'reposlistcontrol'
    }),
    ReposListView        : Ember.CollectionView.extend({
      elementId         : 'repositories',
      tagName           : 'ul',
      attributeBindings : ['data-role'],
      'data-role'       : 'listview',
      classNames        : ['ui-listview'],
      emptyView         : Ember.View.extend({
        //template: Ember.Handlebars.compile('<div class="loading"></div>')
        template : Ember.Handlebars.compile(
            '              <li class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-count ui-first-child ui-btn-up-d">' +
                '                <div class="ui-btn-inner ui-li">' +
                '                  <div class="ui-btn-text">' +
                '                    <a class="ui-link-inherit">No repos.</a>' +
                '                  </div>' +
                '                </div>' +
                '              </li>')
      }),
      itemViewClass     : Ember.View.extend({
        repoBinding       : 'content',
        classNames        : [
          'ui-btn',
          'ui-btn-icon-right',
          'ui-li-has-arrow',
          'ui-li',
          'ui-li-has-count',
          'ui-first-child',
          'ui-btn-up-d',
          'repo'
        ],
        classNameBindings : ['color'],
        color             : function () {
          return Helpers.colorForState(this.get('repo.lastBuildState'));
        }.property('repo.lastBuildState')
      })
    })
  };

  return RepoViews;
});

