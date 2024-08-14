import { Usuario } from './../../gestion-roles/utils/gestion-usuarios.models';
import { AutenticacionService } from './../../../services/autenticacion.service';
import {
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { HistoricoUsuariosMidService } from 'src/app/services/historico-usuarios-mid.service';
import { TercerosService } from 'src/app/services/terceros.service';
import { UsuarioNoEncontradoComponent } from '../usuario-no-encontrado/usuario-no-encontrado.component';
import { ActivatedRoute } from '@angular/router';

export interface RolRegistro {
  Nombre: string;
  Id: number;
}

@Component({
  selector: 'app-actualizar-usuario',
  templateUrl: './actualizar-usuario.component.html',
  styleUrls: ['./actualizar-usuario.component.scss'],
})
export class ActualizarUsuarioComponent {
  @ViewChild('documentoInput') documentoInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('rolInput') rolInput!: ElementRef;

  roles: RolRegistro[] = [];
  nombreCompleto: string = '';
  identificacion: string = '';
  fechaInicioRol: Date | null = null;
  fechaFinRol: Date | null = null;
  nombreRol!: string;
  email!: string;
  idPeriodo!: number;
  idRol!: number;
  usuarioId!: number;
  estadoPeriodo: string = '';

  constructor(
    private historico_service: HistoricoUsuariosMidService,
    private terceros_service: TercerosService,
    private autenticacionService: AutenticacionService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((params) => {
      const documento = params['documento'];
      const id_periodo = params['id_periodo'];
      if (documento && id_periodo) {
        this.documentoInput.nativeElement.value = documento;
        this.BuscarDocumento(documento, id_periodo);
        this.cdr.detectChanges();
      }
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
            this.cdr.detectChanges();
          } else {
            this.usuarioNoExisteModal();
          }
        },
        error: (err: any) => {
          this.usuarioNoExisteModal();
        },
      });
  }

  BuscarDocumento(documento: string, idPeriodo: number) {
    if (!documento) {
      this.usuarioNoExisteModal();
      return;
    }

    this.idPeriodo = idPeriodo;

    this.autenticacionService
      .getDocumento(`token/documentoToken`, documento)
      .subscribe({
        next: (data: any) => {
          if (data && data.documento) {
            this.identificacion = data.documento;
            this.emailInput.nativeElement.value = data.email;
            this.BuscarTercero(this.identificacion);

            this.cdr.detectChanges();
            this.InfoPeriodo(idPeriodo);
          } else {
            this.usuarioNoExisteModal();
          }
        },
        error: (err: any) => {
          this.usuarioNoExisteModal();
        },
      });
  }

  InfoPeriodo(idPeriodo: number) {
    this.historico_service.get(`periodos-rol-usuarios/${idPeriodo}`).subscribe({
      next: (data: any) => {
        this.idRol = data.Data.RolId.Id;
        this.fechaInicioRol = new Date(data.Data.FechaInicio + 'T00:00:00');
        this.fechaFinRol = new Date(data.Data.FechaFin + 'T00:00:00');
        this.usuarioId = data.Data.UsuarioId.Id;
        this.nombreRol = data.Data.RolId.Nombre;
        this.rolInput.nativeElement.value = this.nombreRol;
        this.email = this.emailInput?.nativeElement?.value || '';
        this.idPeriodo = idPeriodo;
      },
    });
  }

  ActualizarPeriodo() {
    if (this.estadoPeriodo === 'Finalizado') {
      this.autenticacionService
        .PostRol('rol/remove', this.nombreRol, this.email)
        .subscribe({
          next: (response: any) => {
            console.log('Rol eliminado:', response);

            this.historico_service
              .put(`periodos-rol-usuarios/${this.idPeriodo}`, {
                FechaInicio: this.fechaInicioRol?.toISOString().split('T')[0],
                FechaFin: this.fechaFinRol?.toISOString().split('T')[0],
                Finalizado: true,
                RolId: {
                  Id: this.idRol,
                },
                UsuarioId: {
                  Id: this.usuarioId,
                },
              })
              .subscribe({
                next: (response: any) => {
                  console.log('Periodo actualizado:', response);
                },
                error: (err: any) => {
                  console.error('Error al actualizar periodo:', err);
                },
              });
          },
          error: (err: any) => {
            console.error('Error al eliminar rol:', err);
          },
        });
    } else {
      console.log('El estado no es "Finalizado", no se realizan cambios.');
    }
  }

  usuarioNoExisteModal(): void {
    this.dialog.open(UsuarioNoEncontradoComponent, {
      width: '400px',
    });
  }

  estados = ['Finalizado'];
}
