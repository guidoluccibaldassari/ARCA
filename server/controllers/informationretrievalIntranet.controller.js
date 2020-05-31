//OLD con redirect al servizio unificato
/*
//Questa rotta è solo un duplicato al fine di suddividere a livello di routing in routes completamente isolate
var express = require('express');
var informationretrievalIntranetRouter = express.Router();
var informationretrievalControllerRO = require('./informationretrieval.controller');
//Ma poi rimanda all'originale
informationretrievalIntranetRouter.use('/', informationretrievalControllerRO);
//Eventualmente qui arricchisco con richieste RW direttamente al servizio oppure sempre con inoltro al controller. Oppure mantengo tutto trasparente e gestisco a livello di query. 
module.exports = informationretrievalIntranetRouter;
*/


//Il sistema rende dell'html con dentro già dei link/costrutti per estrarre dinamicamente il contenuto richiesto dal click che chiameranno, ricorsivamente, altre rotte.
var express = require('express');
var informationretrievalIntranetRouter = express.Router();
var informationretrievalIntranetService = require('services/informationretrievalIntranet.service');

// routes
//qui ricevo per la get di workarea
//associo la funzione generalGet del service corrispondente che viene quindi direttamente ridiretta!

informationretrievalIntranetRouter.post('/',generalPost);
informationretrievalIntranetRouter.get('/',generalGet);

module.exports = informationretrievalIntranetRouter;

function generalPost(request, res) {
    var arguments = []; 
    //console.log("controller.js - post");
    //console.log("Body:");
    //console.log(JSON.stringify(request.body));
    for (var i=0; i<Object.keys(request.body).length; i++){
        //arguments.push(Object.keys(request.body)[i]);
        arguments.push(Object.values(request.body)[i]);
    }
    //console.log("arguments:");
    //console.log(arguments);
    informationretrievalIntranetService.generalPostServM(arguments)
                                       .then(function (results) {
                                         res.send(results);
                                       })
                                       .catch(function (err) {
                                         res.status(400).send(err);
                                       });
}

function generalGet(req, res) {
    var arguments = [];
    //console.log(JSON.stringify(req));
    //console.log(JSON.stringify(req.query));
    //console.log(Object.keys(req.query));
    //console.log(Object.keys(req.query).length);
    
    
    //console.log("controller.js");
    //console.log("test"+JSON.stringify(req.query));
    for (var i=0; i<Object.keys(req.query).length; i++){
        arguments.push(Object.keys(req.query)[i]);
        arguments.push(Object.values(req.query)[i]);
    }
    //console.log(JSON.stringify(arguments));
    informationretrievalIntranetService.generalGetServM(arguments)
                                       .then(function (results) {
                                         res.send(results);
                                       })
                                       .catch(function (err) {
                                         res.status(400).send(err);
                                       });
    /*Old with multiple paths
    if(Object.keys(req.query).length<=1) {
        informationretrievalIntranetService.generalGetServ(req.query.querySelector)
                                           .then(function (results) {
                                               res.send(results);
                                               })
                                           .catch(function (err) {
                                               res.status(400).send(err);
                                               });
    }
    else {
        //console.log("controller.js");
        //console.log("test"+JSON.stringify(req.query));
        for (var i=0; i<Object.keys(req.query).length; i++){
            arguments.push(Object.keys(req.query)[i]);
            arguments.push(Object.values(req.query)[i]);
        }
        //console.log(JSON.stringify(arguments));
        informationretrievalIntranetService.generalGetServM(arguments)
                                           .then(function (results) {
                                             res.send(results);
                                           })
                                           .catch(function (err) {
                                             res.status(400).send(err);
                                           });
    }
    */
}
