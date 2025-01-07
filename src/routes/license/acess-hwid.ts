import type { Request, Response } from "express";

export default async function acessHwid(request: Request, response: Response) {
    const { licenseModel } = request.models;

    const hwid = request.params.hwid;
    const game = "overwatch"; // request.query.game?.toString() as "overwatch" | "marvel" || "overwatch";
    const validGames = ["overwatch", "marvel"];
    if (!validGames.includes(game)) {
        return response.status(404).json({
            message: "Jogo não registrado"
        })
    }
    try {
        const isLoginValid = await licenseModel.validateHwid(hwid, !!request.query.isPremium?.toString().length, game || "overwatch");
        if (isLoginValid) {
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