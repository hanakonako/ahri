import { Router } from "express";
import type { Response, Request, NextFunction } from "express";
import licenseInfo from "./license/info";
import newLicense from "./license/new";
import generate from "./license/generate";
import acessHwid from "./license/acess-hwid";
import registerHwid from "./license/register-hwid";
import type { MongoClient } from "mongodb";
import LicenseModel from "@/models/license";
import expiresAt from "./license/expires";
import PaymentModel from "@/models/payments";
import { postPayment } from "@/services/payments";
import { createPaymentR } from "./payments/create";

const router = Router();
const attachModels = (client: MongoClient) => {
    const licenseModel = new LicenseModel(client);
    const paymentModel = new PaymentModel(client);
    return (req: Request, res: Response, next: NextFunction) => {
      req.models = {
        licenseModel,
        paymentModel
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

  // licenças
  router.get("/license/:license", licenseInfo);
  router.get("/acessEndat/:hwid", expiresAt);
  router.post("/license/new", newLicense);
  router.get("/validateHwid/:hwid", acessHwid);
  router.post("/registerHwid/:hwid", registerHwid);
  router.post("/license/generate/:payment_id", generate);

  // pagamento
  router.post("/payments/new", createPaymentR);

  console.log("Rovas ativas.");
  return router;
};

export default routes;
