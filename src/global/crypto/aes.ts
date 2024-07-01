import * as crypto from "crypto";

const AES_256_CBC = "aes-256-cbc";

export const encrpytAES = (text: string): string => {
  const cipher = crypto.createCipheriv(
    AES_256_CBC,
    Buffer.from(process.env.AES_KEY),
    Buffer.from(process.env.AES_IV)
  );
  let encrpyted = cipher.update(text, "utf8", "hex");
  encrpyted += cipher.final("hex");

  return encrpyted;
};

export const decryptAES = (encrpytedText: string): string => {
  const decipher = crypto.createDecipheriv(
    AES_256_CBC,
    Buffer.from(process.env.AES_KEY),
    Buffer.from(process.env.AES_IV)
  );

  let decryted = decipher.update(encrpytedText, "hex", "utf8");
  decryted += decipher.final("utf8");
  
  return decryted;
};
