import { AutenticacionService } from './../../../services/autenticacion.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { HistoricoUsuariosMidService } from 'src/app/services/historico-usuarios-mid.service';
import { TercerosService } from 'src/app/services/terceros.service';
import { UsuarioNoEncontradoComponent } from '../usuario-no-encontrado/usuario-no-encontrado.component';

export interface RolRegistro {
  Nombre: string;
  Id: number;
}

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.scss'],
})
export class RegistrarUsuarioComponent {
  @ViewChild('documentoInput') documentoInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;

  roles: RolRegistro[] = [];
  nombreCompleto: string = '';
  identificacion: string = '';
  fechaInicioValue = ' ';
  fechaFinValue = ' ';

  constructor(
    private historico_service: HistoricoUsuariosMidService,
    private terceros_service: TercerosService,
    private autenticacionService: AutenticacionService,
    private dialog: MatDialog
  ) {
    this.historico_service.get('roles/').subscribe({
      next: (data: any) => {
        this.roles = data;
      },
    });
  }

  BuscarTercero(documento: string) {
    console.log('Documento para tercero:', documento);
    this.terceros_service
      .get(`tercero/identificacion?query=${documento}`)
      .subscribe({
        next: (data: any) => {
          console.log('Datos del tercero:', data);
          if (
            data &&
            data.length > 0 &&
            data[0].Tercero &&
            data[0].Tercero.NombreCompleto
          ) {
            this.nombreCompleto = data[0].Tercero.NombreCompleto;
            console.log('Nombre Completo:', this.nombreCompleto);
          } else {
            this.usuarioNoExisteModal();
          }
        },
        error: (err: any) => {
          console.error('Error al consultar el documento:', err);
          this.usuarioNoExisteModal();
        },
      });
  }

  BuscarDocumento(documento: string) {
    if (!documento) {
      this.usuarioNoExisteModal();
      return;
    }
    console.log('Documento:', documento);
    this.autenticacionService
      .getDocumento(`token/documentoToken`, documento)
      .subscribe({
        next: (data: any) => {
          console.log('Datos del usuario:', data);
          if (data && data.documento) {
            this.identificacion = data.documento;
            console.log('Identificacion:', this.identificacion);
            this.BuscarTercero(this.identificacion);
            this.emailInput.nativeElement.value = data.email;
          } else {
            //this.usuarioNoExisteModal();
          }
        },
        error: (err: any) => {
          console.error('Error al consultar el documento:', err);
          this.usuarioNoExisteModal();
        },
      });
  }

  BuscarCorreo(correo: string) {
    if (!correo) {
      this.usuarioNoExisteModal();
      return;
    }
    console.log('Correo:', correo);
    this.autenticacionService.getEmail(`token/userRol`, correo).subscribe({
      next: (data: any) => {
        console.log('Datos del usuario:', data);
        if (data && data.documento) {
          this.identificacion = data.documento;
          console.log('identificacion:', this.identificacion);
          this.BuscarTercero(this.identificacion);
          this.documentoInput.nativeElement.value = this.identificacion;
        } else {
          //this.usuarioNoExisteModal();
        }
      },
      error: (err: any) => {
        console.error('Error al consultar el correo:', err);
        this.usuarioNoExisteModal();
      },
    });
  }

  usuarioNoExisteModal(): void {
    this.dialog.open(UsuarioNoEncontradoComponent, {
      width: '400px',
    });
  }

  printFormData(): void {
    if (this.printFormData) {
      console.log('Form Data:', this.printFormData);
      alert(JSON.stringify(this.printFormData, null, 2));
    }
  }
}
