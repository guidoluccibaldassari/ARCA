//Native
import { NgModule } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core'; //sopprime errori di tag per x3dom che viene caricato in maniera dinamica solo DOPO tutto il resto!
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

//3dParty
//import { PdfViewerModule } from 'ng2-pdf-viewer';
//import { x3dom } from 'x3dom';//non qui!

//Services
//import { AlertService } from './_services/index';
import { AuthenticationService } from './_services/index';
import { EnvironmentService } from './_services/index'; //la import del servizio
import { DetailviewerService } from './_services/index';
import { ModalService } from './_services/index';
import { ModaldocumentviewerService } from './_services/index';
import { UsersService} from './_services/index';
import { WorkareaService } from './_services/index';

//Components
import { AppComponent } from './app.component';
//import { AlertComponent } from './_directives/index';
//import { AutocompleteList } from './_directives/index';
import { DatabaseComponent } from './database/index';
import { DetailviewerComponent } from './detailviewer/index';
import { DetailviewerIntranetComponent } from './detailviewerIntranet/index';
import { DetailviewerIntranetROComponent } from './detailviewerIntranetRO/index';
import { DetailviewerIntranetRWComponent } from './detailviewerIntranetRW/index';
import { EmbeddeddetailsComponent } from './workarea/workareaembeddeddetails/index';
import { HomeComponent } from './home/index';
//import { InputObjTextBoxCollection } from './detailviewerIntranetRW/inputObjTextBoxCollection/index';
import { LoginComponent } from './login/index';
import { ModalComponent } from './_directives/index';
import { ModaldocumentviewerComponent } from './_directives/index';
import { Nodes } from './workarea/workareatree/index';
import { RedirectDVIntranetComponent } from './redirectdvIntranet/index';
import { RegisterComponent } from './register/index';
import { SubformComponent } from './workarea/subform/index';
import { Tree } from './workarea/workareatree/index';
import { WorkareaComponent } from './workarea/index';
import { WorkareaIntranetComponent } from './workareaIntranet/index';
import { WorkareatreeComponent } from './workarea/workareatree/index';

//Directives
//import { AutocompleteDirective } from './_directives/index';

//User-built modules (which comprises other modules from default libraries)
import { routing } from './app.routing';

//User-built other stuff - directives,helpers,guards[?]...
import { customHttpProvider } from './_helpers/index';
import { AuthGuard } from './_guards/index';

//Pipes
import { UnderscoreToBlankSpacesPipe } from './_pipes/index';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
//    PdfViewerModule,
    //x3dom,//va importato dinamicamente DOPO
    routing//è quello locale -app.routing.ts? direi di si...
  ],
  declarations: [
    AppComponent,
//    AlertComponent,
//    AutocompleteDirective,
//    AutocompleteList,
    DatabaseComponent,
    DetailviewerComponent,
    DetailviewerIntranetComponent,
    DetailviewerIntranetROComponent,
    DetailviewerIntranetRWComponent,
    EmbeddeddetailsComponent,
    HomeComponent,
//    InputObjTextBoxCollection,
    LoginComponent,
    ModalComponent,
    ModaldocumentviewerComponent,
    Nodes,
    RedirectDVIntranetComponent,
    RegisterComponent,
    SubformComponent,
    Tree,
    UnderscoreToBlankSpacesPipe,
    WorkareaComponent,
    WorkareaIntranetComponent,
    WorkareatreeComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  //importante!!!
  providers: [
    AuthGuard,
    //AlertService,
    AuthenticationService,
    customHttpProvider,
    DetailviewerService,
    EnvironmentService,
    ModalService,
    ModaldocumentviewerService,
    UsersService,
    WorkareaService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
