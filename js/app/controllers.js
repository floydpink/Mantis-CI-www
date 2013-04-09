define([
  'controllers/FavoritesController',
  'controllers/ReposController',
  'controllers/RepoController',
  'controllers/BuildController',
  'controllers/BuildsController',
  'controllers/JobController'
], function (FavoritesController, ReposController, RepoController, BuildController, BuildsController, JobController) {
  return {
    FavoritesController : FavoritesController,
    ReposController  : ReposController,
    RepoController   : RepoController,
    BuildController  : BuildController,
    BuildsController : BuildsController,
    JobController    : JobController
  };
});