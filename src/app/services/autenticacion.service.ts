import { Injectable } from '@angular/core';
import { RequestManager } from '../managers/requestManager';

@Injectable({
  providedIn: 'root'
})

export class AutenticacionService {

  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('AUTENTICACION');
  }
 
  getEmail(endpoint: any, email: string): any {
    this.requestManager.setPath('AUTENTICACION');
    console.log("path:", this.requestManager);
    const payload = { user: email };
    return this.requestManager.post(endpoint, payload);
  }

  getDocumento(endpoint: any, documento: string): any {
    this.requestManager.setPath('AUTENTICACION');
    console.log("path:", this.requestManager);
    const payload = { numero: documento };
    return this.requestManager.post(endpoint, payload);
  }

  getPeriodos(endpoint: any): any {
    this.requestManager.setPath('AUTENTICACION');
    console.log("path:", this.requestManager);
    return this.requestManager.get(endpoint);
  }

  PostRol(endpoint: any, rol: string, user: string): any {
  this.requestManager.setPath('AUTENTICACION');
  console.log("path:", this.requestManager);
  const payload = { rol: rol, user: user };
  return this.requestManager.post(endpoint, payload);
  }

}
