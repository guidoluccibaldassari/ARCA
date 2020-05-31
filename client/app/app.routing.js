"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Modules
var router_1 = require("@angular/router");
//Guards
var index_1 = require("./_guards/index");
//Components
var index_2 = require("./database/index");
var index_3 = require("./detailviewer/index");
var index_4 = require("./detailviewerIntranet/index");
var index_5 = require("./detailviewerIntranetRO/index");
var index_6 = require("./detailviewerIntranetRW/index");
var index_7 = require("./home/index");
var index_8 = require("./login/index");
var index_9 = require("./redirectdvIntranet/index");
var index_10 = require("./register/index");
var index_11 = require("./workarea/index");
var index_12 = require("./workareaIntranet/index");
var appRoutes = [
    { path: 'database', component: index_2.DatabaseComponent, canActivate: [index_1.AuthGuard] },
    { path: 'detailviewer', component: index_3.DetailviewerComponent },
    { path: 'detailviewerIntranet', component: index_4.DetailviewerIntranetComponent, canActivate: [index_1.AuthGuard] },
    { path: 'detailviewerIntranetRO', component: index_5.DetailviewerIntranetROComponent, canActivate: [index_1.AuthGuard] },
    { path: 'detailviewerIntranetRW', component: index_6.DetailviewerIntranetRWComponent, canActivate: [index_1.AuthGuard] },
    { path: '', component: index_7.HomeComponent },
    { path: 'login', component: index_8.LoginComponent },
    { path: 'redirectdvIntranet', component: index_9.RedirectDVIntranetComponent, canActivate: [index_1.AuthGuard] },
    { path: 'register', component: index_10.RegisterComponent, canActivate: [index_1.AuthGuard] },
    { path: 'workarea', component: index_11.WorkareaComponent },
    { path: 'workareaIntranet', component: index_12.WorkareaIntranetComponent, canActivate: [index_1.AuthGuard] },
    // otherwise redirect to home
    { path: '**', redirectTo: '' } //quest'ultimo serve a ridirigere sulla home in qualsiasi caso qualcosa delle precedenti vada male - gli asterischi sono wildcards - è una catena ma che si aspetta comunque un match per fare qualcosa, non ha dei predefiniti... se commentata questa riga non c'è un match esatto per molte cose, quando la pagina fallisce si ricarica solo il container.
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map