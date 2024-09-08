import { LICENSE_UPDATE, setHwid } from "@/managers/licenses-manager";
import type { Request, Response } from "express";

export default async function registerHwid(request: Request, response: Response) {
    const hwid = request.params.hwid;
    const license = request.query.license as string;
    try {
        const registred = await setHwid(license, hwid)
        if (registred === LICENSE_UPDATE.LOCKED) {
            return response.status(405).send("Cooldown");
        }
        if (registred === LICENSE_UPDATE.NOT_FOUND) {
            return response.status(404).send("N/A");
        }
        if (registred === LICENSE_UPDATE.SUCESS) {
            return response.status(200).send("Updated");
        }
    } catch (_) {
        return response.status(500).send("Erro");
    }
}