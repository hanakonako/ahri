import type LicenseModel from "@/models/license";
import PaymentModel from "@/models/payments";

declare global {
  namespace Express {
    interface Request {
      models: {
        licenseModel: LicenseModel;
        paymentModel: PaymentModel
      };
    }
  }
}