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
var router_1 = require("@angular/router");
//3dParty
//import {PdfViewerComponent} from 'ng2-pdf-viewer';
//X3Dom
//import * from 'x3dom';
//Servizi
var index_1 = require("../_services/index");
var index_2 = require("../_services/index"); //la import del servizio
var index_3 = require("../_services/index");
//Componente
var DetailviewerIntranetRWComponent = /** @class */ (function () {
    function DetailviewerIntranetRWComponent(route, detailviewerService, _environmentService, modalService
    //   ,private modaldvService: ModaldocumentviewerService
    , router) {
        var _this = this;
        this.route = route;
        this.detailviewerService = detailviewerService;
        this._environmentService = _environmentService;
        this.modalService = modalService;
        this.router = router;
        route.params.subscribe(function (params) {
            _this.globalParams = [];
            //      var ap=[];
            //      ap.push(params[0]);
            _this.globalParams.push(params[0]);
            //      ap.push(params[1]);
            _this.globalParams.push(params[1]);
            //      console.log(this.globalParams);
            _this.retriveDetails(_this, _this.globalParams);
        });
    }
    DetailviewerIntranetRWComponent.prototype.importX3d = function () {
        System.import('x3dom').then(function () {
            console.log('loaded x3d');
        }).catch(function (e) {
            console.warn(e);
        });
    };
    DetailviewerIntranetRWComponent.prototype.ngOnInit = function () {
        this.localRetRows = [];
        this.childrenCollections = [];
        this.childrenList = [];
        this.parentsCollections = [];
        this.parentsList = [];
        this.hyperlinkenabledfields = this._environmentService.getHyperlinkEnabledFields();
    };
    DetailviewerIntranetRWComponent.prototype.retriveDetails = function (parent, ap) {
        parent._environmentService.setDetailLocalCollection(ap[0]);
        this.detailviewerService.getDetailsFromOID(ap).subscribe(function (response) {
            var tmp_json = (response._body);
            if (tmp_json == null) {
                return;
            }
            var processed_json = JSON.parse(tmp_json);
            for (var i = 0; i < processed_json.length; i++) {
                var tmp_RowsArray = [];
                for (var key in processed_json[i]) {
                    var tmp_Row = {
                        key: "",
                        type: 4,
                        values: [""],
                        links: [{}]
                    };
                    tmp_Row.key = key;
                    var value_1 = processed_json[i][key];
                    if ((key == '_id') || (key == 'Discende_Da')) {
                        //puri
                        tmp_Row.type = 4;
                        tmp_Row.values = value_1;
                        tmp_Row.links = [];
                    }
                    else if ((value_1 == null) || (value_1 === ' ') || (value_1 === '')) {
                        continue;
                    }
                    else if (key == 'Pubblicato') {
                        if (typeof (value_1) === 'undefined')
                            value_1 = false;
                    }
                    else if (key == 'Path') {
                        //path
                        tmp_Row.type = 4;
                        tmp_Row.values = value_1;
                        tmp_Row.links = [];
                        if (((value_1.substr(value_1.length - 5).split('.').pop()) == 'X3D') || ((value_1.substr(value_1.length - 5).split('.').pop()) == 'x3d')) {
                            parent.importX3d();
                            if (window['x3dom'] != undefined) {
                                window['x3dom'].reload();
                                console.log('loaded x3d');
                            }
                        }
                    }
                    else if (typeof (value_1) === 'object') {
                        //link
                        if (value_1[3] == 'hyperlinkReady') {
                            var arr_link = [];
                            tmp_Row.values = value_1[2];
                            arr_link.push(value_1[0]);
                            arr_link.push(value_1[1]);
                            tmp_Row.links = arr_link;
                            tmp_Row.type = 1;
                        }
                        //misto e/o di stringhe semplici
                        else {
                            var arr_mixV = [];
                            var arr_mixL = [];
                            tmp_Row.type = 2;
                            for (var j = 0; j < value_1.length; j++) {
                                if (typeof (value_1[j]) === 'string') {
                                    arr_mixV.push(value_1[j]);
                                    arr_mixL.push('string');
                                }
                                else {
                                    //?
                                    var arr_link = [];
                                    arr_mixV.push(value_1[j][2]);
                                    arr_link.push(value_1[j][0]);
                                    arr_link.push(value_1[j][1]);
                                    arr_mixL.push(arr_link);
                                }
                                tmp_Row.values = arr_mixV;
                                tmp_Row.links = arr_mixL;
                            }
                        }
                    }
                    //valore semplice:stringa
                    else if (typeof (value_1) === 'string') {
                        tmp_Row.type = 0;
                        tmp_Row.values[0] = value_1;
                        tmp_Row.links = ['string'];
                    }
                    else if (typeof (value_1) === 'number') {
                        tmp_Row.type = 4;
                        tmp_Row.values[0] = '' + value_1;
                        tmp_Row.links = ['number'];
                    }
                    tmp_RowsArray.push(tmp_Row);
                }
                /*
                for (var k=0;k<tmp_RowsArray.length;k++){
                  console.log(tmp_RowsArray[k]);
                }
                */
            }
            parent.localRetRows = tmp_RowsArray;
            //Fine fase reperimento dettagli
            //--------------------------------------------------------------------------------------------------
            //Ottenuti i dettagli da qui lancio la query per i figli
            //N.B. Non è garantita la sequenzialità mi sa prendendo i parametri dal ritorno o  forse si dato che comunque siamo dentro alla prima subscribe---------------------------------------------------------------------------------------------
            //        parent.route.params.subscribe(
            //          (params: any) => {
            var ap_c = [];
            ap_c.push(parent.globalParams[0]);
            //        ap_c.push(parent.globalParams[1]);
            for (var j = 0; j < parent.localRetRows.length; j++) {
                if (parent.localRetRows[j].key == 'Errore') {
                    return;
                }
            }
            for (var j = 0; j < parent.localRetRows.length; j++) {
                if (parent.localRetRows[j].key == '_id') {
                    var value = parent.localRetRows[j].values;
                    ap_c.push(value);
                }
            }
            ap_c.push('queryDbForChildren');
            parent.retriveChildrenData(parent, ap_c);
            //          }
            //        );
            //--------------------------------------------------------------------------------------------------
            //Da qui invece lancio la query per il genitore
            //GROSSO PROBLEMA CON CHIAMATE IN SUCCESSIONE IN SU E I GIU - Soluzione: Flatmap con la prima subscribe?
            //SOLUZIONE: estrarre i parametri in ingresso via URL una volta sola all'inizio e salvarli nell'env all'arrivo sulla pagina e minimizzare le subscribe (parent.route.params.subscribe serve a leggere i parametri in url)
            //        parent.route.params.subscribe(
            //          (params: any) => {
            var ap_p = [];
            ap_p.push(parent.globalParams[0]);
            for (var j = 0; j < parent.localRetRows.length; j++) {
                if (parent.localRetRows[j].key == 'Discende_Da') {
                    var value = parent.localRetRows[j].values;
                    ap_p.push(value);
                }
            }
            ap_p.push('queryDbForParentInfo');
            if (ap_p[1] == 'root') {
                parent.parentsCollections = [];
                parent.parentsList = [];
                return;
            }
            parent.retriveParentData(parent, ap_p);
            //          }
            //        );
        });
    };
    /*
    Al momento del mio arrivo su una pagina di dettaglio io oltre ad estrarre i dettagli veri e propri, ho il mio id che uso per cercare lungo il db tutti i miei discendenti, e mi immagazzino:
    -collezione
    -nome
    -id
    id lo uso per impostare nuova navigazione.
    */
    DetailviewerIntranetRWComponent.prototype.retriveChildrenData = function (parent, ap) {
        this.detailviewerService.getAllChildrenDataFromAllCollUsingOID(ap).subscribe(function (response) {
            var tmp_json = (response._body);
            if (tmp_json == null) {
                return;
            }
            var vettore_collezioni = [];
            var vettore_di_vettori_di_oggetti = [];
            var processed_json = JSON.parse(tmp_json);
            for (var i = 0; i < processed_json.length; i++) {
                if (typeof (processed_json[i]['Collection']) !== 'undefined') {
                    vettore_collezioni.push(processed_json[i]['Collection']);
                }
                else if (processed_json[i].length !== 0) {
                    vettore_di_vettori_di_oggetti.push(processed_json[i]);
                }
            }
            parent.childrenCollections = vettore_collezioni;
            parent.childrenList = vettore_di_vettori_di_oggetti;
        });
    };
    DetailviewerIntranetRWComponent.prototype.retriveParentData = function (parent, ap) {
        this.detailviewerService.getParentDataUsingOID(ap).subscribe(function (response) {
            var tmp_json_p;
            tmp_json_p = (response._body);
            if (tmp_json_p == null) {
                return;
            }
            var vettore_collezioni = [];
            var vettore_di_vettori_di_oggetti = [];
            var processed_json_p;
            processed_json_p = JSON.parse(tmp_json_p);
            for (var i = 0; i < processed_json_p.length; i++) {
                if (typeof (processed_json_p[i]['Collection']) !== 'undefined') {
                    vettore_collezioni.push(processed_json_p[i]['Collection']);
                }
                else if (processed_json_p[i].length !== 0) {
                    vettore_di_vettori_di_oggetti.push(processed_json_p[i]);
                }
            }
            parent.parentsCollections = vettore_collezioni;
            parent.parentsList = vettore_di_vettori_di_oggetti;
        });
    };
    DetailviewerIntranetRWComponent.prototype.openDetailsPage = function (coll, id) {
        var ap = [];
        ap.push(coll);
        ap.push(id);
        //console.log(ap);
        this.router.navigate(['/redirectdvIntranet', ap]);
    };
    DetailviewerIntranetRWComponent.prototype.openModalDocument = function () {
        this.openModal('documentViewer');
    };
    DetailviewerIntranetRWComponent.prototype.openModal = function (id) {
        this.modalService.open(id);
    };
    DetailviewerIntranetRWComponent.prototype.closeModal = function (id) {
        this.modalService.close(id);
    };
    DetailviewerIntranetRWComponent.prototype.modSubmit = function (obj, j) {
        //localRetRows
        var ap = [];
        ap.push('updSingleProp');
        ap.push(this.globalParams[0]);
        ap.push(this.globalParams[1]);
        ap.push(obj.localRetRows[j].key);
        ap.push(obj.localRetRows[j].values);
        //    this.detailviewerService.updSingleProp(ap).subscribe(
        //      function(response) {
        //        console.log(response);
        //      }
        //    );
        console.log(ap);
    };
    DetailviewerIntranetRWComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'detailviewerIntranetRW.component.html'
        })
        //OnInit generale fa roba
        ,
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            index_1.DetailviewerService,
            index_2.EnvironmentService,
            index_3.ModalService
            //   ,private modaldvService: ModaldocumentviewerService
            ,
            router_1.Router])
    ], DetailviewerIntranetRWComponent);
    return DetailviewerIntranetRWComponent;
}());
exports.DetailviewerIntranetRWComponent = DetailviewerIntranetRWComponent;
//# sourceMappingURL=detailviewerIntranetRW.component.js.map