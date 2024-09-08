import { getLicense } from "@/managers/licenses-manager";
import type { Request, Response } from "express";

export default async function licenseInfo(request: Request, response: Response) {
    const licenseInfo = request.params.license;

    try {
        const license = await getLicense(licenseInfo);
        return response.status(license ? 200 : 404).json(license);
    } catch (_) {
        return response.status(500).send();
    }
}