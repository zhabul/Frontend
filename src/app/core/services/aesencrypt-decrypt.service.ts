import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

@Injectable({
  providedIn: 'root'
})
export class AESEncryptDecryptService {

  secretKey = "YourSecretKeyForEncryption&Descryption";
  constructor() { }

  encrypt(value : string) : string{
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  decrypt(textToDecrypt : string){
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }

  sha256(textToDecrypt : string) {
    const hashDigest = sha256(textToDecrypt);
    return Base64.stringify(hashDigest);
  }
}