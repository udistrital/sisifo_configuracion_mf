import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: "gestion-roles",
    loadChildren: () => import ('./modules/gestion-roles/gestion-roles.module').then(m => m.GestionRolesModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: "/configuracion/" },
  provideHttpClient(withFetch())
  ],
})

export class AppRoutingModule { }
