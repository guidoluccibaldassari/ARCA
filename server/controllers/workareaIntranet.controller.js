//OLD con redirect al servizio unificato
/*
//Questa rotta è solo un duplicato al fine di suddividere a livello di routing in routes completamente isolate
var express = require('express');
var workareaIntranetRouter = express.Router();
var workareaControllerRO = require('./workarea.controller');
//Ma poi rimanda all'originale
workareaIntranetRouter.use('/', workareaControllerRO);
//Eventualmente qui arricchisco con richieste RW direttamente al servizio oppure sempre con inoltro al controller. Oppure mantengo tutto trasparente e gestisco a livello di query. 
module.exports = workareaIntranetRouter;
*/

var express = require('express');
var workareaIntranetRouter = express.Router();
var workareaIntranetService = require('services/workareaIntranet.service');

workareaIntranetRouter.get('/',generalGet);

module.exports = workareaIntranetRouter;

function generalGet(req, res) {
  var arguments = [];
  //console.log(req);
  //console.log(Object.keys(req.query).length);
  for (var i=0; i<Object.keys(req.query).length; i++)
  {
    arguments.push(Object.values(req.query)[i]);
  }
  //console.log(JSON.stringify(arguments));
  workareaIntranetService.generalGetServM(arguments)
                         .then(
                           function (results)
                           {
                             res.send(results);
                           }
                         )
                         .catch(
                           function (err)
                           {
                             res.status(400).send(err);
                           }
                         );
    /*Old with multiple paths
    if(Object.keys(req.query).length <= 1) {
      //invoco il service con promises
      //il queryselector è la chiave che ho definito nel momento di creazione dei parametri al momento della http request sul client(service.ts)
      workareaIntranetService.generalGetServ(req.query.querySelector) 
                             .then(
                               function (results)
                               {
                                 //se ho dati allora mando direttamente results (l'argomento riempito dentro la function invocata. Olè!)
                                 //res.sendStatus(200);
                                 res.send(results);
                               }
                             )
                             .catch(
                                function (err)
                                {
                                  res.status(400).send(err);
                                }
                              );
    }
    else {
      //console.log("controller.js");
      //console.log("test"+JSON.stringify(req.query));
      for (var i=0; i<Object.keys(req.query).length; i++)
      {
        arguments.push(Object.values(req.query)[i]);
      }
      //console.log(JSON.stringify(arguments));
      workareaIntranetService.generalGetServM(arguments)
                             .then(
                               function (results)
                               {
                                 res.send(results);
                               }
                             )
                             .catch(
                               function (err)
                               {
                                 res.status(400).send(err);
                               }
                             );
    }*/
}