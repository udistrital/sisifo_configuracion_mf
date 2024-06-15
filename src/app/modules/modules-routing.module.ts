import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "components",
    loadChildren: () => import ('./components/components.module').then(m => m.ComponentsModule),
  },
  
  { 
    path: "gestion-roles",
    loadChildren: () => import ('./gestion-roles/gestion-roles.module').then(m => m.GestionRolesModule),
  }

  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ModulesRoutingModule { }