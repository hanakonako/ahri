import { LICENSE_UPDATE } from "@/models/license";
import type { Request, Response } from "express";

export default async function registerHwid(request: Request, response: Response) {
    const payment_id = request.params.payment_id;
    const { licenseModel, paymentModel } = request.models
    try {
      if (!/^\d+$/.test(payment_id)) {
        return response.status(400).json({ message: "Pagamento inválido" });
      }
      const mp_id = parseInt(payment_id);
      const status = await paymentModel.getStatus(mp_id);
      if (status === "not_found") {
          return response.status(400).json({ message: "Pagamento não existe ou código expirou" });
      }
      if (status !== "approved") {
        return response.status(400).json({ message: "Pagamento pendente" });
      }
      const data = await paymentModel.getPayment(mp_id);
      if (!data) {
        return response.status(400).json({ message: "Pagamento não existe ou código expirou" });
      }
      const license = await licenseModel.generateNew(data?.quantity, data?.buyer_email);
      return response.status(200).json(license);
    } catch (_) {
        return response.status(500).json({
            message: "Erro interno do servidor."
        });
    }
}