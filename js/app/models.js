define([
  'models/RepoSummary',
  'models/Repo',
  'models/Build'
], function (RepoSummary, Repo, Build) {
  return {
    RepoSummary: RepoSummary,
    Repo: Repo,
    Build: Build
  };
});