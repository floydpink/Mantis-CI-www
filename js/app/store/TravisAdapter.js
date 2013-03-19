define([
  'ext/TravisAjax',
  'ember-data',
  'store/TravisSerializer',
  'models/Repo',
  'models/Build',
  'models/Commit',
  'models/Job',
  'models/Account',
  'models/Worker',
  'models/Broadcast'
], function (TravisAjax, DS, Serializer, Repo, Build, Commit, Job, Account, Worker, Broadcast) {

  DS.JSONTransforms['object'] = {
    deserialize : function (serialized) {
      return serialized;
    },
    serialize   : function (deserialized) {
      return deserialized;
    }
  };

  var RestAdapter = DS.RESTAdapter.extend({
    serializer    : Serializer,
    mappings      : {
      broadcasts   : Broadcast,
      repositories : Repo,
      repository   : Repo,
      repos        : Repo,
      repo         : Repo,
      builds       : Build,
      build        : Build,
      commits      : Commit,
      commit       : Commit,
      jobs         : Job,
      job          : Job,
      account      : Account,
      accounts     : Account,
      worker       : Worker,
      workers      : Worker
    },
    plurals       : {
      repositories : 'repositories',
      repository   : 'repositories',
      repo         : 'repos',
      repos        : 'repos',
      build        : 'builds',
      branch       : 'branches',
      job          : 'jobs',
      worker       : 'workers',
      profile      : 'profile'
    },
    ajax          : function () {
      return TravisAjax.ajax.apply(this, arguments);
    },
    sideload      : function (store, type, json) {
      if (json && json.result) {

      } else {
        return this._super.apply(this, arguments);
      }
    },
    merge         : function (store, record, serialized) {
      return this.get('serializer').merge(record, serialized);
    },
    didFindRecord : function (store, type, payload) {
      if ((type === Build || type === Job) && (payload.commit != null)) {
        payload.commits = payload.commit;
        delete payload.commit;
      }
      return this._super.apply(this, arguments);
    },
    didSaveRecord : function (store, type, record, payload) {
      if ((payload != null ? payload.result : void 0) === true) {
        payload = {};
        payload[type.singularName()] = record.serialize();
      }
      return this._super(store, type, record, payload);
    }
  });

  RestAdapter.map('App.Commit', {});

  RestAdapter.map('App.Build', {
    repoId    : {
      key : 'repository_id'
    },
    repo      : {
      key : 'repository_id'
    },
    _duration : {
      key : 'duration'
    },
    jobs      : {
      key : 'job_ids'
    },
    _config   : {
      key : 'config'
    }
  });

  RestAdapter.map('App.Repo', {
    _lastBuildDuration : {
      key : 'last_build_duration'
    }
  });

  RestAdapter.map('App.Job', {
    repoId  : {
      key : 'repository_id'
    },
    repo    : {
      key : 'repository_id'
    },
    _config : {
      key : 'config'
    }
  });

//  RestAdapter.map('App.User', {
//    _name: {
//      key: 'name'
//    }
//  });

//  RestAdapter.map('App.Sponsor', {
//    _image: {
//      key: 'image'
//    }
//  });

  return RestAdapter;

});