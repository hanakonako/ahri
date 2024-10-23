import type { Request, Response } from "express";

export default async function licenseInfo(request: Request, response: Response) {
    const licenseInfo = request.params.license;
    const { licenseModel } = request.models;

    try {
        const license = await licenseModel.getLicense(licenseInfo, false);
        return response.status(license ? 200 : 404).json(license);
    } catch (_) {
        return response.status(500).send({});
    }
}