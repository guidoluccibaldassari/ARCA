//Connessione
var config = require('../configUsers_ro.json');
var db = require('mongodb').Db;
var mongoClient = require('mongodb').MongoClient;
var f = require('util').format;
var user = encodeURIComponent(config.user_str);
var password = encodeURIComponent(config.password_str);
const connectionString = f(config.prefix+'%s:%s@'+config.host+':'+config.port+'/'+'?authMechanism=%s;authSource=%s;'+config.options,user,password,config.authMechanism,config.dbName);
//const connectionString = 'mongodb://dbu:nonea@localhost:27017/?authMechanism=DEFAULT;authSource=appDb;poolSize=15;connectTimeoutMS=150000'
//const connectionString = 'mongodb://undefined:undefined@localhost::27017/?authMechanism=undefined;authSource=/appDb;undefined'
var db;

//Altri
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

/*Sto lavorando all'implementazione server dello user service che gestisce un po' tutto il sistema utenti.
 *Occorre lavorarci ancora, ricontrollare tutti i campi del mio modello user e della collezione user su db, inoltre
 *occorre impostare connessione a db che è tuttora incompleta ...
 */

var service = {};

service.authenticate = authenticate;
//service.getAll = getAll;
//service.getById = getById;
//service.create = create;
//service.update = update;
//service.delete = _delete;

module.exports = service;

function authenticate(Username, Password) {
  var deferred = Q.defer();
//-----------------------------------------------------------
  mongoClient.connect(connectionString,function(err, client) {
      if(err)
      {
        console.log('*** Error on connection: '+err+' ***');
      }
      else {
        console.log('*** Connected! ***');
        db = client.db(config.dbName);
    //-----------------------------------------------------------
        var db_collection =db.collection("users");
        db_collection.findOne({ Username: Username }, function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            else if (user && bcrypt.compareSync(Password, user.Password)) {
              // authentication successful
              deferred.resolve({
                  _id              : user._id,
                  Username         : user.Username,
                  Nome             : user.Nome,
                  Cognome          : user.Cognome,
                  Progetto         : user.Progetto,
                  Gruppi_associati : user.Gruppi_associati,
                  token            : jwt.sign({ sub: user._id }, config.secret)
              });
              //return deferred.promise;
            } else {
              // authentication failed
              deferred.resolve();
              //return deferred.promise;
            }
            client.close();
            return deferred.promise;
        });
        return deferred.promise;
      }
  });
  return deferred.promise;
}

//function getAll() {
//  var deferred = Q.defer();
//  db.users.find().toArray(function (err, users) {
//      if (err) deferred.reject(err.name + ': ' + err.message);
//      // return users (without hashed Passwords)
//      users = _.map(users, function (user) {
//          return _.omit(user, 'hash');
//      });
//      deferred.resolve(users);
//  });
//  return deferred.promise;
//}
//
//function getById(_id) {
//  var deferred = Q.defer();
//  db.users.findById(_id, function (err, user) {
//      if (err) deferred.reject(err.name + ': ' + err.message);
//      if (user) {
//        // return user (without hashed Password)
//        deferred.resolve(_.omit(user, 'hash'));
//      } else {
//        // user not found
//        deferred.resolve();
//      }
//  });
//  return deferred.promise;
//}
//
//function create(userParam) {
//  var deferred = Q.defer();
//  // validation
//  db.users.findOne(
//    { Username: userParam.Username },
//    function (err, user) {
//      if (err) deferred.reject(err.name + ': ' + err.message);
//      if (user) {
//        // Username already exists
//        deferred.reject('Username "' + userParam.Username + '" is already taken');
//      } else {
//        createUser();
//      }
//    });
//  function createUser() {
//    // set user object to userParam without the cleartext Password
//    var user = _.omit(userParam, 'Password');
//    // add hashed Password to user object
//    user.hash = bcrypt.hashSync(userParam.Password, 10);
//    db.users.insert(
//      user,
//      function (err, doc) {
//        if (err) deferred.reject(err.name + ': ' + err.message);
//        deferred.resolve();
//      }
//    );
//  }
//  return deferred.promise;
//}
//
//function update(_id, userParam) {
//  var deferred = Q.defer();
//  // validation
//  db.users.findById(_id, function (err, user) {
//    if (err) deferred.reject(err.name + ': ' + err.message);
//    if (user.Username !== userParam.Username) {
//      // Username has changed so check if the new Username is already taken
//      db.users.findOne(
//        { Username: userParam.Username },
//        function (err, user) {
//          if (err) deferred.reject(err.name + ': ' + err.message);
//          if (user) {
//            // Username already exists
//            deferred.reject('Username "' + req.body.Username + '" is already taken')
//          } else {
//            updateUser();
//          }
//        }
//      );
//    } else {
//      updateUser();
//    }
//  });
//
//  function updateUser() {
//    // fields to update
//    var set = {
//      Nome: userParam.Nome,
//      Cognome: userParam.Cognome,
//      Username: userParam.Username,
//    };
//    // update Password if it was entered
//    if (userParam.Password) {
//      set.hash = bcrypt.hashSync(userParam.Password, 10);
//    }
//    db.users.update(
//      { _id: mongo.helper.toObjectID(_id) },
//      { $set: set },
//      function (err, doc) {
//        if (err) deferred.reject(err.name + ': ' + err.message);
//        deferred.resolve();
//      });
//  }
//  return deferred.promise;
//
//}
//
//function _delete(_id) {
//  var deferred = Q.defer();
//  db.users.remove(
//    { _id: mongo.helper.toObjectID(_id) },
//    function (err) {
//      if (err) deferred.reject(err.name + ': ' + err.message);
//      deferred.resolve();
//    });
//  return deferred.promise;
//} 
