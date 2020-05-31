/*L'idea è di gestire i singoli servizi in maniera "atomica" ma non troppo. Qui raggruppiamo tutte le eventuali funzionalità relative all'area di lavoro complessiva
informationretrieval.
E' il servizio che si occupa di accedere al database contenente i dati*/

﻿var configro = require('../configData_ro.json');
var config = configro;
var config_proj = config.projectName;
var db = require('mongodb').Db;
var mongoClient = require('mongodb').MongoClient;
var f = require('util').format;
//---
var user = encodeURIComponent(config.user_str);
var password = encodeURIComponent(config.password_str);
const connectionString = f(config.prefix+'%s:%s@'+config.host+':'+config.port+'/'+'?authMechanism=%s;authSource=%s;'+config.options,user,password,config.authMechanism,config.dbName);
//---
var Q = require('q');
var db;

var ObjectId = require('mongodb').ObjectId;

var service = {};

service.generalPostServM     =  generalPostServMInternal;
service.generalGetServ       =  generalGetServInternal;
service.generalGetServM      =  generalGetServMInternal;

module.exports = service;

//Qui dentro invece uso i deferred come oggetti da ritornare alle promise e di conseguenza agli observables

//Qui smisto il traffico di ricerca sui dati dalla workarea con più di un argomento in base al primo parametro della query
function generalPostServMInternal (args) {
  //console.log("1st service.js internal call");
  //console.log(JSON.stringify(args));
  //E' la post, per cui la chiamata effettuata dalla ricerca del form!
  //Questa quella relativa alla ricerca sulla collezione globale
  if (args[0]=='GlobalCollection') {return getGlobalQueryResults(args);} //FILTRARE
  //Questa la ricerca relativa ad un nodo
  else if (args[0]=='GeoNodeId') {return getLocalGeoNodeQueryResults(args);} //FILTRARE
  else {
    var deferred = Q.defer();
    return deferred.promise;
  }
}

function generalGetServInternal (querySelector) {
  //Questa la query per l'albero
  if (querySelector=='SideBarLinksNG') {return getSideBarLinksNG();}
  else {
	  //ritorna un deferred vuoto che non verrà mai riempito e fallirà ,ma lo farà nel client, il quale non farà nulla si limiterà a loggare errore ma 
	  //il sistema resterà in piedi
    var deferred = Q.defer();
    return deferred.promise;
  }
}

function generalGetServMInternal (args) {
  //questa la query del dettaglio
  if ((args[0]=='collection')&&(args[2]=='objectId')&&(args.length==4)) {return getDocumentContentById(args);} //FILTRARE
  //aggiungo una chiamata intermedia per query con ulteriori selettori
  //questa la query per figli
  else if ((args[0]=='collection')&&(args[2]=='objectId')&&(args[4]=='selector')&&(args[5]=='queryDbForChildren')&&(args.length==6)) {return getAllChildrenOnAllCollectionsFromObId(args);} //FILTRARE
  //questa la query per parenti
  else if ((args[0]=='collection')&&(args[2]=='objectId')&&(args[4]=='selector')&&(args[5]=='queryDbForParentInfo')&&(args.length==6)) {return getParentInfoFromObId(args);} //FILTRARE
  else {
    var deferred = Q.defer();
    return deferred.promise;
  }
}

