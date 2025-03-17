import "reflect-metadata";
import { DataSource } from "typeorm";
import { Admin } from "../entity/admin";
import { Role } from "../entity/role";

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: "localhost",
    port: 3307,
    username: "root",
    password : "root",
    database: "testdb",
    entities: [Admin, Role],
    synchronize: true,
    // logging: true,

  });

