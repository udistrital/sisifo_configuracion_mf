import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionRolesRoutingModule } from './gestion-roles-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormRolesComponent } from './form-roles/form-roles.component'
import { HttpClientModule,  provideHttpClient } from '@angular/common/http';

//Material
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
@NgModule({
  declarations: [
    FormRolesComponent
  ],
  imports: [
    CommonModule,
    GestionRolesRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule
    
  ]
})
export class GestionRolesModule { }
