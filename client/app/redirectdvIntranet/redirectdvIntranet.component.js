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
//Servizi
var index_1 = require("../_services/index");
var index_2 = require("../_services/index"); //la import del servizio
//Componente
var RedirectDVIntranetComponent = /** @class */ (function () {
    function RedirectDVIntranetComponent(detailviewerService, router, route, _environmentService) {
        var _this = this;
        this.detailviewerService = detailviewerService;
        this.router = router;
        this.route = route;
        this._environmentService = _environmentService;
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
    RedirectDVIntranetComponent.prototype.ngOnInit = function () {
    };
    RedirectDVIntranetComponent.prototype.retriveDetails = function (parent, ap) {
        parent._environmentService.setDetailLocalCollection(ap[0]);
        this.detailviewerService.getDetailsFromOID(ap).subscribe(function (response) {
            var tmp_json = (response._body);
            if (tmp_json == null) {
                return;
            }
            var processed_json = JSON.parse(tmp_json);
            for (var i = 0; i < processed_json.length; i++) {
                for (var key in processed_json[i]) {
                    var value = processed_json[i][key];
                    if ((key == 'user_access') && value == 'rw') {
                        //              console.log('RW '+parent.globalParams[0]+parent.globalParams[1]);
                        parent.openDetailsPageRW(parent.globalParams[0], parent.globalParams[1]);
                    }
                    else {
                        //              console.log('RO '+parent.globalParams[0]+parent.globalParams[1]);
                        parent.openDetailsPageRO(parent.globalParams[0], parent.globalParams[1]);
                    }
                }
            }
        });
    };
    RedirectDVIntranetComponent.prototype.openDetailsPageRO = function (coll, id) {
        var ap = [];
        ap.push(coll);
        ap.push(id);
        //console.log(ap);
        this.router.navigate(['/detailviewerIntranetRO', ap]);
    };
    RedirectDVIntranetComponent.prototype.openDetailsPageRW = function (coll, id) {
        var ap = [];
        ap.push(coll);
        ap.push(id);
        //console.log(ap);
        this.router.navigate(['/detailviewerIntranetRW', ap]);
    };
    RedirectDVIntranetComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'redirectdvIntranet.component.html'
        })
        //OnInit generale fa roba
        ,
        __metadata("design:paramtypes", [index_1.DetailviewerService,
            router_1.Router,
            router_1.ActivatedRoute,
            index_2.EnvironmentService])
    ], RedirectDVIntranetComponent);
    return RedirectDVIntranetComponent;
}());
exports.RedirectDVIntranetComponent = RedirectDVIntranetComponent;
//# sourceMappingURL=redirectdvIntranet.component.js.map