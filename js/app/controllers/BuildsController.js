define([
         'ember',
         'models/Build',
         'app/utils'
       ], function (Ember, Build, utils) {
  return Ember.ArrayController.extend({
                                        sortAscending   : false,
                                        sortProperties  : ['number'],
                                        needs           : ['repo'],
                                        repoBinding     : 'controllers.repo.repo',
                                        contentBinding  : 'controllers.repo.builds',
                                        tabBinding      : 'controllers.repo.tab',
                                        isLoadedBinding : 'content.isLoaded',
                                        showMore        : function () {
                                          utils.debug('BuildsRoute::showMore:>');
                                          var id, number;
                                          id = this.get('repo.id');
                                          number = this.get('lastObject.number');
                                          return this.get('content').load(Build.olderThanNumber(id, number, this.get('tab')));
                                        }
                                      });
});