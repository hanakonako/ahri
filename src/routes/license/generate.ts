import { generateNew } from "@/managers/licenses-manager";
import type { Request, Response } from "express";

export default async function generate(request: Request, response: Response) {
    const { licenseModel } = request.models;
    const key = request.headers.authorization;
    if (key !== (process.env.KEY || "123")) {
        return response.status(400);
    }
    try {
        const license = await licenseModel.generateNew();
        return response.status(license ? 200 : 500).json(license);
    } catch (_) {
        return response.status(500).send();
    }
}