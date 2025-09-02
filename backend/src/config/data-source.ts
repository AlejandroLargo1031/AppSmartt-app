import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Operation } from "../entities/Operation";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: true,
    entities: [User, Operation],
    migrations: ["src/migrations/**/*.ts"],
});
