import { newLogin } from "@/services/webhook";
import type { Request, Response } from "express";

export default async function acessHwid(request: Request, response: Response) {
    const { licenseModel } = request.models;

    const hwid = request.params.hwid;

    try {
        const isLoginValid = await licenseModel.validateHwid(hwid);
        if (isLoginValid) {
            await newLogin(hwid);
            return response.status(200).json({
                message: "Login aprovado."
            });
        } else {
            return response.status(400).json({
                message: "Login não autorizado."
            });
        }
    } catch (_) {
        return response.status(500).send();
    }
}