
export interface IKmsService {
  decrypt(value: string): Promise<string>;
  encrypt(value: string): Promise<string>;
}
