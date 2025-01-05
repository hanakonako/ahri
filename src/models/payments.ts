import { createPayment, getPaymentStatus } from "@/services/payments";
import { logNewLicense, registerHwidUpdate, registerLogin } from "@/services/webhook";
import type { MongoClient, Document, Collection } from "mongodb";
import { nanoid } from "nanoid";
import { inspect } from "util";

export enum LICENSE_UPDATE {
    NOT_FOUND = 0,
    SUCESS = 1,
    LOCKED = -1,
    DB_OPERATION_FAILED = -2,
    NOT_VALID = -3
}

export enum PAYMENT_METHOD {
    PIX = 0,
    CARD = 1
}

interface Payment extends Document {
    buyer: string;
    buyer_email: string
    mp_id: number;
    payment_method: PAYMENT_METHOD;
    createdAtTimestamp: number;
    quantity: number;
    game: string;
}

export default class PaymentModel {
    private readonly client: MongoClient;
    private readonly collection: Collection<Payment>;

    constructor(client: MongoClient) {
        this.client = client;
        this.collection = this.client.db("test").collection("payments");
    }
    async delete(payment_id: number) {
        try {
            await this.collection.deleteOne({ mp_id: payment_id });
        } catch (error) {
        }
    }
    async generate(name: string, email: string, months: number, game = "overwatch") {
        try {
            const mp_payment = await createPayment(name, email, months);
            if (mp_payment?.paymentId && mp_payment.pixCode && mp_payment.qrCode) {
                await this.collection.insertOne({
                    buyer: name,
                    mp_id: mp_payment.paymentId,
                    buyer_email: email,
                    payment_method: PAYMENT_METHOD.PIX,
                    createdAtTimestamp: Date.now(),
                    quantity: months,
                    game
                });
                return mp_payment;
            }
            return null;
        } catch (error: any) {
            console.log(`❌ Erro ao gerar pagamento: ${inspect(error, true, 10)}`);
            return null;
        }
    }

    async getStatus(paymentId: number) {
        try {
            const paymentDoc = await this.collection.findOne({ mp_id: paymentId });
            if (!paymentDoc) {
                return "not_found";
            }
            const status = await getPaymentStatus(paymentId);
            if (status == "not_found") {
                await this.collection.deleteOne({ mp_id: paymentId });
                return "not_found";
            }
            return status;
        } catch (error: any) {
            console.log(`❌ Erro ao obter status de pagamento: ${error} - ${error.stack}`);
            return "error";
        }
    }

    async getPayment(payment_id: number) {
        try {
            const paymentDoc = await this.collection.findOne({ mp_id: payment_id });
            const status = await getPaymentStatus(payment_id);
            if (status == "not_found") {
                await this.collection.deleteOne({ mp_id: payment_id });
                return null;
            }
            return paymentDoc;
        } catch (error: any) {
            console.log(`❌ Erro ao obter pagamento: ${error} - ${error.stack}`);
            return null;
        }
    }
}

/*
import { model, Schema, SchemaType, Types } from "mongoose";
import type { Document  } from "mongoose";
import { nanoid } from "nanoid";



const LicenseSchema = new Schema<License>({
    linkedHwid: String,
    lastAcess: Number,
    licenseBlob: {
        unique: true,
        type: String,
        required: true,
        default: () => {
            return nanoid();
        }
    },
    lastRegister: Number,
}, {
    timestamps: true
});

LicenseSchema.pre("save", function(next) {
    if (this.isNew) {
        next();
    }
    if (this.isModified("linkedHwid")) {
        this.lastRegister = Date.now();
    }
    next();
});

const LicenseModel = model("license", LicenseSchema);
export default LicenseModel;
*/