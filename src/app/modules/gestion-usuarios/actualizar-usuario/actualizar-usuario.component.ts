import { Component } from '@angular/core';

import { HistoricoUsuariosMidService } from 'src/app/services/historico-usuarios-mid.service';


export interface RolRegistro {
  Nombre: string;
  Id:     number;
}

@Component({
  selector: 'app-actualizar-usuario',
  templateUrl: './actualizar-usuario.component.html',
  styleUrls: ['./actualizar-usuario.component.scss'],
})
export class ActualizarUsuarioComponent {
  roles: RolRegistro[] = [];

  constructor(private historico_service: HistoricoUsuariosMidService) {
    this.historico_service.get('roles/').subscribe({
      next: (data: any) => {
        this.roles = data;
      },
    });
  }

  BuscarDocumento(documento: string) {
    console.log('Documento:', documento);
  }

  BuscarCorreo(correo: string) {
    console.log('Correo:', correo);
  }

  
  estados = ['ACTIVO', 'INACTIVO'];
}
