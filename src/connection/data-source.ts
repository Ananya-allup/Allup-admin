import "reflect-metadata";
import { DataSource } from "typeorm";
import { Admin } from "../entity/admin";
import { Role } from "../entity/role";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password : "root",
    database: "allup_db",
    entities: [Admin, Role],
    synchronize: true,
    // logging: true,

  });

