/*L'idea è di gestire i singoli servizi in maniera "atomica" ma non troppo. Qui raggruppiamo tutte le eventuali funzionalità relative all'area di lavoro complessiva
informationretrieval.
E' il servizio che si occupa di accedere al database contenente i dati*/

﻿var configro = require('../configData_ro.json');
﻿var configrw = require('../configData_rw.json');
var db = require('mongodb').Db;
var mongoClient = require('mongodb').MongoClient;
var f = require('util').format;
var user;
var password;
var connectionString;
var Q = require('q');
var db;

var ObjectId = require('mongodb').ObjectId;

var service = {};

service.generalPostServM     =  generalPostServMInternal;
//service.generalGetServ       =  generalGetServInternal;
service.generalGetServM      =  generalGetServMInternal;

module.exports = service;

//Qui dentro invece uso i deferred come oggetti da ritornare alle promise e di conseguenza agli observables

//Qui smisto il traffico di ricerca sui dati dalla workarea con più di un argomento in base al primo parametro della query
//Unificato
function generalPostServMInternal (args) {
//  console.log("1st service.js internal call");
//  console.log(JSON.stringify(args));
//  console.log(args);
  var p=2+(args[1]*2);
//  console.log(p);
//  console.log(args[p]);
//  if (args[0]=='GlobalCollection') {return getGlobalQueryResults(args);}
//  else if (args[0]=='GeoNodeId') {return getLocalGeoNodeQueryResults(args);}
  if (args[p]=='GlobalCollection') {return getGlobalQueryResults(args);}
  else if (args[p]=='GeoNodeId') {return getLocalGeoNodeQueryResults(args);}
  else {
    var deferred = Q.defer();
    return deferred.promise;
  }
}

/* Abbiamo unificato get con 1 argomento e M argomenti
function generalGetServInternal (querySelector) {
  if (querySelector=='SideBarLinksNG') {return getSideBarLinksNG();}
  else {
	  //ritorna un deferred vuoto che non verrà mai riempito e fallirà ,ma lo farà nel client, il quale non farà nulla si limiterà a loggare errore ma 
	  //il sistema resterà in piedi
    var deferred = Q.defer();
    return deferred.promise;
  }
}
*/

function generalGetServMInternal (args) {
//  console.log(args);
  var p=((args[1]*1)+2)*2-2;
//  console.log(p);
//  console.log(args[p]);
//  if ((args[0]=='querySelector')&&(args[1]=='SideBarLinksNG')) {return getSideBarLinksNG();}
//  else if ((args[0]=='collection')&&(args[2]=='objectId')&&(args.length==4)) {return getDocumentContentById(args);}
//  else if ((args[0]=='collection')&&(args[2]=='objectId')&&(args[4]=='selector')&&(args[5]=='queryDbForChildren')&&(args.length==6)) {return getAllChildrenOnAllCollectionsFromObId(args);}
//  else if ((args[0]=='collection')&&(args[2]=='objectId')&&(args[4]=='selector')&&(args[5]=='queryDbForParentInfo')&&(args.length==6)) {return getParentInfoFromObId(args);}
  if ((args[p]=='querySelector')&&(args[p+1]=='SideBarLinksNG')) {return getSideBarLinksNG();}
  else if ((args[p]=='collection')&&(args[p+2]=='objectId')&&(args.length==p+4)) {return getDocumentContentById(args);}
  else if ((args[p]=='collection')&&(args[p+2]=='objectId')&&(args[p+4]=='selector')&&(args[p+5]=='queryDbForChildren')&&(args.length==p+6)) {return getAllChildrenOnAllCollectionsFromObId(args);}
  else if ((args[p]=='collection')&&(args[p+2]=='objectId')&&(args[p+4]=='selector')&&(args[p+5]=='queryDbForParentInfo')&&(args.length==p+6)) {return getParentInfoFromObId(args);}
  else {
    var deferred = Q.defer();
    return deferred.promise;
  }
}

