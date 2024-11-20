import { Payment, MercadoPagoConfig } from 'mercadopago';
import util from "util";

const client = new MercadoPagoConfig({ accessToken: process.env.MP_KEY as string });
const payment = new Payment(client);

const calculatePrice = (duration: number) => {
    const basePrice = 30; // Preço base por unidade de duração
    const maxDiscount = 30; // Desconto máximo em porcentagem
    const discountPerDuration = 5; // Percentual de desconto por unidade de duração

    if (duration === 6) {
      return { finalPrice: (basePrice * 12) * 0.4, discountPercentage: 40 }; // Preço anual com 60% de desconto
    }

    const discountPercentage = Math.min(discountPerDuration * (duration - 1), maxDiscount);
    const discount = (basePrice * duration) * (discountPercentage / 100);
    const finalPrice = (basePrice * duration) - discount;

    return { finalPrice, discountPercentage };
  };

export const createPayment = async (name: string, email: string, duration = 1) => {
    if (duration % 1 != 0 || duration < 1 || duration > 6) {
        throw new TypeError("A duração é um número inteiro, maior ou igual a 1 e menor ou igual que 6.");
    }
    const { finalPrice } = calculatePrice(duration);
    const productPrice = process.env.MODE === "DEV" ? 0.01 : finalPrice;
    const paymentData = await payment.create({
        body: {
            transaction_amount: productPrice,
            payment_method_id: 'pix',
            description: `Licença de ${duration*30} dias`,
            payer: {
                email,
                first_name: name,
            },
        },
        requestOptions: { idempotencyKey: `${name}.${Date.now()}` }
    });
    console.log(util.inspect(paymentData, {
        colors: true,
        depth: Infinity,
        showHidden: true
    }))
    const base64_img = paymentData?.point_of_interaction?.transaction_data?.qr_code_base64;
    const pixCode = paymentData?.point_of_interaction?.transaction_data?.qr_code;
    if (base64_img) {
        // const buffer = Buffer.from(base64_img, "base64");
        console.log(`Criado novo pagamento: ${name} - ${paymentData.id}`)
        return {
            paymentId: paymentData.id,
            qrCode: base64_img,
            pixCode
        };
    }
}


export const getPaymentStatus = async (paymentId: number) => {
    const payment_data = await payment.get({ id: paymentId});
    return payment_data?.status || "not_found";
}