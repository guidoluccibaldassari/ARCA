require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('configUsers_ro.json');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//--- --- --- --- --- JavaWebToken --- --- --- --- ---
// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
app.use(expressJwt({
  secret: config.secret,
  getToken: function (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
//a meno che il path non sia:
}).unless({ path: 
  ['/',                     //
   '/workarea',             //
   '/informationretrieval', //queste tre servono per gestire il corretto flusso dell'informazione in caso ro
   '/users/authenticate'    //questa serve per permettere login
  ] })
);

// --- --- --- --- --- routes --- --- --- --- ---
//ricevo una richiesta per una route

//per workarea ed informationretrieval richiedo il controller adeguato e instrado...
app.use('/workarea', require('controllers/workarea.controller'));
app.use('/informationretrieval', require('controllers/informationretrieval.controller'));

//per workareaIntranet ed informationretrievalIntranet richiedo il controller adeguato e instrado... - separo per una maggior comodità implementativa e per ragioni di sicurezza: express in mancanza del JWT adeguato può bloccare tutto sul nascere
app.use('/workareaIntranet', require('controllers/workareaIntranet.controller'));
app.use('/informationretrievalIntranet', require('controllers/informationretrievalIntranet.controller'));

//per tutto ciò che riguarda la gestione utenti sul db (login/auth,users,register) richiedo il controller users.
app.use('/users', require('./controllers/users.controller'));

// --- --- --- --- --- start server --- --- --- --- ---

var port = process.env.NODE_ENV === 'production' ? 80 : 4000;
var server = app.listen(port,"0.0.0.0",function () {
    console.log('Server listening on port ' + port);
});

//var server = app.listen(4000,'0.0.0.0');
