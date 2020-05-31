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
//tutti i metodi di svariate "librerie" [directives? services? dal nome direi services]
var index_1 = require("../_services/index");
//Componente
var UsersComponent = /** @class */ (function () {
    //il fulcro di ogni chiamata è  JSON.parse(localStorage.getItem('currentUser'));
    function UsersComponent(userService) {
        this.userService = userService;
        this.users = [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    UsersComponent.prototype.ngOnInit = function () {
        this.loadAllUsers();
        null;
    };
    UsersComponent.prototype.deleteUser = function (_id) {
        var _this = this;
        this.userService.delete(_id).subscribe(function () { _this.loadAllUsers(); });
    };
    UsersComponent.prototype.loadAllUsers = function () {
        var _this = this;
        this.userService.getAll().subscribe(function (users) { _this.users = users; });
    };
    UsersComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'users.component.html'
        })
        //OnInit fa roba
        ,
        __metadata("design:paramtypes", [index_1.UsersService])
    ], UsersComponent);
    return UsersComponent;
}());
exports.UsersComponent = UsersComponent;
//# sourceMappingURL=users.component.js.map