import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// DB_SSL:
// - undefined / not "false"  -> SSL ON  (for Supabase direct connection)
// - "false"                  -> SSL OFF (for Supabase session pooler / local DB)
const useSSL = process.env.DB_SSL !== "false";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectOptions: useSSL
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
    logging: false,
  }
);

export default sequelize;