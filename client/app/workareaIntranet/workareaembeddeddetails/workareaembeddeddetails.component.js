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
//Services
var index_1 = require("../../_services/index");
var index_2 = require("../../_services/index");
//Componenti
var EmbeddeddetailsComponent = /** @class */ (function () {
    function EmbeddeddetailsComponent(workareaService, _environmentService) {
        this.workareaService = workareaService;
        this._environmentService = _environmentService;
    }
    EmbeddeddetailsComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], EmbeddeddetailsComponent.prototype, "localKeys", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], EmbeddeddetailsComponent.prototype, "localValues", void 0);
    EmbeddeddetailsComponent = __decorate([
        core_1.Component({
            selector: 'embeddedDetailsComponent',
            template: "\n\t<div class=\"row\" style=\"width=100%\">\n\t\t\t\t<div *ngFor=\"let storedkey of this.localKeys; index as i;\">\n\t\t\t\t\t<div class=\"row\" style=\"border:1px solid #cecece;\">\n\t\t\t\t\t\t<div class=\"col-md-4\">\n\t\t\t\t\t\t\t<h4>{{storedkey | UnderscoreToBlankSpaces}} : </h4> \n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-md-8\">\n\t\t\t\t\t\t\t<div>{{this.localValues[i] | UnderscoreToBlankSpaces}}</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t</div>\n"
        }),
        __metadata("design:paramtypes", [index_1.WorkareaService, index_2.EnvironmentService])
    ], EmbeddeddetailsComponent);
    return EmbeddeddetailsComponent;
}());
exports.EmbeddeddetailsComponent = EmbeddeddetailsComponent;
//# sourceMappingURL=workareaembeddeddetails.component.js.map