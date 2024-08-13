import { AutenticacionService } from './../../../services/autenticacion.service';
import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
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

  roles: RolRegistro[] = [];
  nombreCompleto: string = '';
  identificacion: string = '';

  constructor(
    private historico_service: HistoricoUsuariosMidService,
    private terceros_service: TercerosService,
    private autenticacionService: AutenticacionService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      const documento = params['documento'];
      if (documento) {
        this.documentoInput.nativeElement.value = documento;
        this.BuscarDocumento(documento);
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

  usuarioNoExisteModal(): void {
    this.dialog.open(UsuarioNoEncontradoComponent, {
      width: '400px',
    });
  }

  estados = ['Finalizado'];
}
