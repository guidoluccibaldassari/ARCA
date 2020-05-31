"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
//Native
var core_1 = require("@angular/core");
var core_2 = require("@angular/core"); //sopprime errori di tag per x3dom che viene caricato in maniera dinamica solo DOPO tutto il resto!
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
//3dParty
//import { PdfViewerModule } from 'ng2-pdf-viewer';
//import { x3dom } from 'x3dom';//non qui!
//Services
//import { AlertService } from './_services/index';
var index_1 = require("./_services/index");
var index_2 = require("./_services/index"); //la import del servizio
var index_3 = require("./_services/index");
var index_4 = require("./_services/index");
var index_5 = require("./_services/index");
var index_6 = require("./_services/index");
var index_7 = require("./_services/index");
//Components
var app_component_1 = require("./app.component");
//import { AlertComponent } from './_directives/index';
//import { AutocompleteList } from './_directives/index';
var index_8 = require("./database/index");
var index_9 = require("./detailviewer/index");
var index_10 = require("./detailviewerIntranet/index");
var index_11 = require("./detailviewerIntranetRO/index");
var index_12 = require("./detailviewerIntranetRW/index");
var index_13 = require("./workarea/workareaembeddeddetails/index");
var index_14 = require("./home/index");
//import { InputObjTextBoxCollection } from './detailviewerIntranetRW/inputObjTextBoxCollection/index';
var index_15 = require("./login/index");
var index_16 = require("./_directives/index");
var index_17 = require("./_directives/index");
var index_18 = require("./workarea/workareatree/index");
var index_19 = require("./redirectdvIntranet/index");
var index_20 = require("./register/index");
var index_21 = require("./workarea/subform/index");
var index_22 = require("./workarea/workareatree/index");
var index_23 = require("./workarea/index");
var index_24 = require("./workareaIntranet/index");
var index_25 = require("./workarea/workareatree/index");
//Directives
//import { AutocompleteDirective } from './_directives/index';
//User-built modules (which comprises other modules from default libraries)
var app_routing_1 = require("./app.routing");
//User-built other stuff - directives,helpers,guards[?]...
var index_26 = require("./_helpers/index");
var index_27 = require("./_guards/index");
//Pipes
var index_28 = require("./_pipes/index");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                //    PdfViewerModule,
                //x3dom,//va importato dinamicamente DOPO
                app_routing_1.routing //è quello locale -app.routing.ts? direi di si...
            ],
            declarations: [
                app_component_1.AppComponent,
                //    AlertComponent,
                //    AutocompleteDirective,
                //    AutocompleteList,
                index_8.DatabaseComponent,
                index_9.DetailviewerComponent,
                index_10.DetailviewerIntranetComponent,
                index_11.DetailviewerIntranetROComponent,
                index_12.DetailviewerIntranetRWComponent,
                index_13.EmbeddeddetailsComponent,
                index_14.HomeComponent,
                //    InputObjTextBoxCollection,
                index_15.LoginComponent,
                index_16.ModalComponent,
                index_17.ModaldocumentviewerComponent,
                index_18.Nodes,
                index_19.RedirectDVIntranetComponent,
                index_20.RegisterComponent,
                index_21.SubformComponent,
                index_22.Tree,
                index_28.UnderscoreToBlankSpacesPipe,
                index_23.WorkareaComponent,
                index_24.WorkareaIntranetComponent,
                index_25.WorkareatreeComponent
            ],
            schemas: [
                core_2.NO_ERRORS_SCHEMA
            ],
            //importante!!!
            providers: [
                index_27.AuthGuard,
                //AlertService,
                index_1.AuthenticationService,
                index_26.customHttpProvider,
                index_3.DetailviewerService,
                index_2.EnvironmentService,
                index_4.ModalService,
                index_5.ModaldocumentviewerService,
                index_6.UsersService,
                index_7.WorkareaService
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map