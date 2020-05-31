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
//Componente
var DatabaseComponent = /** @class */ (function () {
    function DatabaseComponent(router, route) {
        this.router = router;
        this.route = route;
    }
    DatabaseComponent.prototype.ngOnInit = function () {
    };
    DatabaseComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'database.component.html'
        })
        //OnInit generale fa roba
        ,
        __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute])
    ], DatabaseComponent);
    return DatabaseComponent;
}());
exports.DatabaseComponent = DatabaseComponent;
//# sourceMappingURL=database.component.js.map