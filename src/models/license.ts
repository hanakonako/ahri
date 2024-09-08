import { model, Schema, SchemaType, Types } from "mongoose";
import type { Document  } from "mongoose";
import { nanoid } from "nanoid";

interface License extends Document {
    linkedHwid: string;
    lastAcess?: number;
    licenseBlob: string;
    lastRegister?: number;
}

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