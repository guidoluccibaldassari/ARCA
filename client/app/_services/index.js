"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./alert.service"));
//export * from './authentication.service';
__export(require("./detailviewer.service"));
__export(require("./environment.service"));
__export(require("./modal.service"));
__export(require("./modaldocumentviewer.service"));
__export(require("./users.service"));
__export(require("./workarea.service"));
//Workaround [?]
//Messo dopo environment.service (in coda) perchè generava un errore ingestibile che sembra dovuto a dipendenze circolari
//Error: Can't resolve all parameters for AuthenticationService: ([object Object], ?).
__export(require("./authentication.service"));
//# sourceMappingURL=index.js.map