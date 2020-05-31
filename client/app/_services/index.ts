export * from './alert.service';
//export * from './authentication.service';
export * from './detailviewer.service';
export * from './environment.service';
export * from './modal.service';
export * from './modaldocumentviewer.service';
export * from './users.service';
export * from './workarea.service';

//Workaround [?]
//Messo dopo environment.service (in coda) perchè generava un errore ingestibile che sembra dovuto a dipendenze circolari
//Error: Can't resolve all parameters for AuthenticationService: ([object Object], ?).
export * from './authentication.service';