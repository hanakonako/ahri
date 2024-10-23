import { logNewLicense, registerHwidUpdate, registerLogin } from "@/services/webhook";
import type { MongoClient, Document, Collection } from "mongodb";
import { nanoid } from "nanoid";

export enum LICENSE_UPDATE {
    NOT_FOUND = 0,
    SUCESS = 1,
    LOCKED = -1,
    DB_OPERATION_FAILED = -2,
    NOT_VALID = -3
}

interface License extends Document {
    linkedHwid?: string;
    lastAcess?: number;
    licenseBlob: string;
    lastRegister?: number;
    expirestAt?: number;
    newType?: boolean;
}

const aDay = 86400000;

const addDays = (days: number, timestamp = Date.now()) => timestamp + (aDay * days);
const hasDaysPassed = (timestamp: number, days: number): boolean => (Date.now() - timestamp) / (aDay) >= days;
const isTimestampInPast = (timestamp: number): boolean => timestamp < Date.now();

export default class LicenseModel {
    private readonly client: MongoClient;
    private readonly collection: Collection<License>;

    constructor(client: MongoClient) {
        this.client = client;
        this.collection = this.client.db("test").collection("licenses");
    }

    async generateNew() {
        try {
            const licenseBlob = nanoid();
            await this.collection.insertOne({
                licenseBlob,
                newType: true
            });
            await logNewLicense(licenseBlob);
            return licenseBlob;
            
        } catch (error: any) {
            console.log(`❌ Erro ao gerar licença: ${error} - ${error.stack}`);
            return "";
        }
    }

    async setHwid(license: string, hwid: string): Promise<LICENSE_UPDATE>  {
        try {
            const hwidAlreadyRegistred = !!(await this.collection.findOne({
                linkedHwid: hwid
            }));
            if (hwidAlreadyRegistred) {
                return LICENSE_UPDATE.NOT_VALID;
            }
            const document = await this.collection.findOne({
                licenseBlob: license
            });
            
            if (!document) {
                return LICENSE_UPDATE.NOT_FOUND;
            }
            if (document.lastRegister && !hasDaysPassed(document.lastRegister, 1)) {
                return LICENSE_UPDATE.LOCKED;
            }

            const oldHwid = document.linkedHwid;
            if (!document.expirestAt) {
                await this.collection.updateOne({
                    licenseBlob: license
                }, {
                    $set: {
                        expirestAt: addDays(30),
                        newType: true
                    }
                });
            }

            await this.collection.updateOne({
                licenseBlob: license
            }, {
                $set: {
                    linkedHwid: hwid,
                    lastRegister: Date.now()
                }
            });
            await registerHwidUpdate((oldHwid || ""), hwid, license);
            return LICENSE_UPDATE.SUCESS;
        } catch (error: any) {
            console.log(`❌ Erro ao atualizar hwid da licença ${license}: ${error} - ${error.stack}`);
            return LICENSE_UPDATE.DB_OPERATION_FAILED;
        }
    }

    async validateHwid(hwid: string) {
        try {
            const licenseDetails = await this.collection.findOne({ linkedHwid: hwid });
            if (!licenseDetails) {
                await registerLogin(hwid, false);
                return false;
            }
            if (!licenseDetails?.expirestAt) {
                await registerLogin(hwid, true);
                return true;
            }
            if (isTimestampInPast(licenseDetails.expirestAt)) {
                await registerLogin(hwid, false);
                return false;
            }
            await registerLogin(hwid, true);
            return true;
        } catch (error: any) {
            console.log(`Erro na validação do hwid ${hwid}: ${error} - ${error.stack}`);
            return false;
        }
    }

    async getLicense(license: string) {
        try {
            const document = await this.collection.findOne({ licenseBlob: license });
            return document;
        } catch (error: any) {
            console.log(`Falha ao obter licença ${license}: ${error} - ${error.stack}`);
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