//questa è quella che chiede risultati per la ricerca globale per collezione. FILTRARE in un'unica mandata per tutte le condizioni
//"Gruppi_con_accesso_ro" : [ "ro" ], "Gruppi_con_accesso_rw" : [ "rw" ], "Pubblicato" : false
//db.collection.find( { Gruppi_con_accesso_rw: "rw" } )
function getGlobalQueryResults(args) {
//-----------------------------------------------------------
//  console.log(args);
  var args_l=[];
  var args_t=[];
  var p=2+(args[1]*2);
  for(var i=0;i<p;i++)
  {
//    console.log('1 - '+args[i])
    args_l.push(args[i]);
  }
  for(var i=p;i<args.length;i++)
  {
//    console.log('2 - '+args[i])
    args_t.push(args[i]);
  }
//  console.log(args_t);
  var query_g_ro="{$or:[";
  var query_g_rw="{$or:[";
  for(var i=3;i<args_l.length;i=i+2){
    (i>3)?query_g_ro=query_g_ro+',':query_g_ro=query_g_ro;
    (i>3)?query_g_rw=query_g_rw+',':query_g_rw=query_g_rw;
    query_g_ro=query_g_ro+"{'Gruppi_con_accesso_ro':'"+args_l[i]+"'}";
    query_g_rw=query_g_rw+"{'Gruppi_con_accesso_rw':'"+args_l[i]+"'}";
  }
  var query_g_ro=query_g_ro+"]}";
  var query_g_rw=query_g_rw+"]}";
//-----------------------------------------------------------
//ogni chiamata deve avere le sue variabili private di lavoro per la configurazione, non globali che rischiano di sovrascriversi a vicenda fra chiamate di diversi utenti
  var mod='RO'
//qui va inserita condizione
//-----------------------------------------------------------
//-----------------------------------------------------------
  ﻿var config = configro;
  if (mod=='RW') config=configrw;
  else config=configro;
  var config_proj = config.projectName;
  user = encodeURIComponent(config.user_str);
  password = encodeURIComponent(config.password_str);
  connectionString = f(config.prefix+'%s:%s@'+config.host+':'+config.port+'/'+'?authMechanism=%s;authSource=%s;'+config.options,user,password,config.authMechanism,config.dbName);
//-----------------------------------------------------------
  var query="";
  var comma=0;
  var notNull=0;
  var multipleArgs=0;
  for (var i=2; i<args_t.length; i+=2){
	if((comma==1)&&(i<args_t.length-1)&&(args_t[i+1]!="")){query=query+",";comma=0;}
	if(args_t[i+1]==""){continue;}
	else {comma=1; notNull=1;}
	if (!isNaN(args_t[i+1])){query=query+"{$where:'(/.*"+args_t[i+1]+".*/).test(this."+args_t[i]+")'}";}
	else {query=query+"{'"+args_t[i]+"':/.*"+args_t[i+1]+".*/}";}
	if(i>3){multipleArgs=1;}
  }
  query=
    "{$and:["+
      query+","+
      "{$or:["+
        query_g_ro+","+query_g_rw+",{'Pubblicato':{$ne:false}}"+
      "]}"+
      ",{'Progetto':{$eq:'"+config_proj+"'}}"+
    "]}";
  query="("+query;
  query=query+")";
//query nulla
  if(notNull!=1){
    query=
    "({$and:["+
      "{$or:["+
        query_g_ro+","+query_g_rw+",{'Pubblicato':{$ne:false}}"+
      "]}"+
  	",{'Progetto':{$eq:'"+config_proj+"'}}]})";}//filtrata ANCHE per pubblicazione + progetto
  var projection="";
  var projection='({'
  projection=projection+"_id:1";
  for (var i=2; i<args_t.length; i+=2) {
    projection=projection+",";
    projection=projection+args_t[i]+":1";
  }
  projection=projection+'})';
  console.log(query);
  //console.log(projection);
  var deferred=Q.defer();
  var collection=args_t[1];
  collection=collection.toLowerCase();
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
  var db_collection=db.collection(collection);
  db_collection.find(eval(query)).project(eval(projection)).toArray(function(err,results) {
    //console.log(results);
    deferred.resolve(results);
	client.close();
	return deferred.promise;
  });
//-----------------------------------------------------------
}});
//-----------------------------------------------------------
  return deferred.promise;
}

function getSideBarLinksNG() {
//-----------------------------------------------------------
//ogni chiamata deve avere le sue variabili private di lavoro per la configurazione, non globali che rischiano di sovrascriversi a vicenda fra chiamate di diversi utenti
  var mod ='RO'
//qui va inserita condizione
//-----------------------------------------------------------
//-----------------------------------------------------------
  ﻿var config = configro;
  if (mod=='RW') config=configrw;
  else config=configro;
  user = encodeURIComponent(config.user_str);
  password = encodeURIComponent(config.password_str);
  connectionString = f(config.prefix+'%s:%s@'+config.host+':'+config.port+'/'+'?authMechanism=%s;authSource=%s;'+config.options,user,password,config.authMechanism,config.dbName);
//-----------------------------------------------------------
  var query = {Progetto:config.projectName};
  var proj = {_id:1,Nome_Nodo:1,Discende_Da:1,Nome_Tipologia_Nodo:1};
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
  var db_collection =db.collection("geographicNodes");
  db_collection.find(query).project(proj).sort({Nome_Nodo:1}).toArray(function(err,results){
    deferred.resolve(results);
    client.close();
    return deferred.promise;});
//-----------------------------------------------------------
}});
//-----------------------------------------------------------
  return deferred.promise;
}

