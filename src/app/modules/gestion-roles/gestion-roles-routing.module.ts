import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from '../gestion-usuarios/consulta-usuarios/consulta-usuarios.component';
import { FormRolesComponent } from './form-roles/form-roles.component'



const routes: Routes = [
  {
    path: 'form-roles',
    component: FormRolesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionRolesRoutingModule { }
