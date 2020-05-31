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
//Natives
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
//Services
var index_1 = require("../../_services/index");
var index_2 = require("../../_services/index");
//Componenti
var SubformComponent = /** @class */ (function () {
    function SubformComponent(workareaService, _router, _environmentService) {
        this.workareaService = workareaService;
        this._router = _router;
        this._environmentService = _environmentService;
    }
    SubformComponent.prototype.ngOnInit = function () {
        this.loadSearchPageIF(this, this.localCNg);
    };
    SubformComponent.prototype.loadSearchPageIF = function (parent, target) {
        //copio da sopra, del resto ho bisogno intanto di estrarre i campi query ed, almeno fino al db, è tutta roba che posso riutilizzare.
        //console.log(target);
        parent.globalresultslinesnumber = 0;
        parent.globalresultselementslinenumber = 0;
        parent.queryresultsdetailsserialized = [];
        parent.queryresultsdetailsid = [];
        parent.globalsearchtarget = target;
        var ap = [];
        ap.push('ExtractSearchFields');
        ap.push('Y'); //la ricerca di default per soli campi indicizzati
        ap.push(target);
        //in pratica la subscribe si incarica di gestire l'oggetto response (ed eventualmente credo error) dell'oggetto a cui è agganciata la quale è un observable
        //su cui, quando arriva invoca la funzione
        //per portarla fuori occorre passare un oggetto(che è un riferimento) da fuori (i.e. this) a cui agganciarla...
        this.workareaService.getContentM(ap).subscribe(function (response) {
            var tmp_StringArray = [];
            var tmp_json = JSON.parse(response._body);
            //Ho riadattato il servizio perchè estragga anche la default collection
            //pare che una riga di un solo valore e tutte le altre di due, funzioni ugualmente... .
            parent.globalsearchqueryarguments = [];
            parent.globalsearchqueryarguments.push(["GlobalCollection", tmp_json[0]]);
            for (var i = 1; i < tmp_json.length; i++) {
                tmp_StringArray.push(tmp_json[i]);
            }
            //console.log("1 :"+tmp_StringArray);
            for (var i = 0; i < tmp_StringArray.length; i++) {
                //mi preparo la struttura per il binding della query fin dai risultati, anche se poi verrà bindata vuota...
                //poi l'altro lato del binding lo implemento in template.html
                parent.globalsearchqueryarguments.push([tmp_StringArray[i][0], ""]);
            }
            parent.searchindexedfieldlocalstorage = tmp_StringArray;
            //console.log(parent.globalsearchqueryarguments);
        });
    };
    Object.defineProperty(SubformComponent.prototype, "collezioneSelezionata", {
        get: function () {
            return this._environmentService.getCollezioneSelezionata();
        },
        enumerable: true,
        configurable: true
    });
    SubformComponent.prototype.onSubSearchSubmit = function (parent) {
        console.log(parent);
        this._environmentService.setRicercaLocaleInviata(1);
        //passed arguments :P
        var ap = [];
        ap.push("GeoNodeId");
        for (var i = 0; i < parent.globalsearchqueryarguments.length; i++) {
            ap.push(parent.globalsearchqueryarguments[i][0]);
            ap.push(parent.globalsearchqueryarguments[i][1]);
        }
        ap.push('Discende_Da');
        ap.push(parent._environmentService.idNodoGeografico);
        this._environmentService.setGlobalSearchQueryArgumentsEnv(ap);
        //console.log("component.ts :"+JSON.stringify(ap));
        this.workareaService.getListOfDocuments(ap).subscribe(function (response) {
            var tmp_GlobalArrayOfId = [];
            var tmp_GlobalArrayOfString = [];
            var tmp_json = JSON.parse(response._body);
            if (tmp_json == null) {
                return;
            }
            //num_righe
            //tmp_GlobalArrayOfString.push(tmp_json.length);
            parent.globalresultslinesnumber = tmp_json.length;
            //num_elem_per_riga
            //possibile che nel 2017 con uno strumento come Angular2 debba contare gli elementi di un oggetto in questo modo??????
            var num_elem_per_riga = 0;
            for (var key in tmp_json[0]) {
                if (key != '_id') {
                    num_elem_per_riga++;
                }
            }
            //tmp_GlobalArrayOfString.push(num_elem_per_riga);
            parent.globalresultselementslinenumber = num_elem_per_riga;
            parent._environmentService.setGlobalResultsElementsLineNumberEnv(parent.globalresultselementslinenumber);
            for (var i = 0; i < tmp_json.length; i++) {
                //console.log(i);
                //qui dentro ho un oggetto, non un array, non ha senso trattarlo come tale
                //nemmeno il loop js standard sulle componenti dell'oggetto qui ha senso [grrrrrr!!!]
                //occorre ciclare in typescript...
                //id_di ciascuna riga, coppie chiavi valore
                //per ogni riga prima mi assicuro di estrarre l'id
                for (var key in tmp_json[i]) {
                    var value = tmp_json[i][key];
                    if (key == '_id') {
                        tmp_GlobalArrayOfId.push(value);
                    }
                }
                //poi le altre coppie chiave valore
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
                    //tmp_GlobalArrayObj.push({tmp_ObjId,tmp_ObjArrayK,tmp_ObjArrayV});
                }
                //almeno gli array, anche se di oggetti si comportano come si deve.
                //ma tanto ad Angular2 non piacciono se non sono di stringhe per cui va tutto scomposto... .
                //console.log(tmp_ObjArrayK+" - "+tmp_ObjArrayV);
                //let qs = new QueryResultsDetailsStorage(tmp_ObjId,tmp_ObjArrayK,tmp_ObjArrayV);
                //nuovo corso - le parti precedenti le ho commentate perchè in fondo funzionavano (anche se non per qullo che serviva a me )per cui almeno come versionamento le conservo come promemoria.
                //l'impacchettamento funziona a dovere , in pratica mi sono assicurato che fossero ordinati...
                //ma non ha senso/utilizzo in un contesto di visualizzazione... per cui? devo davvero ricorrere ad una strutturazione dei contenuti che si appoggia
                //esclusivamente alla serializzazione e all'indicizzazione sequenziale? pare di si...
            }
            parent.queryresultsdetailsserialized = [];
            for (i = 0; i < tmp_GlobalArrayOfString.length; i++) {
                parent.queryresultsdetailsserialized.push(tmp_GlobalArrayOfString[i]);
            }
            parent._environmentService.setQueryResultsDetailsSerializedEnv(parent.queryresultsdetailsserialized);
            parent.queryresultsdetailsid = tmp_GlobalArrayOfId;
            parent._environmentService.setQueryResultsDetailsIdEnv(parent.queryresultsdetailsid);
            parent._environmentService.setGlobalResultsElementsLineNumberIndexEnv(2);
            //console.log(parent.queryresultsdetailsserialized);
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], SubformComponent.prototype, "localCNg", void 0);
    SubformComponent = __decorate([
        core_1.Component({
            selector: 'subformComponent',
            template: "\n<form #f=\"ngForm\" (ngSubmit)=\"onSubSearchSubmit(this);\" method=\"POST\">\n\t<div *ngFor=\"let formvalue of searchindexedfieldlocalstorage; index as i\">\n\t\t<p></p>\n\t\t<div title={{formvalue[1]}}>{{formvalue[0].replace(\"_\",\" \")}} : <input type=\"text\" [(ngModel)]=\"globalsearchqueryarguments[i+1][1]\" name=\"globalsearchqueryarguments[i+1][0]\"></div>\n\t</div>\n\t<p></p>\n\t<p><button type=\"submit\">Search</button></p>\n</form>\n"
        }),
        __metadata("design:paramtypes", [index_1.WorkareaService, router_1.Router, index_2.EnvironmentService])
    ], SubformComponent);
    return SubformComponent;
}());
exports.SubformComponent = SubformComponent;
//# sourceMappingURL=subform.component.js.map