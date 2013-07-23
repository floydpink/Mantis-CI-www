define([
  'models/Account',
  'models/Build',
  'models/Commit',
  'models/Event',
  'models/Job',
  'models/Repo',
  'models/Worker'
], function (Account, Build, Commit, Event, Job, Repo, Worker) {
  return {
    Account: Account,
    Build  : Build,
    Commit : Commit,
    Event  : Event,
    Job    : Job,
    Repo   : Repo,
    Worker : Worker
  };
});