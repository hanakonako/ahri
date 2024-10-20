import type LicenseModel from "@/models/license";

declare global {
  namespace Express {
    interface Request {
      models: {
        licenseModel: LicenseModel;
      };
    }
  }
}