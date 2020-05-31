"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
//Nativi
var core_1 = require("@angular/core");
//Se non importi URLSearchParams sei un fesso e perdi 2 giorni...
var http_1 = require("@angular/http");
//Modelli
//import { User } from '../_models/index';
//Il modello per ora l'ho importato qui e non credo serva anche nel component
//import { SideBarLinks } from '../_models/index';
//forse non serve proprio! la response non deve essere definita!
//infatti, non serve :P
//Servizi
//import { EnvironmentService } from './index'; //la import del servizio
var WorkareaService = /** @class */ (function () {
    function WorkareaService(http
    //   ,private _environmentService: EnvironmentService
    ) {
        this.http = http;
    }
    //La getSideBarLinks è una funzione che non prende parametri, ma è nel suo nome che è descritta il suo stesso scopo
    //fa una get alla /workarea passando una stringa fissa (piuttosto che fare una funzione generica che prende dei parametri e poi smista il tutto in base a questi)
    //Maggior chiarezza implementativa e poco spazio ad errori.
    //io qui invoco una get della route workarea del server passando come parametro una stringa fissa 'SideBarLinks'
    //"SideBarLinks"
    //Devo invece fare una get parametrizzata mi sa, che prende un qualche argomento... Il principio però è lo stesso
    WorkareaService.prototype.getContent = function (_parametroQuery) {
        var user;
        //    let user = new User();
        //console.log(_parametroQuery);
        var params = new http_1.URLSearchParams();
        //Il seguente estrattore funziona lato client nel browser
        //console.log(params.get('querySelector'));
        //lato express vedi file apposito
        if (localStorage.getItem('currentUser')) {
            //      user = this._environmentService.getCurrentUserData();
            user = JSON.parse(localStorage.getItem('currentUser'));
            params.set('numberOfGroups', user.Gruppi_associati.length);
            for (var i = 0; i < user.Gruppi_associati.length; i++) {
                params.set('g' + i, user.Gruppi_associati[i]);
            }
            params.set('querySelector', _parametroQuery);
            return this.http.get('/workareaIntranet', { params: params }).map(function (response) { return response; }); //.json()); //pare sia già un json... . Riparsarlo genera errore.
        }
        else {
            params.set('querySelector', _parametroQuery);
            return this.http.get('/workarea', { params: params }).map(function (response) { return response; }); //.json()); //pare sia già un json... . Riparsarlo genera errore.
        }
    };
    WorkareaService.prototype.getContentM = function (_parametriQuery) {
        var user;
        //    let user = new User();
        //console.log(_parametriQuery);
        var params = new http_1.URLSearchParams();
        //Il seguente estrattore funziona lato client nel browser
        //console.log(params.get('querySelector'));
        //lato express vedi file apposito
        //in pratica ritorna al chiamante (component) un observable, che di là è stato sottoscritto (subscribe)
        //il map è fondamentale per mappare un oggetto di tipo response e con la fat arrow invocare una funzione anonima response...
        //ufff... non è proprio banale...
        //i concetti di massima ci sono la struttura sottostante invece mi è oscura, ma conoscendo js sara' in gran parte un gioco di callbacks ben organizzate.
        if (localStorage.getItem('currentUser')) {
            //    user = this._environmentService.getCurrentUserData();
            user = JSON.parse(localStorage.getItem('currentUser'));
            params.set('numberOfGroups', user.Gruppi_associati.length);
            for (var i = 0; i < user.Gruppi_associati.length; i++) {
                params.set('g' + i, user.Gruppi_associati[i]);
            }
            params.set('querySelector', _parametriQuery[0]);
            for (var i = 1; i <= _parametriQuery.length; i++) {
                params.set('argument' + i, _parametriQuery[i]);
            }
            return this.http.get('/workareaIntranet', { params: params }).map(function (response) { return response; }); //.json()); //pare sia già un json... . Riparsarlo genera errore.
        }
        else {
            params.set('querySelector', _parametriQuery[0]);
            for (var i = 1; i <= _parametriQuery.length; i++) {
                params.set('argument' + i, _parametriQuery[i]);
            }
            return this.http.get('/workarea', { params: params }).map(function (response) { return response; }); //.json()); //pare sia già un json... . Riparsarlo genera errore.
        }
    };
    /*Entrambi i seguenti vanno in workarea perchè riguardano la visualizzazione della pagina area di lavoro anche se alla fine effettuano query sui dati*/
    WorkareaService.prototype.getListOfDocuments = function (_parametriQuery) {
        var user;
        //    let user = new User();
        //console.log("service.ts: "+_parametriQuery);
        var body = [];
        if (localStorage.getItem('currentUser')) {
            var internal_pq = [];
            var start;
            //    user = this._environmentService.getCurrentUserData();
            user = JSON.parse(localStorage.getItem('currentUser'));
            internal_pq.push('numberOfGroups');
            internal_pq.push(user.Gruppi_associati.length);
            body.push('numberOfGroups');
            body.push(user.Gruppi_associati.length);
            for (var i = 0; i < user.Gruppi_associati.length; i++) {
                internal_pq.push('g' + i);
                internal_pq.push(user.Gruppi_associati[i]);
                body.push('g' + i);
                body.push(user.Gruppi_associati[i]);
            }
            start = 0;
            if (_parametriQuery[0] === "GeoNodeId") { //MEH!
                internal_pq.push(_parametriQuery[start]);
                body.push(_parametriQuery[start]);
                start = 1;
            }
            for (var i = start; i < _parametriQuery.length; i += 2) {
                //        console.log("Brutto loop: " +(_parametriQuery[i]+" : "+_parametriQuery[i+1] ));
                internal_pq.push(_parametriQuery[i]);
                internal_pq.push(_parametriQuery[i + 1]);
                body.push(_parametriQuery[i]);
                body.push(_parametriQuery[i + 1]);
            }
            return this.http.post('/informationretrievalIntranet', internal_pq).map(function (response) { return response; });
        }
        else {
            for (var i = 0; i < _parametriQuery.length; i += 2) {
                //        console.log("Brutto loop: " +(_parametriQuery[i]+" : "+_parametriQuery[i+1] ));
                body.push(_parametriQuery[i]);
                body.push(_parametriQuery[i + 1]);
            }
            return this.http.post('/informationretrieval', _parametriQuery).map(function (response) { return response; });
        }
    };
    WorkareaService.prototype.getContentNG = function (_parametroQuery) {
        var user;
        //    let user = new User();
        //console.log(_parametroQuery);
        var params = new http_1.URLSearchParams();
        //Il seguente estrattore funziona lato client nel browser
        //console.log(params.get('querySelector'));
        //lato express vedi file apposito
        if (localStorage.getItem('currentUser')) {
            //    user = this._environmentService.getCurrentUserData();
            user = JSON.parse(localStorage.getItem('currentUser'));
            params.set('numberOfGroups', user.Gruppi_associati.length);
            for (var i = 0; i < user.Gruppi_associati.length; i++) {
                params.set('g' + i, user.Gruppi_associati[i]);
            }
            params.set('querySelector', _parametroQuery);
            return this.http.get('/informationretrievalIntranet', { params: params }).map(function (response) { return response; }); //.json()); //pare sia già un json... . Riparsarlo genera errore.
        }
        else {
            params.set('querySelector', _parametroQuery);
            return this.http.get('/informationretrieval', { params: params }).map(function (response) { return response; }); //.json()); //pare sia già un json... . Riparsarlo genera errore.
        }
    };
    WorkareaService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http
            //   ,private _environmentService: EnvironmentService
        ])
    ], WorkareaService);
    return WorkareaService;
}());
exports.WorkareaService = WorkareaService;
//# sourceMappingURL=workarea.service.js.map