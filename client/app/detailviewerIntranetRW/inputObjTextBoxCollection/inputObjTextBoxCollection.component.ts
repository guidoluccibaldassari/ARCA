 "use strict";
import {Component} from "@angular/core";
//import {AutocompleteDirective} from "../../_directives/index";
//import {Promise} from "es6-promise";

//Servizi
import { WorkareaService } from '../../_services/index'; //la import del servizio

@Component({
    selector: "inputObjTextBoxCollection",
    template: `<input class="form-control" type="text" [ng2autocomplete]="search()" (ng2AutocompleteOnSelect)="onItemSelected($event)" autocomplete="off">`
})
export class InputObjTextBoxCollection  {
  
  constructor
  (
    private workareaService: WorkareaService
  )
  {
  }

/**
* generate a search function that returns a Promise that resolves to array of text and optionally additional data
*/  
  public search() {
/*
return (filter: string): Promise<Array<{ text: string, data: any }>> => {
      // do the search
      resolve({text: "one item", data: null});
  };
*/
//    return (filter: string): Promise<Array<{ text: string, data: any }>> => {
    return (filter: string): Promise<Array<{ text: string, data: any }>> => {

          var tmp_json;
          this.workareaService.getContent('SideBarLinks').subscribe(
            function(response) {
//              var tmp_StringArray=[];
//              var tmp_json=JSON.parse((<any>response)._body);
              tmp_json=JSON.parse((<any>response)._body);
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
            }
          );
          return tmp_json;
    }
  }

    /**
     * handle item selection
     */  
  public onItemSelected(selected: { text: string, data: any }) {
    console.log("selected: ", selected.text);
  }
}