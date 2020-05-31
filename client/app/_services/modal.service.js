"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//L'import originale: peccato rompa ogni cosa e causi dei reload continui nel caso venga effettuato più volte in servizi diversi
//import * as _ from 'underscore';
var und_m = require("underscore");
var ModalService = /** @class */ (function () {
    function ModalService() {
        this.modals = [];
    }
    ModalService.prototype.add = function (modal) {
        // add modal to array of active modals
        this.modals.push(modal);
    };
    ModalService.prototype.remove = function (id) {
        // remove modal from array of active modals
        var modalToRemove = und_m.findWhere(this.modals, { id: id });
        this.modals = und_m.without(this.modals, modalToRemove);
    };
    ModalService.prototype.open = function (id) {
        // open modal specified by id
        var modal = und_m.findWhere(this.modals, { id: id });
        modal.open();
    };
    ModalService.prototype.close = function (id) {
        // close modal specified by id
        var modal = und_m.find(this.modals, { id: id });
        modal.close();
    };
    return ModalService;
}());
exports.ModalService = ModalService;
//# sourceMappingURL=modal.service.js.map