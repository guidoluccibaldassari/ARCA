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
//JQ
var $ = require("jquery");
//Bootstrap
require("bootstrap");
//Nativi
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
//Servizi
var index_1 = require("../_services/index"); //la import del servizio
var index_2 = require("../_services/index");
var index_3 = require("../_services/index"); //la import del servizio
var index_4 = require("../_services/index"); //la import del servizio
//Componente principale
var WorkareaIntranetComponent = /** @class */ (function () {
    //Devo istanziare il lato service di angular con cui poter instaurare la comunicazione (se lo istanzia al suo interno la component)
    function WorkareaIntranetComponent(_authenticationService, _environmentService, modalService, _router, workareaService) {
        this._authenticationService = _authenticationService;
        this._environmentService = _environmentService;
        this.modalService = modalService;
        this._router = _router;
        this.workareaService = workareaService;
        //il costruttore al momento dell'invocazione pu� anche fare cose!!!
        console.log("Init Done!");
    }
    //on init di angular fa altre robe.
    WorkareaIntranetComponent.prototype.ngOnInit = function () {
        this.getSideBarLinks(this);
        this._environmentService.setRicercaGlobalePerCollezioni(0);
        this._environmentService.setRicercaPerNodiGeografici(0);
        this._environmentService.setVistaIniziale(1);
        this._environmentService.setRicercaInviata(0);
        this._environmentService.setRicercaLocaleInviata(0);
        this.currentUser = this._environmentService.getCurrentUserData();
        this.getHyperlinkEnabledFieldsFromQuery(this);
    };
    WorkareaIntranetComponent.prototype.ngAfterViewInit = function () {
        $(document).ready(function () {
            if (typeof ($.fn.popover) != 'undefined') { /*alert('Bootstrap ready!'); */
                init_page();
            }
        });
    };
    //qui dentro non è definita nessuna getSideBarLinks
    WorkareaIntranetComponent.prototype.getSideBarLinks = function (parent) {
        this.workareaService.getContent('SideBarLinks').subscribe(function (response) {
            var tmp_StringArray = [];
            var tmp_json = JSON.parse(response._body);
            for (var i = 0; i < tmp_json.length; i++) {
                tmp_StringArray.push(tmp_json[i].Titolo_Nodo);
            }
            parent.sidebarlinkssettingslocalstorage = tmp_StringArray;
        });
    };
    WorkareaIntranetComponent.prototype.getHyperlinkEnabledFieldsFromQuery = function (parent) {
        this.workareaService.getContent('ExtractHyperlinkEnabledFields').subscribe(function (response) {
            var tmp_StringArray = [];
            var tmp_json = JSON.parse(response._body);
            //console.log(JSON.stringify(tmp_json));
            for (var i = 0; i < tmp_json.length; i++) {
                //console.log(tmp_json[i]);
                tmp_StringArray.push(tmp_json[i]);
            }
            parent.hyperlinkenabledfields = tmp_StringArray;
            parent._environmentService.setHyperlinkEnabledFields(parent.hyperlinkenabledfields);
            //console.log(parent._environmentService.getHyperlinkEnabledFields());//?
            //parent._environmentService.setHyperlinkEnabledFields(tmp_StringArray);
            //qui abbiamo già settato gli array contenenti le info di applicazione che ci servono per gestire i link dinamici (per ora solo orizzontali)
        });
        //console.log(this.hyperlinkenabledfields);
        //this._environmentService.setHyperlinkEnabledFields(parent.hyperlinkenabledfields);//?
        //console.log(this._environmentService.getHyperlinkEnabledFields());//?
        //mi confondo sempre con la consecutio temporum in js - la console qui fuori ritorna sempre undefined perchè conclude prima della subscribe!!!
        //sostanzialmente prima faceva la stampa della get e poi ritornava il risultato e faceva la set.
    };
    //la funzione per richiedere al db in campi indicizzati load search page indexed field
    WorkareaIntranetComponent.prototype.loadSearchPageIF = function (parent, target) {
        this._environmentService.setRicercaGlobalePerCollezioni(1);
        this._environmentService.setRicercaPerNodiGeografici(0);
        this._environmentService.setVistaIniziale(0);
        this._environmentService.setRicercaInviata(0);
        this._environmentService.setRicercaLocaleInviata(0);
        parent.globalresultslinesnumber = 0;
        parent.globalresultselementslinenumber = 0;
        parent.queryresultsdetailsserialized = [];
        parent.queryresultsdetailsid = [];
        parent.globalsearchtarget = target;
        var ap = [];
        ap.push('ExtractSearchFields');
        ap.push('Y'); //la ricerca di default per soli campi indicizzati
        ap.push(target);
        this.workareaService.getContentM(ap).subscribe(function (response) {
            var tmp_StringArray = [];
            var tmp_json = JSON.parse(response._body);
            parent.globalsearchqueryarguments = [];
            parent.globalsearchqueryarguments.push(["GlobalCollection", tmp_json[0]]);
            for (var i = 1; i < tmp_json.length; i++) {
                tmp_StringArray.push(tmp_json[i]);
            }
            for (var i = 0; i < tmp_StringArray.length; i++) {
                parent.globalsearchqueryarguments.push([tmp_StringArray[i][0], ""]);
            }
            parent.searchindexedfieldlocalstorage = tmp_StringArray;
        });
    };
    WorkareaIntranetComponent.prototype.onSearchSubmit = function (parent) {
        this._environmentService.setRicercaInviata(1);
        var ap = [];
        for (var i = 0; i < parent.globalsearchqueryarguments.length; i++) {
            ap.push(parent.globalsearchqueryarguments[i][0]);
            ap.push(parent.globalsearchqueryarguments[i][1]);
        }
        this._environmentService.setGlobalSearchQueryArgumentsEnv(ap);
        this.workareaService.getListOfDocuments(ap).subscribe(function (response) {
            var tmp_GlobalArrayOfId = [];
            var tmp_GlobalArrayOfString = [];
            var tmp_json = JSON.parse(response._body);
            if (tmp_json == null) {
                return;
            }
            parent.globalresultslinesnumber = tmp_json.length;
            var num_elem_per_riga = 0;
            for (var key in tmp_json[0]) {
                if (key != '_id') {
                    num_elem_per_riga++;
                }
            }
            parent.globalresultselementslinenumber = num_elem_per_riga;
            parent._environmentService.setGlobalResultsElementsLineNumberEnv(parent.globalresultselementslinenumber);
            for (var i = 0; i < tmp_json.length; i++) {
                for (var key in tmp_json[i]) {
                    var value = tmp_json[i][key];
                    if (key == '_id') {
                        tmp_GlobalArrayOfId.push(value);
                    }
                }
                for (var key in tmp_json[i]) {
                    var value = tmp_json[i][key];
                    if (key != '_id') {
                        tmp_GlobalArrayOfString.push(key);
                        if (value == null) {
                            tmp_GlobalArrayOfString.push("Indefinito");
                        }
                        else {
                            tmp_GlobalArrayOfString.push(value);
                        }
                    }
                }
            }
            parent.queryresultsdetailsserialized = tmp_GlobalArrayOfString;
            parent.queryresultsdetailsid = tmp_GlobalArrayOfId;
            parent._environmentService.setQueryResultsDetailsIdEnv(parent.queryresultsdetailsid);
            parent._environmentService.setGlobalResultsElementsLineNumberIndexEnv(1);
        });
    };
    WorkareaIntranetComponent.prototype.openDetailsPage = function (parent, indice) {
        var tmpArray = [];
        for (var i = 0; i < parent._environmentService.getGlobalSearchQueryArgumentsEnv().length; i++) {
            tmpArray.push(parent._environmentService.getGlobalSearchQueryArgumentsEnv()[i]);
        }
        var tmpNumero = parent._environmentService.getGlobalResultsElementsLineNumberEnv();
        var tmpArray2 = [];
        for (var i = 0; i < parent._environmentService.getQueryResultsDetailsIdEnv().length; i++) {
            tmpArray2.push(parent._environmentService.getQueryResultsDetailsIdEnv()[i]);
        }
        //    console.log(tmpArray);
        //    console.log(tmpNumero);
        //    console.log(tmpArray2);
        var ap = [];
        ap.push(tmpArray[parent._environmentService.getGlobalResultsElementsLineNumberIndexEnv()]);
        ap.push(JSON.stringify(tmpArray2[Math.floor(indice / (tmpNumero * 2))]));
        this._router.navigate(['/redirectdvIntranet', ap]);
    };
    WorkareaIntranetComponent.prototype.openModal = function (id) {
        this.modalService.open(id);
    };
    WorkareaIntranetComponent.prototype.closeModal = function (id) {
        this.modalService.close(id);
    };
    Object.defineProperty(WorkareaIntranetComponent.prototype, "ricercaGlobalePerCollezioni", {
        get: function () {
            return this._environmentService.getRicercaGlobalePerCollezioni();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkareaIntranetComponent.prototype, "ricercaPerNodiGeografici", {
        get: function () {
            return this._environmentService.getRicercaPerNodiGeografici();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkareaIntranetComponent.prototype, "vistaIniziale", {
        get: function () {
            return this._environmentService.getVistaIniziale();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkareaIntranetComponent.prototype, "ricercaInviata", {
        get: function () {
            return this._environmentService.getRicercaInviata();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkareaIntranetComponent.prototype, "ricercaLocaleInviata", {
        get: function () {
            return this._environmentService.getRicercaLocaleInviata();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkareaIntranetComponent.prototype, "nomeNodoGeografico", {
        get: function () {
            return this._environmentService.getNomeNodoGeografico();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkareaIntranetComponent.prototype, "collezioniNG", {
        get: function () {
            return this._environmentService.getCollezioniNGEnabled();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkareaIntranetComponent.prototype, "cameraReadyRetKeysDetNG", {
        get: function () {
            return this._environmentService.getCameraReadyRetKeysDetNG();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkareaIntranetComponent.prototype, "cameraReadyRetValuesDetNG", {
        get: function () {
            return this._environmentService.getCameraReadyRetValuesDetNG();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkareaIntranetComponent.prototype, "collezioneSelezionata", {
        get: function () {
            return this._environmentService.getCollezioneSelezionata();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkareaIntranetComponent.prototype, "formNodiGeografici", {
        get: function () {
            return this._environmentService.getFormNodiGeografici();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkareaIntranetComponent.prototype, "linksFormNodiGeografici", {
        get: function () {
            return this._environmentService.getLinksFormNodiGeografici();
        },
        enumerable: true,
        configurable: true
    });
    WorkareaIntranetComponent.prototype.subFormUpdate = function (parent, arg) {
        parent._environmentService.setCollezioneSelezionata(arg);
        parent._environmentService.setFormNodiGeografici(1);
        parent._environmentService.setLinksFormNodiGeografici(0);
    };
    Object.defineProperty(WorkareaIntranetComponent.prototype, "queryResultsDetailsSerializedEnv", {
        get: function () {
            return this._environmentService.getQueryResultsDetailsSerializedEnv();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkareaIntranetComponent.prototype, "globalResultsElementsLineNumberEnv", {
        get: function () {
            return this._environmentService.getGlobalResultsElementsLineNumberEnv();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkareaIntranetComponent.prototype, "currentUserData", {
        get: function () {
            return this._environmentService.getCurrentUserData();
        },
        enumerable: true,
        configurable: true
    });
    WorkareaIntranetComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'workareaIntranet.component.html'
        })
        //OnInit generale fa roba
        ,
        __metadata("design:paramtypes", [index_1.AuthenticationService,
            index_4.EnvironmentService,
            index_2.ModalService,
            router_1.Router,
            index_3.WorkareaService])
    ], WorkareaIntranetComponent);
    return WorkareaIntranetComponent;
}());
exports.WorkareaIntranetComponent = WorkareaIntranetComponent;
//# sourceMappingURL=workareaIntranet.component.js.map