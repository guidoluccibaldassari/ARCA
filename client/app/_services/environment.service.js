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
var EnvironmentService = /** @class */ (function () {
    function EnvironmentService() {
        //this.initCurrentUserData();
    }
    ;
    EnvironmentService.prototype.setRicercaGlobalePerCollezioni = function (val) { this.ricercaGlobalePerCollezioni = val; };
    EnvironmentService.prototype.getRicercaGlobalePerCollezioni = function () { return this.ricercaGlobalePerCollezioni; };
    EnvironmentService.prototype.setRicercaPerNodiGeografici = function (val) { this.ricercaPerNodiGeografici = val; };
    EnvironmentService.prototype.getRicercaPerNodiGeografici = function () { return this.ricercaPerNodiGeografici; };
    EnvironmentService.prototype.setVistaIniziale = function (val) { this.vistaIniziale = val; };
    EnvironmentService.prototype.getVistaIniziale = function () { return this.vistaIniziale; };
    EnvironmentService.prototype.setRicercaInviata = function (val) { this.ricercaInviata = val; };
    EnvironmentService.prototype.getRicercaInviata = function () { return this.ricercaInviata; };
    EnvironmentService.prototype.setRicercaLocaleInviata = function (val) { this.ricercaLocaleInviata = val; };
    EnvironmentService.prototype.getRicercaLocaleInviata = function () { return this.ricercaLocaleInviata; };
    EnvironmentService.prototype.setNomeNodoGeografico = function (val) { this.nomeNodoGeografico = val; };
    EnvironmentService.prototype.getNomeNodoGeografico = function () { return this.nomeNodoGeografico; };
    EnvironmentService.prototype.setCollezioniNGReady = function (val) { this.collezioniNGReady = val; };
    EnvironmentService.prototype.getCollezioniNGReady = function () { return this.collezioniNGReady; };
    EnvironmentService.prototype.setIdNodoGeografico = function (val) { this.idNodoGeografico = val; };
    EnvironmentService.prototype.getIdNodoGeografico = function () { return this.idNodoGeografico; };
    EnvironmentService.prototype.setCollezioniNG = function (val) {
        //console.log("Init1");
        this.collezioniNG = [];
        this.collezioniNG.push(val[0]);
        //console.log(this.collezioniNG);
    };
    EnvironmentService.prototype.getCollezioniNG = function () { return this.collezioniNG; };
    //questa la usa solo nel component per ritornarmi le collezioni "benformate" a partire dai dati ritornati dalla query.
    EnvironmentService.prototype.getCollezioniNGEnabled = function () {
        //console.log("Init2");
        var enabledColl = [];
        if (this.getCollezioniNGReady() === 1) {
            //console.log(this.collezioniNG);
            var fieldValues_1 = this.collezioniNG[0];
            //console.log(fieldValues);
            var keys = Object.keys(fieldValues_1);
            var values = Object.keys(fieldValues_1).map(function (key) { return fieldValues_1[key]; });
            for (var j = 0; j < keys.length; j++) {
                //console.log(keys[j]);
                //console.log(values[j]);
                if (values[j]) {
                    enabledColl.push(keys[j]);
                }
            }
        }
        return enabledColl;
    };
    EnvironmentService.prototype.setCameraReadyRetKeysDetNG = function (val) {
        //console.log(val);
        this.cameraReadyRetKeysDetNG = [];
        this.cameraReadyRetKeysDetNG = val;
        //console.log(this.cameraReadyRetKeysDetNG);
    };
    EnvironmentService.prototype.getCameraReadyRetKeysDetNG = function () { return this.cameraReadyRetKeysDetNG; };
    EnvironmentService.prototype.setCameraReadyRetValuesDetNG = function (val) {
        //console.log(val);
        this.cameraReadyRetValuesDetNG = [];
        this.cameraReadyRetValuesDetNG = val;
        //console.log(this.cameraReadyRetValuesDetNG);
    };
    EnvironmentService.prototype.getCameraReadyRetValuesDetNG = function () { return this.cameraReadyRetValuesDetNG; };
    EnvironmentService.prototype.setCollezioneSelezionata = function (val) {
        //console.log(val);
        this.collezioneSelezionata = val;
    };
    EnvironmentService.prototype.getCollezioneSelezionata = function () { return this.collezioneSelezionata; };
    EnvironmentService.prototype.setFormNodiGeografici = function (val) { this.formNodiGeografici = val; };
    EnvironmentService.prototype.getFormNodiGeografici = function () { return this.formNodiGeografici; };
    EnvironmentService.prototype.setLinksFormNodiGeografici = function (val) { this.linksFormNodiGeografici = val; };
    EnvironmentService.prototype.getLinksFormNodiGeografici = function () { return this.linksFormNodiGeografici; };
    EnvironmentService.prototype.setQueryResultsDetailsSerializedEnv = function (val) {
        //console.log("Init1");
        this.queryResultsDetailsSerializedEnv = [];
        for (var i = 0; i < val.length; i++) {
            this.queryResultsDetailsSerializedEnv.push(val[i]);
        }
        //console.log(this.queryResultsDetailsSerializedEnv);
    };
    EnvironmentService.prototype.getQueryResultsDetailsSerializedEnv = function () { return this.queryResultsDetailsSerializedEnv; };
    EnvironmentService.prototype.setGlobalSearchQueryArgumentsEnv = function (val) {
        //console.log("Init1");
        this.globalSearchQueryArgumentsEnv = [];
        for (var i = 0; i < val.length; i++) {
            this.globalSearchQueryArgumentsEnv.push(val[i]);
        }
        //console.log(this.globalSearchQueryArgumentsEnv);
    };
    EnvironmentService.prototype.getGlobalSearchQueryArgumentsEnv = function () { return this.globalSearchQueryArgumentsEnv; };
    EnvironmentService.prototype.setQueryResultsDetailsIdEnv = function (val) {
        //console.log("Init1");
        this.queryResultsDetailsIdEnv = [];
        for (var i = 0; i < val.length; i++) {
            this.queryResultsDetailsIdEnv.push(val[i]);
        }
        //console.log(this.queryResultsDetailsIdEnv);
    };
    EnvironmentService.prototype.getQueryResultsDetailsIdEnv = function () { return this.queryResultsDetailsIdEnv; };
    EnvironmentService.prototype.setGlobalResultsElementsLineNumberEnv = function (val) { this.globalResultsElementsLineNumberEnv = val; };
    EnvironmentService.prototype.getGlobalResultsElementsLineNumberEnv = function () { return this.globalResultsElementsLineNumberEnv; };
    EnvironmentService.prototype.setGlobalResultsElementsLineNumberIndexEnv = function (val) { this.globalResultsElementsLineNumberIndexEnv = val; };
    EnvironmentService.prototype.getGlobalResultsElementsLineNumberIndexEnv = function () { return this.globalResultsElementsLineNumberIndexEnv; };
    EnvironmentService.prototype.setHyperlinkEnabledFields = function (val) { this.hyperlinkEnabledFields = val; };
    EnvironmentService.prototype.getHyperlinkEnabledFields = function () { return this.hyperlinkEnabledFields; };
    EnvironmentService.prototype.setDetailLocalCollection = function (val) { this.detailLocalCollection = val; };
    EnvironmentService.prototype.getDetailLocalCollection = function () { return this.detailLocalCollection; };
    //	initCurrentUserData(){
    //	  this.currentUserData._id='';
    //    this.currentUserData.Username='';
    //    this.currentUserData.Nome='';
    //    this.currentUserData.Cognome='';
    //    this.currentUserData.Gruppi_associati=[];
    //    this.currentUserData.Progetto='';
    //	}
    EnvironmentService.prototype.setCurrentUserData = function (val) {
        var currentUserData0 = Object();
        currentUserData0._id = JSON.parse(val)._id;
        currentUserData0.Username = JSON.parse(val).Username;
        currentUserData0.Nome = JSON.parse(val).Nome;
        currentUserData0.Cognome = JSON.parse(val).Cognome;
        //for(var i=0;i<JSON.parse(val).Gruppi_associati.length;i++){this.currentUser.Gruppi_associati.push(JSON.parse(val).Gruppi_associati[i]);};
        currentUserData0.Progetto = JSON.parse(val).Progetto;
        this.currentUserData.push(currentUserData0);
        console.log(this.currentUserData);
    };
    EnvironmentService.prototype.getCurrentUserData = function () { return this.currentUserData[0]; };
    EnvironmentService.prototype.resetCurrentUserData = function () {
        //	  Object.keys(this.currentUser).forEach(function(k){delete this.currentUser[k]})
        this.currentUserData = [];
    };
    EnvironmentService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], EnvironmentService);
    return EnvironmentService;
}());
exports.EnvironmentService = EnvironmentService;
//# sourceMappingURL=environment.service.js.map