// token.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor() { }

  getToken(): string | null {
    return localStorage.getItem('id_token');
  }
}