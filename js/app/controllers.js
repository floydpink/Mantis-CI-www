define([
  'controllers/ReposController',
  'controllers/RepoController',
  'controllers/BuildController',
  'controllers/BuildsController',
  'controllers/JobController'
], function (ReposController, RepoController, BuildController, BuildsController, JobController) {
  return {
    ReposController  : ReposController,
    RepoController   : RepoController,
    BuildController  : BuildController,
    BuildsController : BuildsController,
    JobController    : JobController
  };
});