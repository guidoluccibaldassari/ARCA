/*L'idea è di gestire i singoli servizi in maniera "atomica" ma non troppo. Qui raggruppiamo tutte le eventuali funzionalità relative all'area di lavoro complessiva
WORKAREA.
E' il contenitore dell'intera sessione di navigazione e ricerca.*/

var configro = require('../configApp_ro.json');
var config = configro;
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

var service = {};

service.generalGetServ       =  generalGetServInternal;
service.generalGetServM      =  generalGetServMInternal;

module.exports = service;

function generalGetServInternal(querySelector){ 
  if(querySelector=='SideBarLinks'){return getSideBarLinks();} //i link nella sidebar relativi ai possibili campi di ricerca (NON L'ALBERO!)
  else if(querySelector=='ExtractHyperlinkEnabledFields'){return getHyperlinkEnabledFields();} //quei campi di cui mi interessa abilitare la funzione di collegamento interno
  else{
    var deferred=Q.defer();
    return deferred.promise;
  }
}

function generalGetServMInternal(args){
  //console.log("1st service.js internal call");
  //console.log(JSON.stringify(args));
  if((args[0]=='ExtractSearchFields')&&(args.length==3)){return getGlobalSearchFields(args);} //i campi di ricerca delle collezioni globali
  else if(args[0]=='ExtractNGCollections'){return getNGCollections(args);} //le collezioni su cui ricercare per ciascun nodo geografico - forse lunico dato per cui potrebbe interessarci filtrare per published? Non è comunque possibile da qui, eventualmente nel punto Angular in cui viene effettuata la chiamata. 
  else{
    var deferred=Q.defer();
    return deferred.promise;
  }
}

function getSideBarLinks(){
//  console.log(connectionString);
  //db.settings.find({$and:[{Nome_Impostazione:"Abilita_Visione_Globale_Nodo"},{Valore_Impostazione:"Y"}]})
  var query = {$and:[{Nome_Impostazione:"Abilita_Visione_Globale_Nodo"},{Valore_Impostazione:"Y"},{Progetto:config.projectName}]};
  var proj = {_id:0,Titolo_Nodo:1};
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
  var db_collection =db.collection("settings");
  db_collection.find(query).project(proj).toArray(function(err,results) {
    deferred.resolve(results);
    client.close();
    return deferred.promise;});
//-----------------------------------------------------------
}});
//-----------------------------------------------------------
  return deferred.promise;
}

function getHyperlinkEnabledFields(){
  /*qui la query deve essere semplice, qualcosa tipo prendi tutti gli oggetti della collezione classes
   *poi la parse la faccio qui per estrarre il dato che mi interessa-non mi è possibile fare certe estrazioni in mongodb
   *per limiti tecnologici intrinseci.*/
  var query = {$or:[
	  {$and:[
		  {"customized_Class":true},
		  {"custom_Project_Configuration":config.projectName}
	  ]},
	  {$and:[
		  {"customized_Class":false},
		  {"custom_Project_Configuration":"none"}
	  ]}
  ]};
  var proj = {};
  var deferred = Q.defer();
  var elaboratedRows=[];
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
	var db_collection =db.collection("classes");
	db_collection.find(query).project(proj).toArray(function(err,results) {
	  for(var i=0;i<results.length;i++){
		var row=[];
		row.push(results[i].title);
		row.push(results[i].default_Collection);
	    for(var j=0;j<Object.keys(results[i].properties).length;j++){
		  if((((Object.values(results[i].properties)[j]).hyperlink_capabilities=="Y")||((Object.values(results[i].properties)[j]).hyperlink_capabilities=="N"))&&((Object.values(results[i].properties)[j]).scope=="data"))
	      {
			row.push((Object.keys(results[i].properties)[j]));
            row.push((Object.values(results[i].properties)[j]).target_coll_for_scripts);
            row.push((Object.values(results[i].properties)[j]).hyperlink_capabilities);
	      }
	    } 
	    if(row.length>2)elaboratedRows.push(row);
	  }
	  deferred.resolve(elaboratedRows);
	  client.close();
	  return deferred.promise;
	  }
	);
//-----------------------------------------------------------
}});
//-----------------------------------------------------------
  return deferred.promise;  
}

function getGlobalSearchFields(args){
  var indexed=args[1];
  var target=args[2];
  var elaboratedResRows=[];
  var query = {$or:[{$and:[{"title":target},{"customized_Class":true},{"custom_Project_Configuration":config.projectName}]},{$and:[{"title":target},{"customized_Class":false},{"custom_Project_Configuration":"none"}]}]};
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
  var db_collection =db.collection("classes");
  db_collection.findOne(query, function(err,results) {
    elaboratedResRows.push(results.default_Collection);
    for(var i=0; i<Object.keys(results.properties).length; i++) {
		var row = [];
		if (((Object.values(results.properties)[i]).indexed_ARCA==indexed)&&((Object.values(results.properties)[i]).scope=="data")) {
			row.push(Object.keys(results.properties)[i]);
			row.push((Object.values(results.properties)[i]).description);
			elaboratedResRows.push(row);
		}
	}
    deferred.resolve(elaboratedResRows);
    client.close();
    return deferred.promise;});
//-----------------------------------------------------------
}});
//-----------------------------------------------------------
  return deferred.promise;
}

function getNGCollections(args){
  var campo_ricerca=args[1];
  var valore_ricerca=args[2];
  var query = {$and:[{[campo_ricerca]:valore_ricerca},{"Progetto":config.projectName}]};
  var proj = {_id:0,"US":1,"USM":1,"USR":1,"Contabilizzati":1,"RA":1,"AT":1,"NU":1,"Documento":1};
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
  var db_collection =db.collection("structures");
  db_collection.find(query).project(proj).toArray(function(err,results){
//	console.log(results);
    deferred.resolve(results);
    client.close();
    return deferred.promise;}
  );
//-----------------------------------------------------------
}});
//-----------------------------------------------------------
  return deferred.promise;
}
