//Il sistema rende dell'html con dentro già dei link/costrutti per estrarre dinamicamente il contenuto richiesto dal click che chiameranno, ricorsivamente, altre rotte.
var express = require('express');
var informationretrievalRouter = express.Router();
var informationretrievalService = require('services/informationretrieval.service');

// routes
//qui ricevo per la get di workarea
//associo la funzione generalGet del service corrispondente che viene quindi direttamente ridiretta!

informationretrievalRouter.post('/',generalPost);
informationretrievalRouter.get('/',generalGet);

module.exports = informationretrievalRouter;

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
	informationretrievalService.generalPostServM(arguments)
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
    if(Object.keys(req.query).length<=1) {
		informationretrievalService.generalGetServ(req.query.querySelector)
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
		informationretrievalService.generalGetServM(arguments)
			.then(function (results) {
			res.send(results);
			})
		.catch(function (err) {
			res.status(400).send(err);
			});
	}
}
