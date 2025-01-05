import type { Request, Response } from "express";

export default async function generate(request: Request, response: Response) {
    const { licenseModel } = request.models;
    const key = request.headers.authorization;
    const game = request.query.game?.toString() || "overwatch";
    if (key !== (process.env.KEY || "123")) {
        return response.status(400);
    }
    
        try {
        const license = (await licenseModel.generateNew(1, "n/a", game as "overwatch" | "marvel")) || "";
        return response.status(license.length > 0 ? 200 : 500).json({
		license
	});
    } catch (_) {
        return response.status(500).send();
    }
}
