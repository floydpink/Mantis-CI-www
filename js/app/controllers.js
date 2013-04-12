define([
  'controllers/FavoritesController',
  'controllers/AboutController',
  'controllers/ReposController',
  'controllers/RepoController',
  'controllers/BuildController',
  'controllers/BuildsController',
  'controllers/JobController'
], function (FavoritesController, AboutController, ReposController, RepoController, BuildController, BuildsController, JobController) {
  return {
    FavoritesController : FavoritesController,
    AboutController     : AboutController,
    ReposController     : ReposController,
    RepoController      : RepoController,
    BuildController     : BuildController,
    BuildsController    : BuildsController,
    JobController       : JobController
  };
});