import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { dynamicFormComponent } from './dynamic-form/dynamic-form.component';


const routes: Routes = [
  {
    path: 'formulario',
    component: dynamicFormComponent,
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionRolesRoutingModule { }
