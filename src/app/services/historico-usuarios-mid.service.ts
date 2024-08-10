import { Injectable } from '@angular/core';
import { RequestManager } from '../managers/requestManager';

@Injectable()

export class HistoricoUsuariosMidService {

  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('HISTORICO_USUARIOS_MID');
  }
  get(endpoint: any): any {
    this.requestManager.setPath('HISTORICO_USUARIOS_MID');
    return this.requestManager.get(endpoint);
  }

  post(endpoint: any, element: any): any {
    this.requestManager.setPath('HISTORICO_USUARIOS_MID');
    return this.requestManager.post(endpoint, element);
  }

}
