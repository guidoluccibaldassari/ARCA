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
//import {AutocompleteDirective} from "../../_directives/index";
//import {Promise} from "es6-promise";
//Servizi
var index_1 = require("../../_services/index"); //la import del servizio
var InputObjTextBoxCollection = /** @class */ (function () {
    function InputObjTextBoxCollection(workareaService) {
        this.workareaService = workareaService;
    }
    /**
    * generate a search function that returns a Promise that resolves to array of text and optionally additional data
    */
    InputObjTextBoxCollection.prototype.search = function () {
        var _this = this;
        /*
        return (filter: string): Promise<Array<{ text: string, data: any }>> => {
              // do the search
              resolve({text: "one item", data: null});
          };
        */
        //    return (filter: string): Promise<Array<{ text: string, data: any }>> => {
        return function (filter) {
            var tmp_json;
            _this.workareaService.getContent('SideBarLinks').subscribe(function (response) {
                //              var tmp_StringArray=[];
                //              var tmp_json=JSON.parse((<any>response)._body);
                tmp_json = JSON.parse(response._body);
                //              var globalArray=[];
                //              for(var i=0;i<tmp_json.length;i++)
                //              {
                //                tmp_StringArray.push(tmp_json[i].Titolo_Nodo);
                //              }
                //              for(var i=0;i<tmp_StringArray.length;i++)
                //              {
                //                globalArray.push({i:tmp_StringArray[i]})
                //              }
                //              return globalArray;
            });
            return tmp_json;
        };
    };
    /**
     * handle item selection
     */
    InputObjTextBoxCollection.prototype.onItemSelected = function (selected) {
        console.log("selected: ", selected.text);
    };
    InputObjTextBoxCollection = __decorate([
        core_1.Component({
            selector: "inputObjTextBoxCollection",
            template: "<input class=\"form-control\" type=\"text\" [ng2autocomplete]=\"search()\" (ng2AutocompleteOnSelect)=\"onItemSelected($event)\" autocomplete=\"off\">"
        }),
        __metadata("design:paramtypes", [index_1.WorkareaService])
    ], InputObjTextBoxCollection);
    return InputObjTextBoxCollection;
}());
exports.InputObjTextBoxCollection = InputObjTextBoxCollection;
//# sourceMappingURL=inputObjTextBoxCollection.component.js.map