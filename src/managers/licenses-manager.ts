import LicenseModel from "@/models/license";

export enum LICENSE_UPDATE {
    NOT_FOUND = 0,
    SUCESS = 1,
    LOCKED = -1
}

const has24HoursPassed = (timestamp1: number, timestamp2: number): boolean => Math.abs(timestamp2 - timestamp1) >= 24 * 60 * 60 * 1000;

export const generateNew = async () => {
    try {
        const newLicense = await LicenseModel.create({
        });
        await newLicense.save();
        return newLicense.toObject();
    } catch (error) {
        console.log("Erro ao gerar nova licença: ", error);
    }
}

export const setHwid = async (license: string, hwid: string) => {
    try {
        const licenseDetails = await LicenseModel.findOne({ licenseBlob: license }).lean();
        if (!licenseDetails) {
            return LICENSE_UPDATE.NOT_FOUND;
        }
        if (licenseDetails.lastRegister) {
            return LICENSE_UPDATE.LOCKED;
        }
        await LicenseModel.updateOne({
            licenseBlob: license
        }, {
            $set: {
                linkedHwid: hwid,
                lastRegister: Date.now()
            }
        });
        return LICENSE_UPDATE.SUCESS
    } catch (error) {
        console.log("Erro ao atualizar licença: ", error);
    }
}

export const validateHwid = async (hwid: string) => {
    try {
        const isValid = await LicenseModel.exists({ linkedHwid: hwid });
        return isValid;
    } catch (error) {
        console.log("Erro ao validar licença: ", error);
        return false;
    } 
}
export const getLicense = async (license: string) => {
    try {
        const licenseDetails = await LicenseModel.findOne({ licenseBlob: license });
        return licenseDetails?.toObject();
    } catch (error) {
        console.log("Erro ao obter licença: ", error);
    }
}