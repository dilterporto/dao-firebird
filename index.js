var Firebird = require('node-firebird'),
  Q = require('q');

var Dao = function(options){

  var def = Q.defer();

  return {

    query: function(sql){

      Firebird.attach(options, function(err, db){

        if(err)
          def.reject(err);

        var query = new Query(db, sql);

        query
          .then(function(rows){
            def.resolve(rows);
          })
          .fail(function(err){
            def.reject(err);
          });
      });

      return def.promise;
    }
  }
};

var Query = function(db, sql){

  var def = Q.defer();

  if(db == undefined) {

    def.reject(new Error('db connection error'));

  }
  else {

    db.query(sql, function(err, result){

      if(err){
        def.reject(err);
      } else {
        var rows = result.map(function(e){

          var temp = {};

          Object.keys(e).forEach(function(ex){

            if(e[ex])
              temp[ex] = e[ex].toString();
          });

          return temp;
        });

        def.resolve(rows);
      }

      db.detach();
    });
  }

  return def.promise;
};

module.exports = Dao;