function getLocalGeoNodeQueryResults(args) {
//-----------------------------------------------------------
//  console.log(args);
  var args_l=[];
  var args_t=[];
  var p=2+(args[1]*2);
  for(var i=0;i<p;i++)
  {
//    console.log('1 - '+args[i])
    args_l.push(args[i]);
  }
  for(var i=p;i<args.length;i++)
  {
//    console.log('2 - '+args[i])
    args_t.push(args[i]);
  }
//  console.log(args_t);
  var query_g_ro="{$or:[";
  var query_g_rw="{$or:[";
  for(var i=3;i<args_l.length;i=i+2){
    (i>3)?query_g_ro=query_g_ro+',':query_g_ro=query_g_ro;
    (i>3)?query_g_rw=query_g_rw+',':query_g_rw=query_g_rw;
    query_g_ro=query_g_ro+"{'Gruppi_con_accesso_ro':'"+args_l[i]+"'}";
    query_g_rw=query_g_rw+"{'Gruppi_con_accesso_rw':'"+args_l[i]+"'}";
  }
  var query_g_ro=query_g_ro+"]}";
  var query_g_rw=query_g_rw+"]}";
//-----------------------------------------------------------
//ogni chiamata deve avere le sue variabili private di lavoro per la configurazione, non globali che rischiano di sovrascriversi a vicenda fra chiamate di diversi utenti
  var mod ='RO'
//qui va inserita condizione
//-----------------------------------------------------------
//-----------------------------------------------------------
  ﻿var config = configro;
  if (mod=='RW') config=configrw;
  else config=configro;
  var config_proj = config.projectName;
  user = encodeURIComponent(config.user_str);
  password = encodeURIComponent(config.password_str);
  connectionString = f(config.prefix+'%s:%s@'+config.host+':'+config.port+'/'+'?authMechanism=%s;authSource=%s;'+config.options,user,password,config.authMechanism,config.dbName);
//-----------------------------------------------------------
  //console.log(args[2]);
  var query="";
  var comma=0;
  var notNull=0;
  var multipleArgs=0;
  for (var i=3; i<args_t.length; i+=2){
	if((comma==1)&&(i<args_t.length-1)&&(args_t[i+1]!="")){query=query+",";comma=0;}
	if(args_t[i+1]==""){continue;}
	else {comma=1; notNull=1;}
	if (args_t[i]=="Discende_Da"){query=query+"{'"+args_t[i]+"':'"+args_t[i+1]+"'}";}
	else if (!isNaN(args_t[i+1])){query=query+"{$where:'(/.*"+args_t[i+1]+".*/).test(this."+args_t[i]+")'}";}
	else {query=query+"{'"+args_t[i]+"':/.*"+args_t[i+1]+".*/}";}
	if(i>4){multipleArgs=1;}
  }
//  console.log(query);
  query=
    "{$and:["+
      query+","+
      "{$or:["+
        query_g_ro+","+query_g_rw+",{'Pubblicato':{$ne:false}}"+
      "]}"+
      ",{'Progetto':{$eq:'"+config_proj+"'}}"+
    "]}";
  query="("+query;
  query=query+")";
//query nulla
  if(notNull!=1){
    query=
    "({$and:["+
      "{$or:["+
        query_g_ro+","+query_g_rw+",{'Pubblicato':{$ne:false}}"+
      "]}"+
    ",{'Progetto':{$eq:'"+config_proj+"'}}]})";}//filtrata ANCHE per pubblicazione + progetto
  var projection="";
  var projection='({'
  projection=projection+"_id:1";
  for (var i=3; i<args_t.length-2; i+=2) {
    projection=projection+",";
    projection=projection+args_t[i]+":1";
  }
  projection=projection+'})';
  //console.log('query');
  console.log(query);
  //console.log('projection');
  //console.log(projection);
  var deferred=Q.defer();
  var collection=args_t[2];
  collection=collection.toLowerCase();
  //console.log(collection);
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
  var db_collection=db.collection(collection);
  db_collection.find(eval(query)).project(eval(projection)).toArray(function(err,results) {
    //console.log(results);
    deferred.resolve(results);
	client.close();
	return deferred.promise;
  });
//-----------------------------------------------------------
}});
//-----------------------------------------------------------
  return deferred.promise;
}

