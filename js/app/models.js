define([
  'models/Account',
  'models/Broadcast',
  'models/Build',
  'models/Commit',
  'models/Job',
  'models/Repo',
  'models/Worker'
], function (Account, Broadcast, Build, Commit, Job, Repo, Worker) {
  return {
    Account: Account,
    Broadcast: Broadcast,
    Build: Build,
    Commit: Commit,
    Job: Job,
    Repo: Repo,
    Worker: Worker
  };
});