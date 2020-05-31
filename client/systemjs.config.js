/**
 * System configuration for Angular 2 samples Adjust as necessary for your
 * application needs.
 */
(function(global){
  System
      .config({
        paths:{
          // paths serve as alias
          'npm:':'node_modules/'
        },
        // map tells the System loader where to look for things
        map:{
          // our app is within the app folder
          app:'app',
          
          // angular bundles
          '@angular/core':'npm:@angular/core/bundles/core.umd.js',
          '@angular/common':'npm:@angular/common/bundles/common.umd.js',
          '@angular/compiler':'npm:@angular/compiler/bundles/compiler.umd.js',
          '@angular/platform-browser':'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
          '@angular/platform-browser-dynamic':'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
          '@angular/http':'npm:@angular/http/bundles/http.umd.js',
          '@angular/http/testing':'npm:@angular/http/bundles/http-testing.umd.js',
          '@angular/router':'npm:@angular/router/bundles/router.umd.js',
          '@angular/forms':'npm:@angular/forms/bundles/forms.umd.js',
          
          // other libraries
          'rxjs':'npm:rxjs',
          
          // bootstrap
          'bootstrap':'npm:bootstrap/dist/js/bootstrap.min.js',
          
          // jquery
          'jquery':'npm:jquery/dist/jquery.min.js',
          
          // x3dom
          'x3dom':'npm:x3dom/x3dom.js',
          
          // underscore
          'underscore':'npm:underscore/underscore.js',
          
          // transpiler
          //'plugin-babel': 'npm:systemjs-plugin-babel/plugin-babel.js',
          //'systemjs-babel-build': 'npm:systemjs-plugin-babel/systemjs-babel-browser.js'
          'ts': 'npm:plugin-typescript/lib/plugin.js',
          'typescript': 'npm:typescript/lib/typescript.js',
          // pdf
//          'node-ensure':'npm:node-ensure/',
//          'zlib':'npm:zlib/lib/',
//          'fs':'npm:fs/',
//          'http':'npm:http/',
//          'https':'npm:https/',
//          'url':'npm:url/',
//          'pdfjs-dist':'npm:pdfjs-dist/',
//          'ng2-pdf-viewer':'npm:ng2-pdf-viewer/bundles/ng2-pdf-viewer.umd.js'
        },
        // packages tells the System loader how to load when no filename and/or
        // no extension
        packages:{
          app:{
            main:'./main.js',
            defaultExtension:'js'
          },
          rxjs:{
            defaultExtension:'js'
          }
//        ,'node-ensure': { defaultExtension: 'js', format: 'cjs' }
//        ,'zlib': { defaultExtension: 'js', format: 'cjs' }
//        ,'pdfjs-dist': {defaultExtension: 'js', format: 'cjs' }
//        ,'ng2-pdf-viewer': { defaultExtension: 'js', format: 'cjs' }
        },
        //transpiler: 'plugin-babel'
        transpiler: 'ts',
        typescriptOptions: {
          tsconfig: true
         ,emitDecoratorMetadata: true
        },
        meta: {
            'typescript': {
                "exports": "ts"
            }
        }
      });
})(this);
