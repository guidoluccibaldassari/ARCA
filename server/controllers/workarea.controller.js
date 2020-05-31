//Il sistema rende dell'html con dentro già dei link/costrutti per estrarre dinamicamente il contenuto richiesto dal click che chiameranno, ricorsivamente, altre rotte.
var config = require('../configApp_ro.json');
var express = require('express');
var workareaRouter = express.Router();
var workareaService = require('services/workarea.service');

// routes
//qui ricevo per la get di workarea
//associo la funzione generalGet del service corrispondente che viene quindi direttamente ridiretta!

workareaRouter.get('/',generalGet);

module.exports = workareaRouter;

function generalGet(req, res) {
  var arguments = [];
    //console.log(req);
    //console.log(Object.keys(req.query).length);
    if(Object.keys(req.query).length <= 1) {
      //invoco il service con promises
      //il queryselector è la chiave che ho definito nel momento di creazione dei parametri al momento della http request sul client(service.ts)
      workareaService.generalGetServ(req.query.querySelector)
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
	  workareaService.generalGetServM(arguments)
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
	}
}