//FILTRO ANCHE QUI, MA QUESTO E' DECISAMENTE PIU' COMPLESSO:
//questa pagina va prima controllata se RW, poi se RO/published forse va riscritta, per intero
function getDocumentContentById(args) {
//-----------------------------------------------------------
//  console.log(args);
  var args_l=[];
  var args_t=[];
  var p=((args[1]*1)+2)*2-2;
//  console.log(p);
  for(var i=0;i<p;i++)
  {
//    console.log('1 - '+args[i])
    args_l.push(args[i]);
  }
  for(var i=p;i<args.length;i++)
  {
//    console.log('2 - '+args[i])
    args_t.push(args[i]);
  }
  console.log(args_t);
//-----------------------------------------------------------
//ogni chiamata deve avere le sue variabili private di lavoro per la configurazione, non globali che rischiano di sovrascriversi a vicenda fra chiamate di diversi utenti
  var mod ='RO'
//qui va inserita condizione
//-----------------------------------------------------------
//-----------------------------------------------------------
  ﻿var config = configro;
  if (mod=='RW') config=configrw;
  else config=configro;
  user = encodeURIComponent(config.user_str);
  password = encodeURIComponent(config.password_str);
  connectionString = f(config.prefix+'%s:%s@'+config.host+':'+config.port+'/'+'?authMechanism=%s;authSource=%s;'+config.options,user,password,config.authMechanism,config.dbName);
//-----------------------------------------------------------
  var deferred=Q.defer();
  var collection=args_t[1];
  var param=args_t[3].replace(/"/g,'');
  //console.log(param);
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
  var db_collection=db.collection(collection);
  db_collection.find({"_id":ObjectId(param)}).toArray(function(err,results) {
//    console.log(args_l);
//    console.log(results);
    for(var i=3;i<args_l.length;i+=2){
      for(var j=0;j<results[0].Gruppi_con_accesso_ro.length;j++){
        if (args_l[i]===results[0].Gruppi_con_accesso_ro[j]){
          results[0].user_access="ro";
        }
      }
    }
    for(var i=3;i<args_l.length;i+=2){
      for(var j=0;j<results[0].Gruppi_con_accesso_rw.length;j++){
        if (args_l[i]===results[0].Gruppi_con_accesso_rw[j]){
          results[0].user_access="rw";
        }
      }
    }
//    console.log(results[0].Pubblicato);
//    console.log(results[0].user_access);
    if(
       (results[0].Pubblicato===true)||
       (results[0].user_access==="ro")||
       (results[0].user_access==="rw")
      )
    {}
    else
    {
//      console.log(results[0]);
      results = [];
      results.push({Errore:"Il dato richiesto non è ancora stato pubblicato, o non si dispone dei diritti necessari alla visualizzazione."});
    }
//    console.log(results);
    deferred.resolve(results);
	client.close();
	return deferred.promise;
  });
//-----------------------------------------------------------
}});
//-----------------------------------------------------------
  return deferred.promise;
}

function atomicRecursiveQuery(query,collectionsArray,resultsArray,def){
//-----------------------------------------------------------
//ogni chiamata deve avere le sue variabili private di lavoro per la configurazione, non globali che rischiano di sovrascriversi a vicenda fra chiamate di diversi utenti
  var mod ='RO'
//qui va inserita condizione
//-----------------------------------------------------------
//-----------------------------------------------------------
  ﻿var config = configro;
  if (mod=='RW') config=configrw;
  else config=configro;
  user = encodeURIComponent(config.user_str);
  password = encodeURIComponent(config.password_str);
  connectionString = f(config.prefix+'%s:%s@'+config.host+':'+config.port+'/'+'?authMechanism=%s;authSource=%s;'+config.options,user,password,config.authMechanism,config.dbName);
//-----------------------------------------------------------
  //console.log(collectionsArray);
  var collection=collectionsArray.pop();
  //console.log(collection);
  if(collection==null){
	    def.resolve(resultsArray);
	    //client.close();
	    return def.promise;
  }
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
  var db_collection=db.collection(collection);
  db_collection.find(query).toArray(function(err,results){
	//console.log(results);
	if(results[0]!=null){resultsArray.push({"Collection":collection})}
	resultsArray.push(results);
	atomicRecursiveQuery(query,collectionsArray,resultsArray,def);
  });
//-----------------------------------------------------------
}});
//-----------------------------------------------------------
}

