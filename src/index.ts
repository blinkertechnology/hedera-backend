import express, { Router } from "express";
import cors from "cors";
import { router } from "@/routes/route";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { User } from "@prisma/client";
import { getSession } from "./middlewares/sessionCookieValidator";
import { Session, User as LuciaUser } from "lucia";
import { authorize } from "./middlewares/authorization";
import { logger } from "./middlewares/logger";

const app = express();
config();

declare global {
  type ExpressRouter = () => Promise<Router>;
  namespace Express {
    interface Locals {
      userId: string | null;
      userRole: User["role"] | null;
      email: User["email"] | null;
      hederaPvtKey: string | null;

      user: LuciaUser | null;
      session: Session | null;
    }
  }
}
declare module "jsonwebtoken" {
  interface JwtPayload {
    email?: User["email"] | null;
    userId: string;
    role: User["role"];
  }
}

(async function main() {
  // createFirstAccount();

  app.use(cookieParser());
  app.use(express.json());
  app.use(
    cors({
      origin: "*",
    })
  );

  app.use(logger);
  app.use(getSession);
  app.use(authorize);
  app.use("/api", await router());

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => console.log("Listening on port: ", PORT));
})();
