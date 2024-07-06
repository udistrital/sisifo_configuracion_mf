import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule,  provideHttpClient } from '@angular/common/http';
import { RegistrarUsuarioComponent } from './registrar-usuario/registrar-usuario.component';
import { GestionUsuariosRoutingModule } from './gestion-usuarios-routing.module';

//Material
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { ActualizarUsuarioComponent } from './actualizar-usuario/actualizar-usuario.component';
import { HistoricoUsuariosMidService } from 'src/app/services/historico-usuarios-mid.service';
import { TercerosService } from 'src/app/services/terceros.service';
import { UsuarioNoEncontradoComponent } from './usuario-no-encontrado/usuario-no-encontrado.component';


@NgModule({
  declarations: [
    RegistrarUsuarioComponent,
    ActualizarUsuarioComponent,
    UsuarioNoEncontradoComponent
    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GestionUsuariosRoutingModule,
    HttpClientModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgFor,
    MatCardModule,
    MatFormFieldModule,
    MatDialogModule
  ],
  providers:[
    HistoricoUsuariosMidService,
    TercerosService
  ]
})
export class GestionUsuariosModule { }