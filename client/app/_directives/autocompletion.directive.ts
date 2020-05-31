"use strict";
//import {Directive, DynamicComponentLoader, Input, ComponentRef, Output, EventEmitter, OnInit, ViewContainerRef} from "@angular/core";
import {Directive, ComponentFactoryResolver, Input, ComponentRef, Output, EventEmitter, OnInit, ViewContainerRef} from "@angular/core";
//import {Promise} from "es6-promise";
import {AutocompleteList} from "./autocompletelist.component";

@Directive({
    selector: "[ng2autocomplete]", // The attribute for the template that uses this directive
    host: {
      "(keyup)": "onKey($event)" // Listen to keyup events on the host component
    }
  })

export class AutocompleteDirective implements OnInit {
// The search function should be passed as an input
  @Input("ng2autocomplete") public search: (term: string) => Promise<Array<{ text: string, data: any }>>;
// The directive emits ng2AutocompleteOnSelect event when an item from the list is selected
  @Output("ng2autocompleteOnSelect") public selected = new EventEmitter();
  private term = "";
  private listCmp: ComponentRef<AutocompleteList> = undefined;
  private refreshTimer: any = undefined;
  private searchInProgress = false;
  private searchRequired = false;

  constructor( private viewRef: ViewContainerRef, private cfr: ComponentFactoryResolver) { }
    /**
     * On key event is triggered when a key is released on the host component
     * the event starts a timer to prevent concurrent requests
     */
    public onKey(event: any) {
        if (!this.refreshTimer) {
            this.refreshTimer = setTimeout(
            () => {
                if (!this.searchInProgress) {
                    this.doSearch();
                } else {
                    // If a request is in progress mark that a new search is required
                    this.searchRequired = true;
                }
            },
            200);
        }
        this.term = event.target.value;
        if (this.term === "" && this.listCmp) {
            // clean the list if the search term is empty
            this.removeList();
        }
    }

    public ngOnInit() {
        // When an item is selected remove the list
        this.selected.subscribe(() => {
            this.removeList();
        });
    }

    /**
     * Call the search function and handle the results
     */
    private doSearch() {
        this.refreshTimer = undefined;
        // if we have a search function and a valid search term call the search
        if (this.search && this.term !== "") {
            this.searchInProgress = true;
            this.search(this.term)
            .then((res) => {
                this.searchInProgress = false;
                // if the term has changed during our search do another search
                if (this.searchRequired) {
                    this.searchRequired = false;
                    this.doSearch();
                } else {
                    // display the list of results
                    this.displayList(res);
                }
            })
            .catch(err => {
                console.log("search error:", err);
                this.removeList();
            });
        }
    }

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
  private displayList(list:Array<{text:string,data:any}>)
  {
//se non esiste listCmp
    if (!this.listCmp) {
//carica il componente in cmp usando il componentfactoryresolver - cosa vogliamo la AutoComplete list definita nell'altro ts
      let cmp = this.cfr.resolveComponentFactory(AutocompleteList);
//ora sarebbe bello appiccicarlo alla viewconatinerref usando il metodo viewContainerRef
//qui non dobbiamo impazzire a crearci una viewref e poi attacarci il componente che ci interessa: già l'abbiamo per cui commento
//      let innerViewRef = this.viewRef; 
//      innerViewRef.clear();
//      let componentRef = innerViewRef.createComponent(cmp);
      this.viewRef.clear();
      let componentRef = this.viewRef.createComponent(cmp);
      //DONE
      (<AutocompleteList>componentRef.instance).selected//.subscribe(generatorOrNext, error, complete) 
                                                        .subscribe((selectedItem:any) => { this.selected.emit(selectedItem);});
    }
    else {
      this.updateList(list);
    }
  }

    /**
     * Update the suggestions list in the list component
     */
    private updateList(list: Array<{ text: string, data: any }>) {
        if (this.listCmp) {
            (<AutocompleteList>(this.listCmp.instance)).list = list;
        }
    }

    /**
     * remove the list component
     */
    private removeList() {
        this.searchInProgress = false;
        this.searchRequired = false;
        if (this.listCmp) {
            this.listCmp.destroy();
            this.listCmp = undefined;
        }
    }
}