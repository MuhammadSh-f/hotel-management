import dotenv from "dotenv";

dotenv.config();

const parsedPort = process.env.PORT ? Number(process.env.PORT) : 5000;

export const config = {
  port: Number.isNaN(parsedPort) ? 5000 : parsedPort,
  mongoUri: process.env.MONGO_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
};
