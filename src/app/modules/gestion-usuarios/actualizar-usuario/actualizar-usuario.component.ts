import { Component } from '@angular/core';
import { ROL_ADMINISTRADOR, ROL_ANALISTA, ROL_AUDITOR, ROL_EJECUTOR, ROL_JEFE, ROL_SOPORTE } from '../../gestion-roles/utils';


@Component({
  selector: 'app-actualizar-usuario',
  templateUrl: './actualizar-usuario.component.html',
  styleUrls: ['./actualizar-usuario.component.scss']
})
export class ActualizarUsuarioComponent {

  roles =[
    ROL_ADMINISTRADOR,
    ROL_AUDITOR,
    ROL_EJECUTOR,
    ROL_JEFE,
    ROL_ANALISTA,
    ROL_SOPORTE
  ]

  estados =[
    "ACTIVO",
    "INACTIVO"
  ]

}
