import {
  Usuario,
  Rol,
} from './../../gestion-roles/utils/gestion-usuarios.models';
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
  fechaInicioValue!: Date;
  fechaFinValue!: Date;

  constructor(
    private historico_service: HistoricoUsuariosMidService,
    private terceros_service: TercerosService,
    private autenticacionService: AutenticacionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.obtenerRoles();
  }
  obtenerRoles(): void {
    this.historico_service.get('roles/').subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response.Data)) {
          this.roles = response.Data;
        } else {
          console.error(
            'La respuesta no contiene una propiedad Data que sea un array.'
          );
          this.roles = [];
        }
      },
      error: (err: any) => {
        console.error('Error al obtener roles:', err);
      },
    });
  }

  crearUsuario(
    documento: string,
    fechaInicio: Date,
    fechaFin: Date,
    rolId: number,
    email: string
  ) {
    const fechaInicioFormato = fechaInicio.toISOString().split('T')[0];
    const fechaFinFormato = fechaFin.toISOString().split('T')[0];
    const usuario = {
      Documento: documento,
    };
    const nombreRol = this.roles.find((r) => r.Id === rolId)?.Nombre || '';

    this.historico_service.post('usuarios/', usuario).subscribe({
      next: (response: any) => {
        const periodo = {
          FechaFin: fechaFinFormato,
          FechaInicio: fechaInicioFormato,
          Finalizado: false,
          RolId: { Id: rolId },
          UsuarioId: { Id: response.Data.Id },
        };
        this.historico_service
          .post('periodos-rol-usuarios/', periodo)
          .subscribe({
            next: (response: any) => {
              console.log('Periodo creado:', response);
            },
            error: (err: any) => {
              console.error('Error al crear periodo:', err);
            },
          });
        this.autenticacionService
          .PostAddRol('rol/add', nombreRol, email)
          .subscribe({
            next: (response: any) => {
              console.log('Rol creado:', response);
            },
            error: (err: any) => {
              console.error('Error al crear rol:', err);
            },
          });
      },
      error: (err: any) => {
        console.error('Error al crear usuario:', err);
      },
    });
  }

  BuscarTercero(documento: string) {
    this.terceros_service
      .get(`tercero/identificacion?query=${documento}`)
      .subscribe({
        next: (data: any) => {
          if (
            data &&
            data.length > 0 &&
            data[0].Tercero &&
            data[0].Tercero.NombreCompleto
          ) {
            this.nombreCompleto = data[0].Tercero.NombreCompleto;
          } else {
            this.usuarioNoExisteModal();
          }
        },
        error: (err: any) => {
          this.usuarioNoExisteModal();
        },
      });
  }

  BuscarDocumento(documento: string) {
    if (!documento) {
      this.usuarioNoExisteModal();
      return;
    }

    this.autenticacionService
      .getDocumento(`token/documentoToken`, documento)
      .subscribe({
        next: (data: any) => {
          if (data && data.documento) {
            this.identificacion = data.documento;

            this.BuscarTercero(this.identificacion);
            this.emailInput.nativeElement.value = data.email;
          } else {
            this.usuarioNoExisteModal();
          }
        },
        error: (err: any) => {
          this.usuarioNoExisteModal();
        },
      });
  }

  BuscarCorreo(correo: string) {
    if (!correo) {
      this.usuarioNoExisteModal();
      return;
    }

    this.autenticacionService.getEmail(`token/userRol`, correo).subscribe({
      next: (data: any) => {
        if (data && data.documento) {
          this.identificacion = data.documento;

          this.BuscarTercero(this.identificacion);
          this.documentoInput.nativeElement.value = this.identificacion;
        } else {
          this.usuarioNoExisteModal();
        }
      },
      error: (err: any) => {
        this.usuarioNoExisteModal();
      },
    });
  }

  usuarioNoExisteModal(): void {
    this.dialog.open(UsuarioNoEncontradoComponent, {
      width: '400px',
    });
  }
}
