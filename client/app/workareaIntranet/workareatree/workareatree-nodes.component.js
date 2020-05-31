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
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var index_1 = require("../../_services/index");
var index_2 = require("../../_services/index");
var index_3 = require("../../_services/index"); //la import del servizio
//Componenti
var Nodes = /** @class */ (function () {
    function Nodes(workareaService, detailviewerService, _router, _environmentService) {
        this.workareaService = workareaService;
        this.detailviewerService = detailviewerService;
        this._router = _router;
        this._environmentService = _environmentService;
    }
    Nodes.prototype.ngOnInit = function () {
        //ennesimo tentativo di forzare un reload
        //this.seq=this._environmentService.sequence;
    };
    Nodes.prototype.openNGLink = function (parent) {
        parent._environmentService.setFormNodiGeografici(0);
        parent._environmentService.setCollezioniNGReady(0);
        parent._environmentService.setRicercaGlobalePerCollezioni(0);
        parent._environmentService.setRicercaPerNodiGeografici(1);
        parent._environmentService.setVistaIniziale(0);
        parent._environmentService.setRicercaInviata(0);
        parent._environmentService.setNomeNodoGeografico(parent.item.label);
        parent._environmentService.setIdNodoGeografico(parent.item.details._id);
        parent._environmentService.setLinksFormNodiGeografici(1);
        //Se ho cliccato qui mi interessano i dettagli del nodo geografico, per cui la collezione sarà sempre e solo geographicNodes
        //Il nodo però è sempre di tipo geografico, per cui posso fare la query direttamente verso il servizio dei dettagli con lo scopo di estrarre informazioni!
        //estraggo i dettagli del nodo geografico:
        var ap = [];
        ap.push('geographicNodes');
        //console.log(this.item.details);
        ap.push(parent.item.details._id);
        parent.detailviewerService.getDetailsFromOID(ap).subscribe(function (response) {
            var tmp_json = (response._body);
            if (tmp_json == null) {
                return;
            }
            var processed_json = JSON.parse(tmp_json);
            for (var i = 0; i < processed_json.length; i++) {
                var tmp_ObjArrayK = [];
                var tmp_ObjArrayV = [];
                var tmp_ObjArrayK_cr = [];
                var tmp_ObjArrayV_cr = [];
                for (var key in processed_json[i]) {
                    var value = processed_json[i][key];
                    tmp_ObjArrayK.push(JSON.stringify(key));
                    tmp_ObjArrayV.push(JSON.stringify(value));
                    if (key == "_id") {
                        continue;
                    }
                    if (key == "Accesso") {
                        continue;
                    }
                    if (key == "Logical_Delete") {
                        continue;
                    }
                    /*if (value == null) {
                      tmp_ObjArrayK_cr.push(JSON.stringify(key));
                      tmp_ObjArrayV_cr.push("Nessuna informazione da visualizzare.");
                      continue;
                    }*/
                    if ((value == null) || (value === '')) {
                        continue;
                    }
                    tmp_ObjArrayK_cr.push(JSON.stringify(key));
                    tmp_ObjArrayV_cr.push(JSON.stringify(value));
                }
            }
            parent._environmentService.setCameraReadyRetKeysDetNG(tmp_ObjArrayK_cr);
            parent._environmentService.setCameraReadyRetValuesDetNG(tmp_ObjArrayV_cr);
        });
        //a questo punto la query verso i settings:
        //devo recuperare le collezioni per cui il nodo geografico è abilitato e su cui voglio offrire la ricerca
        var ap = [];
        ap.push('ExtractNGCollections');
        //console.log(this.item.details);
        ap.push('Nome_Tipologia_Nodo');
        ap.push(this.item.details.Nome_Tipologia_Nodo); //la ricerca lato server sarà quella "di default" per soli campi indicizzati
        parent.workareaService.getContentM(ap).subscribe(function (response) {
            var tmp_StringArray = [];
            var tmp_json = JSON.parse(response._body);
            //console.log(JSON.stringify(tmp_json));
            parent._environmentService.setCollezioniNG(tmp_json);
            parent._environmentService.setCollezioniNGReady(1);
        });
        //Riflessione
        /*Quando farò la ricerca, dovrò passarmi l'id del nodo appena cliccato per verificare la discendenza
         *Voglio davvero ricorrere a quell'abominio del passaggio di valore per ambiente(vedi sopra)?*/
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], Nodes.prototype, "item", void 0);
    Nodes = __decorate([
        core_1.Component({
            inputs: ['item'],
            selector: 'nodes',
            template: "\n<li>\n\t<a href=\"javascript:void(0);\" (click)=\"openNGLink(this)\">{{item.label | UnderscoreToBlankSpaces}}</a>\n  \t<ul *ngIf=\"item.subs\" class=\"Sottomenu\">\n  \t    <ng-template ngFor let-subitem [ngForOf]=\"item.subs\">\n  \t\t\t<nodes [item]=\"subitem\"></nodes>\n  \t\t</ng-template>\n  \t</ul>\n</li>\n"
        }),
        __metadata("design:paramtypes", [index_1.WorkareaService, index_3.DetailviewerService, router_1.Router, index_2.EnvironmentService])
    ], Nodes);
    return Nodes;
}());
exports.Nodes = Nodes;
//# sourceMappingURL=workareatree-nodes.component.js.map