function getGlobalQueryResults(args) {//FILTRARE - OK
  var query="";
  var comma=0;
  var notNull=0;
  var multipleArgs=0;
  for (var i=2; i<args.length; i+=2){
	if((comma==1)&&(i<args.length-1)&&(args[i+1]!="")){query=query+",";comma=0;}
	if(args[i+1]==""){continue;}
	else {comma=1; notNull=1;}
	if (!isNaN(args[i+1])){query=query+"{$where:'(/.*"+args[i+1]+".*/).test(this."+args[i]+")'}";}
	else {query=query+"{'"+args[i]+"':/.*"+args[i+1]+".*/}";}
	if(i>3){multipleArgs=1;}
  }
  //Ormai tutti gli argomenti sono multipli: il filtro per published va aggiunto sempre
//  if(multipleArgs==1){
//    query="{$and:["+query+"]}"
//  }
  //Filtro dati pubblicati
  //query="{$and:["+query+",{'Pubblicato':{$ne:false}}"+"]}"
  //Filtro dati pubblicati e progetto
  query="{$and:["+query+",{'Pubblicato':{$ne:false}}"+",{'Progetto':{$eq:'"+config_proj+"'}}"+"]}"
  //Chiusura parentesi
  query="("+query;
  query=query+")";
//  if(notNull!=1){query="({})";}//query con 0 argomenti, cerca su tutto!
//  if(notNull!=1){query="({'Pubblicato':{$ne:false}})";}//filtrata per pubblicazione
  if(notNull!=1){query="({$and:[{'Pubblicato':{$ne:false}},{'Progetto':{$eq:'"+config_proj+"'}}]})";}//filtrata per pubblicazione + progetto
  var projection="";
  var projection='({'
  projection=projection+"_id:1";
  for (var i=2; i<args.length; i+=2) {
    projection=projection+",";
    projection=projection+args[i]+":1";
  }
  projection=projection+'})';
  var deferred=Q.defer();
  var collection=args[1];
  collection=collection.toLowerCase();
//  console.log('GetGlobalQueryResult--->');
//  console.log(query);
//  console.log(projection);
//  console.log(collection);
//  console.log('<---GetGlobalQueryResult');
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

function getLocalGeoNodeQueryResults(args) {//FILTRARE - OK
  //console.log(args[2]);
  var query="";
  var comma=0;
  var notNull=0;
  var multipleArgs=0;
//  console.log(args);
  for (var i=3; i<args.length; i+=2){
	if((comma==1)&&(i<args.length-1)&&(args[i+1]!="")){query=query+",";comma=0;}
	if(args[i+1]==""){continue;}
	else {comma=1; notNull=1;}
	if (args[i]=="Discende_Da"){query=query+"{'"+args[i]+"':'"+args[i+1]+"'}";}
	else if (!isNaN(args[i+1])){query=query+"{$where:'(/.*"+args[i+1]+".*/).test(this."+args[i]+")'}";}
	else {query=query+"{'"+args[i]+"':/.*"+args[i+1]+".*/}";}
	if(i>4){multipleArgs=1;}
  }
  //Ormai tutti gli argomenti sono multipli: il filtro per published va aggiunto sempre
//  if(multipleArgs==1){
//    query="{$and:["+query+"]}"
//  }
  //Filtro dati pubblicati
  //query="{$and:["+query+",{'Pubblicato':{$ne:false}}"+"]}"
  //Filtro dati pubblicati e progetto
  query="{$and:["+query+",{'Pubblicato':{$ne:false}}"+",{'Progetto':{$eq:'"+config_proj+"'}}"+"]}"
  //Chiusura parentesi
  query="("+query;
  query=query+")";
//  if(notNull!=1) {query="({})";}
//  if(notNull!=1){query="({'Pubblicato':{$ne:false}})";}
  if(notNull!=1){query="({$and:[{'Pubblicato':{$ne:false}},{'Progetto':{$eq:'"+config_proj+"'}}]})";}//filtrata per pubblicazione + progetto
  var projection="";
  var projection='({'
  projection=projection+"_id:1";
  for (var i=3; i<args.length-2; i+=2) {
    projection=projection+",";
    projection=projection+args[i]+":1";
  }
  projection=projection+'})';
//  console.log('query');
//  console.log(query);
  //console.log('projection');
  //console.log(projection);
  var deferred=Q.defer();
  var collection=args[2];
  collection=collection.toLowerCase();
//  console.log(collection);
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

function getDocumentContentById(args) {//FILTRARE
  var deferred=Q.defer();
  var collection=args[1];
  var param=args[3].replace(/"/g,'');
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
//    console.log(results);
//    console.log(results[0]);
//    console.log(results[0].Pubblicato);
    if(results[0].Pubblicato!==true){
      results = [];
      results.push({Errore:"Il dato richiesto non è ancora stato pubblicato."});
    }
    deferred.resolve(results);
	client.close();
	return deferred.promise;
  });
//-----------------------------------------------------------
}});
//-----------------------------------------------------------
  return deferred.promise;
}

function atomicRecursiveQuery(query,collectionsArray,resultsArray,def){//FILTRARE Qui non serve.
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
function getAllChildrenOnAllCollectionsFromObId(args) {//FILTRARE Qui non serve.
  var rArray=[];
  var cArray=[];
  var deferred=Q.defer();
  var param = args[3].replace(/"/g,'');
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
	  if(((items[i].s.name)==args[1])&&(args[1]!='geographicNodes')){continue;}
      else{cArray.push(items[i].s.name);}
    }
//	console.log(cArray);
	query={"Discende_Da":param};
    atomicRecursiveQuery(query,cArray,rArray,deferred);
  });
//-----------------------------------------------------------
}});
//-----------------------------------------------------------
  return deferred.promise;
}

function getParentInfoFromObId(args) {//FILTRARE? Qui non serve.
  //console.log('start-gpifoi');
  var rArray=[];
  var cArray=[];
  var deferred=Q.defer();
  var param = args[3].replace(/"/g,'');
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
	  if(((items[i].s.name)==args[1])&&(args[1]!='geographicNodes')){continue;}
      else{cArray.push(items[i].s.name);}
    }
//	console.log(cArray);
//	console.log(param);
	query={"_id":ObjectId(param)};
//	console.log(query);
//	console.log('end-gpifoi');
    atomicRecursiveQuery(query,cArray,rArray,deferred);
  });
//-----------------------------------------------------------
}});
//-----------------------------------------------------------
  return deferred.promise;
}
