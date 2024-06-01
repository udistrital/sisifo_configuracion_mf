import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionRolesRoutingModule } from './gestion-roles-routing.module';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { FormRolesComponent } from './form-roles/form-roles.component'
import { HttpClientModule,  provideHttpClient } from '@angular/common/http';

//Material
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    UsuariosComponent,
    FormRolesComponent
  ],
  imports: [
    CommonModule,
    GestionRolesRoutingModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule
  ]
})
export class GestionRolesModule { }
