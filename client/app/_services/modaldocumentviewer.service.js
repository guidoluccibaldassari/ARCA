"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var und_mdv = require("underscore");
var ModaldocumentviewerService = /** @class */ (function () {
    function ModaldocumentviewerService() {
        this.modalsdv = [];
    }
    ModaldocumentviewerService.prototype.add = function (modaldv) {
        // add modal to array of active modals
        this.modalsdv.push(modaldv);
    };
    ModaldocumentviewerService.prototype.remove = function (id) {
        // remove modal from array of active modals
        var modaldvToRemove = und_mdv.findWhere(this.modalsdv, { id: id });
        this.modalsdv = und_mdv.without(this.modalsdv, modaldvToRemove);
    };
    ModaldocumentviewerService.prototype.open = function (id) {
        // open modal specified by id
        var modaldv = und_mdv.findWhere(this.modalsdv, { id: id });
        modaldv.open();
    };
    ModaldocumentviewerService.prototype.close = function (id) {
        // close modal specified by id
        var modaldv = und_mdv.find(this.modalsdv, { id: id });
        modaldv.close();
    };
    return ModaldocumentviewerService;
}());
exports.ModaldocumentviewerService = ModaldocumentviewerService;
//# sourceMappingURL=modaldocumentviewer.service.js.map