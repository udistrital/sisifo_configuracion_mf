import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "modules",
    loadChildren: () => import ('./modules/modules.module').then(m => m.ModulesModule),
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
