import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

const SECRET_KEY = 'j0r633nr1qu3m0j1c4m4r71n32';
@Injectable({
  providedIn: 'root'
})
export class EncryptService {

  constructor() { }

  encrypt(data) {
    data = CryptoJS.AES.encrypt(data, SECRET_KEY);
    data = data.toString();
    return data;
  }
  decrypt(data) {
    data = CryptoJS.AES.decrypt(data, SECRET_KEY);
    data = data.toString(CryptoJS.enc.Utf8);
    return data;
  }

}