//i nodi geografici sono collegati tra loro per cui sia nella ricerca padri che in quella figli non posso escludere la collezione geographicNodes, quando si tratta di
// ricerca tra nodi collegati, mentre per i nodi dati standard non è possibile un collegamento interno.
function getAllChildrenOnAllCollectionsFromObId(args) {
//-----------------------------------------------------------
//  console.log(args);
  var args_l=[];
  var args_t=[];
  var p=((args[1]*1)+2)*2-2;
  for(var i=0;i<p;i++)
  {
//    console.log('1 - '+args[i])
    args_l.push(args[i]);
  }
  for(var i=p;i<args.length;i++)
  {
//    console.log('2 - '+args[i])
    args_t.push(args[i]);
  }
//  console.log(args_t);
//-----------------------------------------------------------
//ogni chiamata deve avere le sue variabili private di lavoro per la configurazione, non globali che rischiano di sovrascriversi a vicenda fra chiamate di diversi utenti
  var mod ='RO'
//qui va inserita condizione
//-----------------------------------------------------------
//-----------------------------------------------------------
  ﻿var config = configro;
  if (mod=='RW') config=configrw;
  else config=configro;
  user = encodeURIComponent(config.user_str);
  password = encodeURIComponent(config.password_str);
  connectionString = f(config.prefix+'%s:%s@'+config.host+':'+config.port+'/'+'?authMechanism=%s;authSource=%s;'+config.options,user,password,config.authMechanism,config.dbName);
//-----------------------------------------------------------
  var rArray=[];
  var cArray=[];
  var deferred=Q.defer();
  var param = args_t[3].replace(/"/g,'');
  //console.log(param);
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
  db.collections(function(err,items){
    for(var i=0;i<items.length;i++) {
	  if(((items[i].s.name)==args_t[1])&&(args_t[1]!='geographicNodes')){continue;}
      else{cArray.push(items[i].s.name);}
    }
	console.log(cArray);
	query={"Discende_Da":param};
    atomicRecursiveQuery(query,cArray,rArray,deferred);
  });
//-----------------------------------------------------------
}});
//-----------------------------------------------------------
  return deferred.promise;
}

function getParentInfoFromObId(args) {
//-----------------------------------------------------------
//  console.log(args);
  var args_l=[];
  var args_t=[];
  var p=((args[1]*1)+2)*2-2;
  for(var i=0;i<p;i++)
  {
//    console.log('1 - '+args[i])
    args_l.push(args[i]);
  }
  for(var i=p;i<args.length;i++)
  {
//    console.log('2 - '+args[i])
    args_t.push(args[i]);
  }
//  console.log(args_t);
//-----------------------------------------------------------
//ogni chiamata deve avere le sue variabili private di lavoro per la configurazione, non globali che rischiano di sovrascriversi a vicenda fra chiamate di diversi utenti
  var mod ='RO'
//qui va inserita condizione
//-----------------------------------------------------------
//-----------------------------------------------------------
  ﻿var config = configro;
  if (mod=='RW') config=configrw;
  else config=configro;
  user = encodeURIComponent(config.user_str);
  password = encodeURIComponent(config.password_str);
  connectionString = f(config.prefix+'%s:%s@'+config.host+':'+config.port+'/'+'?authMechanism=%s;authSource=%s;'+config.options,user,password,config.authMechanism,config.dbName);
//-----------------------------------------------------------
  //console.log('start-gpifoi');
  var rArray=[];
  var cArray=[];
  var deferred=Q.defer();
  var param = args_t[3].replace(/"/g,'');
  //console.log(param);
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
  db.collections(function(err,items){
    for(var i=0;i<items.length;i++) {
	  if(((items[i].s.name)==args_t[1])&&(args_t[1]!='geographicNodes')){continue;}
      else{cArray.push(items[i].s.name);}
    }
	console.log(cArray);
	//console.log(param);
	query={"_id":ObjectId(param)};
	//console.log(query);
	//console.log('end-gpifoi');
    atomicRecursiveQuery(query,cArray,rArray,deferred);
  });
//-----------------------------------------------------------
}});
//-----------------------------------------------------------
  return deferred.promise;
}
