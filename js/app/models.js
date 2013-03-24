define([
  'models/Account',
  'models/Broadcast',
  'models/Build',
  'models/Commit',
  'models/Event',
  'models/Job',
  'models/Repo',
  'models/Worker'
], function (Account, Broadcast, Build, Commit, Event, Job, Repo, Worker) {
  return {
    Account  : Account,
    Broadcast: Broadcast,
    Build    : Build,
    Commit   : Commit,
    Event    : Event,
    Job      : Job,
    Repo     : Repo,
    Worker   : Worker
  };
});