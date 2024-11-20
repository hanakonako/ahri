import { mpPayment } from "@/services/webhook";
import type { Request, Response } from "express";

export async function createPaymentR(request: Request, response: Response) {
  try {
    const { paymentModel } = request.models;
    if (!request.body || !request.body.name || !request.body.months || !request.body.email) {
      return response.status(400).json({ message: "Faltando informações para pagamento" });
    }
    if (!/^\d+$/.test(request.body.months)) {
      return response.status(400).json({ message: "Faltando informações para pagamento" });
    }
    let duration = parseInt(request.body.months);
    if (duration < 0 || duration > 6) {
      return response.status(400).json({ message: "Faltando informações para pagamento" });
    }
    const name = request.body.name;
    const email = request.body.email;
    const payment = await paymentModel.generate(name, email, duration);
    if (payment) {
      response.status(200).json(payment);
      await mpPayment(name, email, duration);
    } else {
      return response.status(500).json({ message: "Erro ao gerar pagamento "});

    }
  } catch (error) {
    return response.status(500).json({ message: "Erro ao gerar pagamento" });

  }
}