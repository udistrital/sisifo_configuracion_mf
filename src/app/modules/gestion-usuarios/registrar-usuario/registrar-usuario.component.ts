import { Component } from '@angular/core';

import { HistoricoUsuariosMidService } from 'src/app/services/historico-usuarios-mid.service';

export interface RolRegistro {
  Nombre: string;
  Id:     number;
}

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.scss']
})
export class RegistrarUsuarioComponent {

   roles: RolRegistro[] =[]

  fechaInicioValue= " ";
  fechaFinValue= " ";

  constructor(private historico_service: HistoricoUsuariosMidService){
    this.historico_service.get("roles/").subscribe({
      next:(data: any)=>{
        this.roles=data
      }
    })
  }

  BuscarDocumento(documento: string) {
    console.log('Documento:', documento);
    
  }

  BuscarCorreo(correo: string) {
    console.log('Correo:', correo);
    
  }

  
  printFormData(): void {
    if (this.printFormData) {
      console.log('Form Data:', this.printFormData);
      alert(JSON.stringify(this.printFormData, null, 2)); // Muestra los datos en un alert
    }
  }

}
