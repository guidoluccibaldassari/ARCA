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
var http_1 = require("@angular/http");
//Modelli
//import { User } from '../_models/index';
//Servizi
//import { EnvironmentService } from './index'; //la import del servizio
var DetailviewerService = /** @class */ (function () {
    function DetailviewerService(http
    //   ,private _environmentService: EnvironmentService
    ) {
        this.http = http;
    }
    DetailviewerService.prototype.getDetailsFromOID = function (_parametriQuery) {
        var user;
        //    let user = new User();
        var params = new http_1.URLSearchParams();
        //    console.log(params.get('collection'));
        //    console.log(params.get('objectId'));
        if (localStorage.getItem('currentUser')) {
            //    user = this._environmentService.getCurrentUserData();
            user = JSON.parse(localStorage.getItem('currentUser'));
            params.set('numberOfGroups', user.Gruppi_associati.length);
            for (var i = 0; i < user.Gruppi_associati.length; i++) {
                params.set('g' + i, user.Gruppi_associati[i]);
            }
            params.set('collection', _parametriQuery[0]);
            params.set('objectId', _parametriQuery[1]);
            return this.http.get('/informationretrievalIntranet', { params: params }).map(function (response) { return response; });
        }
        else {
            params.set('collection', _parametriQuery[0]);
            params.set('objectId', _parametriQuery[1]);
            return this.http.get('/informationretrieval', { params: params }).map(function (response) { return response; });
        }
    };
    DetailviewerService.prototype.getAllChildrenDataFromAllCollUsingOID = function (_parametriQuery) {
        var user;
        //    let user = new User();
        var params = new http_1.URLSearchParams();
        //    console.log(params.get('collection'));
        //    console.log(params.get('objectId'));
        //    console.log(params.get('selector'));
        if (localStorage.getItem('currentUser')) {
            //    user = this._environmentService.getCurrentUserData();
            user = JSON.parse(localStorage.getItem('currentUser'));
            params.set('numberOfGroups', user.Gruppi_associati.length);
            for (var i = 0; i < user.Gruppi_associati.length; i++) {
                params.set('g' + i, user.Gruppi_associati[i]);
            }
            params.set('collection', _parametriQuery[0]);
            params.set('objectId', _parametriQuery[1]);
            params.set('selector', _parametriQuery[2]);
            return this.http.get('/informationretrievalIntranet', { params: params }).map(function (response) { return response; });
        }
        else {
            params.set('collection', _parametriQuery[0]);
            params.set('objectId', _parametriQuery[1]);
            params.set('selector', _parametriQuery[2]);
            return this.http.get('/informationretrieval', { params: params }).map(function (response) { return response; });
        }
    };
    DetailviewerService.prototype.getParentDataUsingOID = function (_parametriQuery) {
        var user;
        //    let user = new User();
        var params = new http_1.URLSearchParams();
        //    console.log(params.get('collection'));
        //    console.log(params.get('objectId'));
        //    console.log(params.get('selector'));
        if (localStorage.getItem('currentUser')) {
            //    user = this._environmentService.getCurrentUserData();
            user = JSON.parse(localStorage.getItem('currentUser'));
            params.set('numberOfGroups', user.Gruppi_associati.length);
            for (var i = 0; i < user.Gruppi_associati.length; i++) {
                params.set('g' + i, user.Gruppi_associati[i]);
            }
            params.set('collection', _parametriQuery[0]);
            params.set('objectId', _parametriQuery[1]);
            params.set('selector', _parametriQuery[2]);
            return this.http.get('/informationretrievalIntranet', { params: params }).map(function (response) { return response; });
        }
        else {
            params.set('collection', _parametriQuery[0]);
            params.set('objectId', _parametriQuery[1]);
            params.set('selector', _parametriQuery[2]);
            return this.http.get('/informationretrieval', { params: params }).map(function (response) { return response; });
        }
    };
    DetailviewerService.prototype.updSingleProp = function (_parametriQuery) {
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
            //      if(_parametriQuery[0]==="updSingleProp"){ //MEH!
            //        internal_pq.push(_parametriQuery[start]);
            //        body.push(_parametriQuery[start]);
            //        start=1;
            //      }
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
            return 'Error: access denied'; //non dovrebbe mai succedere.
        }
    };
    DetailviewerService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http
            //   ,private _environmentService: EnvironmentService
        ])
    ], DetailviewerService);
    return DetailviewerService;
}());
exports.DetailviewerService = DetailviewerService;
//# sourceMappingURL=detailviewer.service.js.map