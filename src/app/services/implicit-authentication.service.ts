import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class ImplicitAuthenticationService {
  rolesConsulta = environment.ROLES_CONSULTA;
  rolesEdicion = environment.ROLES_CONSULTA_EDICION;
  private userSubject = new BehaviorSubject({});
  public user$ = this.userSubject.asObservable();
  httpOptions: { headers: HttpHeaders; } | undefined;

  constructor(private httpClient: HttpClient) {
    this.init();
  }

  init(): any {
    
    const id_token = window.localStorage.getItem('id_token');

    if (id_token) {
      const id_token_array = id_token.split('.');
      const payload = JSON.parse(atob(id_token_array[1]));
      this.updateAuth(payload);
    }
  }

  updateAuth(payload: { role: string | string[] | null; }) {
    payload.role = this.roles2List(payload.role);
    this.userSubject.next({ user: payload });
  }

  roles2List(roles: string | null | string[]): string[] {
    if (Array.isArray(roles)) {
      return roles;
    } else if (typeof roles === 'string') {
      return [roles];
    } else {
      return [];
    }
  }

  public getRole() {
    return new Promise<string[]>((resolve) => {
      this.user$.subscribe((data: any) => {
        const { user } = data;
        const roles = user.role || [];
        resolve(roles);
      });
    });
  }

  public PermisoEdicion(roles: string[]): boolean {
    return roles.some(rol =>this.rolesEdicion.includes(rol));
  }

  public PermisoConsulta(roles: string[]): boolean {
    return roles.some(rol =>this.rolesConsulta.includes(rol));
  }
}


