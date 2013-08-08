define([
  'models/Build',
  'models/Commit',
  'models/Job',
  'models/Repo'
], function (Build, Commit, Job, Repo) {
  return {
    Build  : Build,
    Commit : Commit,
    Job    : Job,
    Repo   : Repo
  };
});