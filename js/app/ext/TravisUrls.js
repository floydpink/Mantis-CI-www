define([
       ], function () {
  return {
    apiEndpoint       : 'https://api.travis-ci.org',
    plainTextLog      : function (id) {
      return "" + this.apiEndpoint + "/jobs/" + id + "/log.txt?deansi=true";
    },
    githubPullRequest : function (slug, pullRequestNumber) {
      return "http://github.com/" + slug + "/pull/" + pullRequestNumber;
    },
    githubCommit      : function (slug, sha) {
      return "http://github.com/" + slug + "/commit/" + sha;
    },
    githubRepo        : function (slug) {
      return "http://github.com/" + slug;
    },
    githubWatchers    : function (slug) {
      return "http://github.com/" + slug + "/watchers";
    },
    githubNetwork     : function (slug) {
      return "http://github.com/" + slug + "/network";
    },
    githubAdmin       : function (slug) {
      return "http://github.com/" + slug + "/settings/hooks#travis_minibucket";
    },
    statusImage       : function (slug, branch) {
      return ("" + location.protocol + "//" + location.host + "/" + slug + ".png") + (branch ? "?branch=" + branch : '');
    },
    email             : function (email) {
      return "mailto:" + email;
    }
  };
});