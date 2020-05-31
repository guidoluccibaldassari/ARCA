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
//import {Directive, DynamicComponentLoader, Input, ComponentRef, Output, EventEmitter, OnInit, ViewContainerRef} from "@angular/core";
var core_1 = require("@angular/core");
//import {Promise} from "es6-promise";
var autocompletelist_component_1 = require("./autocompletelist.component");
var AutocompleteDirective = /** @class */ (function () {
    function AutocompleteDirective(viewRef, cfr) {
        this.viewRef = viewRef;
        this.cfr = cfr;
        // The directive emits ng2AutocompleteOnSelect event when an item from the list is selected
        this.selected = new core_1.EventEmitter();
        this.term = "";
        this.listCmp = undefined;
        this.refreshTimer = undefined;
        this.searchInProgress = false;
        this.searchRequired = false;
    }
    /**
     * On key event is triggered when a key is released on the host component
     * the event starts a timer to prevent concurrent requests
     */
    AutocompleteDirective.prototype.onKey = function (event) {
        var _this = this;
        if (!this.refreshTimer) {
            this.refreshTimer = setTimeout(function () {
                if (!_this.searchInProgress) {
                    _this.doSearch();
                }
                else {
                    // If a request is in progress mark that a new search is required
                    _this.searchRequired = true;
                }
            }, 200);
        }
        this.term = event.target.value;
        if (this.term === "" && this.listCmp) {
            // clean the list if the search term is empty
            this.removeList();
        }
    };
    AutocompleteDirective.prototype.ngOnInit = function () {
        var _this = this;
        // When an item is selected remove the list
        this.selected.subscribe(function () {
            _this.removeList();
        });
    };
    /**
     * Call the search function and handle the results
     */
    AutocompleteDirective.prototype.doSearch = function () {
        var _this = this;
        this.refreshTimer = undefined;
        // if we have a search function and a valid search term call the search
        if (this.search && this.term !== "") {
            this.searchInProgress = true;
            this.search(this.term)
                .then(function (res) {
                _this.searchInProgress = false;
                // if the term has changed during our search do another search
                if (_this.searchRequired) {
                    _this.searchRequired = false;
                    _this.doSearch();
                }
                else {
                    // display the list of results
                    _this.displayList(res);
                }
            })
                .catch(function (err) {
                console.log("search error:", err);
                _this.removeList();
            });
        }
    };
    /**
     * Display the list of results
     * Dynamically load the list component if it doesn't exist yet and update the suggestions list
     */
    /*
        private displayList(list: Array<{ text: string, data: any }>) {
    //se non esiste listCmp
            if (!this.listCmp) {
    //carica il componente in cmp e lo infila in listCmp
                this.dcl.loadNextToLocation(AutocompleteList, this.viewRef)
                .then(cmp => {
                    // The component is loaded
                    this.listCmp = cmp;
                    this.updateList(list);
                    // Emit the selectd event when the component fires its selected event
                    (<AutocompleteList>(this.listCmp.instance)).selected
                        .subscribe(selectedItem => {
    
                        this.selected.emit(selectedItem);
                    });
                });
            } else {
                this.updateList(list);
            }
        }
    */
    /*
     DA TUTORIAL
     /altro file:
     import { Directive, ViewContainerRef } from '@angular/core';
    @Directive({
      selector: '[ad-host]',
    })
    export class AdDirective {
      constructor(public viewContainerRef: ViewContainerRef) { }
    }
    //file locale
    //NB qui si cerca di attaccare il componente locale ad un viewRef di un altra direttiva
    //Si cerca di recuperare l'host, prenderne il viewRef ed attaccarci l'oggetto qui creato (la item)
      loadComponent() {
        this.currentAdIndex = (this.currentAdIndex + 1) % this.ads.length;
        let adItem = this.ads[this.currentAdIndex];
    
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(adItem.component);
    
        let viewContainerRef = this.adHost.viewContainerRef;
        viewContainerRef.clear();
    
        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<AdComponent>componentRef.instance).data = adItem.data;
      }
    
    */
    //Provo a riprodurre la funzionalità sostituendo DynamicComponentLoader con ComponentFactoryResolver
    AutocompleteDirective.prototype.displayList = function (list) {
        var _this = this;
        //se non esiste listCmp
        if (!this.listCmp) {
            //carica il componente in cmp usando il componentfactoryresolver - cosa vogliamo la AutoComplete list definita nell'altro ts
            var cmp = this.cfr.resolveComponentFactory(autocompletelist_component_1.AutocompleteList);
            //ora sarebbe bello appiccicarlo alla viewconatinerref usando il metodo viewContainerRef
            //qui non dobbiamo impazzire a crearci una viewref e poi attacarci il componente che ci interessa: già l'abbiamo per cui commento
            //      let innerViewRef = this.viewRef; 
            //      innerViewRef.clear();
            //      let componentRef = innerViewRef.createComponent(cmp);
            this.viewRef.clear();
            var componentRef = this.viewRef.createComponent(cmp);
            //DONE
            componentRef.instance.selected //.subscribe(generatorOrNext, error, complete) 
                .subscribe(function (selectedItem) { _this.selected.emit(selectedItem); });
        }
        else {
            this.updateList(list);
        }
    };
    /**
     * Update the suggestions list in the list component
     */
    AutocompleteDirective.prototype.updateList = function (list) {
        if (this.listCmp) {
            (this.listCmp.instance).list = list;
        }
    };
    /**
     * remove the list component
     */
    AutocompleteDirective.prototype.removeList = function () {
        this.searchInProgress = false;
        this.searchRequired = false;
        if (this.listCmp) {
            this.listCmp.destroy();
            this.listCmp = undefined;
        }
    };
    __decorate([
        core_1.Input("ng2autocomplete"),
        __metadata("design:type", Function)
    ], AutocompleteDirective.prototype, "search", void 0);
    __decorate([
        core_1.Output("ng2autocompleteOnSelect"),
        __metadata("design:type", Object)
    ], AutocompleteDirective.prototype, "selected", void 0);
    AutocompleteDirective = __decorate([
        core_1.Directive({
            selector: "[ng2autocomplete]",
            host: {
                "(keyup)": "onKey($event)" // Listen to keyup events on the host component
            }
        }),
        __metadata("design:paramtypes", [core_1.ViewContainerRef, core_1.ComponentFactoryResolver])
    ], AutocompleteDirective);
    return AutocompleteDirective;
}());
exports.AutocompleteDirective = AutocompleteDirective;
//# sourceMappingURL=autocompletion.directive.js.map