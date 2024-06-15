import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { GestionRolesRoutingModule } from './components.routing.module';


@NgModule({
  declarations: [
    dynamicFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    GestionRolesRoutingModule
  ],

  exports: [
    dynamicFormComponent 
  ]
})
export class ComponentsModule { }
