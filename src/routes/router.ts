import { Router } from "express";
import licenseInfo from "./license/info";
import generate from "./license/generate";
import acessHwid from "./license/acess-hwid";
import registerHwid from "./license/register-hwid";

const router = Router();

router.get("/ping", (_, res) => {
    res.status(200).json({
        message: "Pong!"
    });
});

router.get("/license/:license", licenseInfo);
router.post("/license/new", generate);
router.get("/validateHwid/:hwid", acessHwid);
router.post("/registerHwid/:hwid", registerHwid);

export default router;