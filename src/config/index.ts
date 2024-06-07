import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  PORT: process.env.PORT,
  jwt: {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.EXPIRES_IN,
    REFRESH_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
  },
};
