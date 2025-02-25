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
exports.Admin = exports.AdminType = exports.Status = exports.Gender = exports.Gym = void 0;
const typeorm_1 = require("typeorm");
const role_1 = require("./role");
var Gym;
(function (Gym) {
    Gym["25_GYM"] = "25 gym";
    Gym["BIDO_GYM"] = "Bido gym";
    Gym["EXTREME_GYM"] = "extreme gym";
})(Gym || (exports.Gym = Gym = {}));
var Gender;
(function (Gender) {
    Gender["ANY"] = "ANY";
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
})(Gender || (exports.Gender = Gender = {}));
var Status;
(function (Status) {
    Status["ACTIVE"] = "ACTIVE";
    Status["INACTIVE"] = "INACTIVE";
})(Status || (exports.Status = Status = {}));
var AdminType;
(function (AdminType) {
    AdminType["GLOBAL"] = "GLOBAL";
    AdminType["BRANCH"] = "BRANCH";
})(AdminType || (exports.AdminType = AdminType = {}));
let Admin = class Admin extends typeorm_1.BaseEntity {
};
exports.Admin = Admin;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Admin.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Admin.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Admin.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], Admin.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 15, nullable: true }),
    __metadata("design:type", String)
], Admin.prototype, "contactNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Gender, default: Gender.ANY }),
    __metadata("design:type", String)
], Admin.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Status, default: Status.ACTIVE }),
    __metadata("design:type", String)
], Admin.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AdminType }),
    __metadata("design:type", String)
], Admin.prototype, "adminType", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true }),
    __metadata("design:type", Array)
], Admin.prototype, "referenceTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_1.Role),
    (0, typeorm_1.JoinColumn)({ name: 'role_id', referencedColumnName: 'id' }),
    __metadata("design:type", role_1.Role)
], Admin.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', select: false }) // select: false means this field won't be selected by default in queries
    ,
    __metadata("design:type", String)
], Admin.prototype, "password", void 0);
exports.Admin = Admin = __decorate([
    (0, typeorm_1.Entity)('admins')
], Admin);
