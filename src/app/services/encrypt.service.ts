import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptService {

  KEY_WORLD = 'j0r633nr1qu3m0j1c4m4r71n32'
  constructor() { }

  set(value) {
    var key = CryptoJS.enc.Utf8.parse(this.KEY_WORLD);
    var iv = CryptoJS.enc.Utf8.parse(this.KEY_WORLD);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    return encrypted.toString();
  }


  //The get method is use for decrypt the value.
  get(value) {
    if (value) {
      var key = CryptoJS.enc.Utf8.parse(this.KEY_WORLD);
      var iv = CryptoJS.enc.Utf8.parse(this.KEY_WORLD);

      var decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      return decrypted.toString(CryptoJS.enc.Utf8);
    }
    return null
  }
}
