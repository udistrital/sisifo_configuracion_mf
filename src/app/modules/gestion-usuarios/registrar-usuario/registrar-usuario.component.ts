import { Component } from '@angular/core';
import { ROL_ADMINISTRADOR, ROL_ANALISTA, ROL_AUDITOR, ROL_EJECUTOR, ROL_JEFE, ROL_SOPORTE } from '../../gestion-roles/utils';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.scss']
})
export class RegistrarUsuarioComponent {

   roles =[
    ROL_ADMINISTRADOR,
    ROL_AUDITOR,
    ROL_EJECUTOR,
    ROL_JEFE,
    ROL_ANALISTA,
    ROL_SOPORTE
  ]

  fechaInicioValue= " ";
  fechaFinValue= " ";

  printFormData(): void {
    if (this.printFormData) {
      console.log('Form Data:', this.printFormData);
      alert(JSON.stringify(this.printFormData, null, 2)); // Muestra los datos en un alert
    }
  }

}
