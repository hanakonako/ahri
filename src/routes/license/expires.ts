import type { Request, Response } from "express";

export default async function expiresAt(request: Request, response: Response) {
  const licenseInfo = request.params.license;
  const { licenseModel } = request.models;

  try {
    const license = await licenseModel.getLicense(licenseInfo);
    if (!license?.linkedHwid) { 
        return response.status(404).send("");
    }
    if (license?.expirestAt) {
      const date = new Date(license.expirestAt);
      const endsAt =
        `${date.toLocaleDateString("pt-BR")} - ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", })}`;
      response.status(200).send(endsAt);
    } else {
        response.status(200).send("N/A - Acesso permanente a este HWID.");
    }

  } catch (_) {
    return response.status(500).send("Erro do servidor");
  }
}
