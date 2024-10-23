import { Router } from "express";
import type { Response, Request, NextFunction } from "express";
import licenseInfo from "./license/info";
import generate from "./license/generate";
import acessHwid from "./license/acess-hwid";
import registerHwid from "./license/register-hwid";
import type { MongoClient } from "mongodb";
import LicenseModel from "@/models/license";
import expiresAt from "./license/expires";

const router = Router();
const attachModels = (client: MongoClient) => {
    const licenseModel = new LicenseModel(client);
    return (req: Request, res: Response, next: NextFunction) => {
      req.models = {
        licenseModel,
      };
      next();
    };
  };

const routes = (client: MongoClient) => {

  router.get("/ping", (_, res: Response) => {
    res.status(200).json({
      message: "Pong!",
    });
  });

  router.use(attachModels(client));

  router.get("/license/:license", licenseInfo);
  router.get("/licenseExpires/:license", expiresAt);
  router.post("/license/new", generate);
  router.get("/validateHwid/:hwid", acessHwid);
  router.post("/registerHwid/:hwid", registerHwid);

  console.log("Rovas ativas.");
  return router; 
};

export default routes;
