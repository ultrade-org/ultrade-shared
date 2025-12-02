export interface IEmailService {
  sendUserConfirmationEmail(email: string, address: string, hash: string, companyName?: string, embeddedAppUrl?: string): Promise<void>;
  sendEmailAboutMaintenanceOnError(service: string, error: string): Promise<void>;
}
