import { validateHwid } from "@/managers/licenses-manager";
import { newLogin } from "@/services/webhook";
import type { Request, Response } from "express";

export default async function acessHwid(request: Request, response: Response) {
    const hwid = request.params.hwid;
    try {
        const isLoginValid = await validateHwid(hwid);
        if (isLoginValid) {
            await newLogin(hwid);
            return response.status(200).send("valid");
        } else {
            return response.status(400).send("not valid");
        }
    } catch (_) {
        return response.status(500).send();
    }
}