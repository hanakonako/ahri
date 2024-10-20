import { LICENSE_UPDATE } from "@/models/license";
import type { Request, Response } from "express";

export default async function registerHwid(request: Request, response: Response) {
    const hwid = request.params.hwid;
    const { licenseModel } = request.models;
    const license = request.query.license as string;
    try {
        const registred = await licenseModel.setHwid(license, hwid)
        if (registred === LICENSE_UPDATE.LOCKED) {
            return response.status(405)
                .json({
                    message: "A licença está em cooldown para atualizar o HWID. Aguarde 1 dia."
                });
        }
        if (registred === LICENSE_UPDATE.NOT_FOUND) {
            return response.status(404).json({
                message: "Licença não encotrada."
            });
        }
        if (registred === LICENSE_UPDATE.SUCESS) {
            return response.status(200).json({
                message: "Licença atualizada com sucesso."
            });
        }
        if (registred === LICENSE_UPDATE.NOT_VALID) {
            return response.status(200).json({
                message: "Esse HWID já está registrado a outra licença."
            });
        }
    } catch (_) {
        return response.status(500).json({
            message: "Erro interno do servidor."
        });
    }
}