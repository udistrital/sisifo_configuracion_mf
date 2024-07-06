import { Injectable } from '@angular/core';
import { RequestManager } from '../managers/requestManager';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('AUTENTICACION');
  }
 
  getEmail(email: string): any {
    this.requestManager.setPath('AUTENTICACION');
    const payload = { user: email };
    return this.requestManager.post('', payload);
  }
}
