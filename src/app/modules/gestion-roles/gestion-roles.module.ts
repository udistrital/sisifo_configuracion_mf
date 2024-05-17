import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionRolesRoutingModule } from './gestion-roles-routing.module';
import { UsuariosComponent } from './usuarios/usuarios.component';

//Material
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    UsuariosComponent
  ],
  imports: [
    CommonModule,
    GestionRolesRoutingModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class GestionRolesModule { }
