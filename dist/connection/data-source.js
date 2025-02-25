"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const admin_1 = require("../entity/admin");
const role_1 = require("../entity/role");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "root",
    database: "allup_db",
    entities: [admin_1.Admin, role_1.Role],
    synchronize: true,
    // logging: true,
});
