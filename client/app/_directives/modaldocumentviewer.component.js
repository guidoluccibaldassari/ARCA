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
var $ = require("jquery");
var index_1 = require("../_services/index");
var ModaldocumentviewerComponent = /** @class */ (function () {
    function ModaldocumentviewerComponent(modaldvService, el) {
        this.modaldvService = modaldvService;
        this.el = el;
        this.element = $(el.nativeElement);
    }
    ModaldocumentviewerComponent.prototype.ngOnInit = function () {
        var modaldocumentviewer = this;
        // ensure id attribute exists
        if (!this.id) {
            console.error('modaldocumentviewer must have an id');
            return;
        }
        // move element to bottom of page (just before </body>) so it can be displayed above everything else
        this.element.appendTo('body');
        // close modal on background click
        this.element.on('click', function (e) {
            var target = $(e.target);
            if (!target.closest('.modaldocumentviewer-body').length) {
                modaldocumentviewer.close();
            }
        });
        // add self (this modal instance) to the modal service so it's accessible from controllers
        this.modaldvService.add(this);
    };
    // remove self from modal service when directive is destroyed
    ModaldocumentviewerComponent.prototype.ngOnDestroy = function () {
        this.modaldvService.remove(this.id);
        this.element.remove();
    };
    // open modal
    ModaldocumentviewerComponent.prototype.open = function () {
        //console.log(this.element.find('div.modal').css('display'));
        this.element.find('div.modaldocumentviewer').css('display', 'inline');
        this.element.show();
        $('body').addClass('modaldocumentviewer-open');
    };
    // close modal
    ModaldocumentviewerComponent.prototype.close = function () {
        this.element.find('div.modaldocumentviewer').css('display', 'none');
        this.element.hide();
        $('body').removeClass('modaldocumentviewer-open');
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ModaldocumentviewerComponent.prototype, "id", void 0);
    ModaldocumentviewerComponent = __decorate([
        core_1.Component({
            moduleId: module.id.toString(),
            selector: 'modaldocumentviewer',
            template: '<ng-content></ng-content>'
        }),
        __metadata("design:paramtypes", [index_1.ModaldocumentviewerService,
            core_1.ElementRef])
    ], ModaldocumentviewerComponent);
    return ModaldocumentviewerComponent;
}());
exports.ModaldocumentviewerComponent = ModaldocumentviewerComponent;
//# sourceMappingURL=modaldocumentviewer.component.js.map