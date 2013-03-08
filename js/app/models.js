define([
  'models/Repo',
  'models/Builds'
], function (Repo, Builds) {
  return {
    Repo: Repo,
    Builds: Builds
  };
});