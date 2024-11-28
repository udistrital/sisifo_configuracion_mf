import { Rol, Usuario } from './../../gestion-roles/utils/gestion-usuarios.models';
import { AutenticacionService } from './../../../services/autenticacion.service';
import { Component, ElementRef, ViewChild } from '@angular/core';

import { HistoricoUsuariosMidService } from 'src/app/services/historico-usuarios-mid.service';
import { TercerosService } from 'src/app/services/terceros.service';
import { ModalService } from 'src/app/services/modal.service';

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
  loading = false;

  constructor(
    private historico_service: HistoricoUsuariosMidService,
    private terceros_service: TercerosService,
    private autenticacionService: AutenticacionService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.obtenerRoles();
  }
  obtenerRoles(): void {
    this.loading = true;
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
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al obtener roles:', err);
        this.modalService.mostrarModal(
          'Error al obtener los roles. Por favor, intenta nuevamente.',
          'warning',
          'error'
        );
        this.loading = false;
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
    this.loading = true;
    console.log('documento', documento);

    this.historico_service.get(`usuarios?query=documento:${documento}`).subscribe({
      next: (response: any) => {
        console.log('response', response);
  
        if (response && response.Data && response.Data.length > 0) {
          console.log('Usuario existente:', response.Data[0]);
  
          // Verificar periodos del usuario
          this.historico_service
            .get(`usuarios/${documento}/periodos`)
            .subscribe({
              next: (periodosResponse: any) => {
                console.log('Periodos del usuario:', periodosResponse);
                
                if (
                  periodosResponse &&
                  periodosResponse.Data &&
                  periodosResponse.Data.length > 0 &&
                  periodosResponse.Data[0].RolId.Id === rolId &&
                  periodosResponse.Data[0].Finalizado === true

                 ) {
                  this.crearPeriodoRol(
                    periodosResponse.Data[0].UsuarioId.Id,
                    fechaInicioFormato,
                    fechaFinFormato,
                    rolId,
                    nombreRol,
                    email
                  );
                
                } else {
                  this.modalService.mostrarModal(
                    'El usuario ya tiene vigente el rol asignado.',
                    'warning',
                    'error'
                  );
                  this.loading = false;
                }
              },
              error: (err: any) => {
                console.error('Error al verificar periodos:', err);
                this.modalService.mostrarModal(
                  'Error al verificar los periodos del usuario.',
                  'warning',
                  'error'
                );
                this.loading = false;
              },
              complete: () => {
                this.loading = false;
              },
            });
        } else {
          console.log('Usuario no existente');
          this.historico_service.post('usuarios/', usuario).subscribe({
            next: (usuarioResponse: any) => {
              console.log('Usuario creado:', usuarioResponse);
              this.crearPeriodoRol(
                usuarioResponse.Data.Id,
                fechaInicioFormato,
                fechaFinFormato,
                rolId,
                nombreRol,
                email
              );
            },
            error: (err: any) => {
              console.error('Error al crear usuario:', err);
              this.modalService.mostrarModal(
                'Error al crear el usuario. Verifica los datos e intenta nuevamente.',
                'warning',
                'error'
              );
              this.loading = false;
            },
          });
        }
      },
      error: (err: any) => {
        console.error('Error al verificar usuario:', err);
        this.modalService.mostrarModal(
          'Error al verificar el usuario. Verifica los datos e intenta nuevamente.',
          'warning',
          'error'
        );
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  private crearPeriodoRol(
    ususarioId: number,
    fechaInicio: string,
    fechaFin: string,
    rolId: number,
    nombreRol: string,
    email: string
  ) {
    const periodo = {
      FechaFin: fechaFin,
      FechaInicio: fechaInicio,
      finalizado: false,
      RolId: { Id: rolId },
      UsuarioId: { Id: ususarioId },
    };


    this.historico_service.post('periodos-rol-usuarios/', periodo).subscribe({
      next: (response: any) => {
        console.log('Periodo creado:', response);
        // this.modalService.mostrarModal(
        //   'Usuario, periodo y rol creados exitosamente.',
        //   'success',
        //   'Creado'
        // );
        this.autenticacionService
          .PostRol('rol/add', nombreRol, email)
          .subscribe({
            next: (response: any) => {
              console.log('Rol asignado:', response);
              this.modalService.mostrarModal(
                'Rol asignado exitosamente.',
                'success',
                'Creado'
              );
            },
            error: (err: any) => {
              console.error('Error al asignar rol:', err);
              this.modalService.mostrarModal(
                'Error al asignar el rol al usuario.',
                'warning',
                'error'
              );
            },
          });
      },
      error: (err: any) => {
        console.error('Error al crear periodo:', err);
        this.modalService.mostrarModal(
          'Error al crear el periodo. Verifica los datos e intenta nuevamente.',
          'warning',
          'error'
        );
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  BuscarTercero(documento: string) {
    this.loading = true;
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
            this.loading = false;
          } else {
            this.modalService.mostrarModal(
              'No se encontraron datos del usuario con el documento proporcionado.',
              'warning',
              'error'
            );
            //this.loading = false;
          }
        },
        error: (err: any) => {
          this.modalService.mostrarModal(
            'No se encontraron datos del usuario ingresado',
            'warning',
            'error'
          );
          this.loading = false;
        },
      });
  }

  BuscarDocumento(documento: string) {
    if (!documento) {
      this.modalService.mostrarModal(
        'Por favor, ingresa un documento válido.',
        'warning',
        'error'
      );
      return;
    }

    this.nombreCompleto = '';
    this.emailInput.nativeElement.value = '';
    

    this.loading = true;
    this.autenticacionService
      .getDocumento(`token/documentoToken`, documento)
      .subscribe({
        next: (data: any) => {
          if (data && data.documento) {
            this.identificacion = data.documento;

            this.BuscarTercero(this.identificacion);
            this.emailInput.nativeElement.value = data.email;
            this.loading = false;
          } else {
            this.modalService.mostrarModal(
              'No se encontraron datos del documento proporcionado.',
              'warning',
              'error'
            );
            this.loading = false;
          }
        },
        error: (err: any) => {
          this.modalService.mostrarModal(
            'No se encontraron datos del usuario ingresado',
            'warning',
            'error'
          );
          this.loading = false;
        },
      });
  }

  BuscarCorreo(correo: string) {
    if (!correo) {
      this.modalService.mostrarModal(
        'Por favor, ingresa un correo válido.',
        'warning',
        'error'
      );
      return;
    }

    this.nombreCompleto = '';
    this.emailInput.nativeElement.value = '';
    this.identificacion = '';

    this.loading = true;
    this.autenticacionService.getEmail(`token/userRol`, correo).subscribe({
      next: (data: any) => {
        if (data && data.documento) {
          this.identificacion = data.documento;

          this.BuscarTercero(this.identificacion);
          this.documentoInput.nativeElement.value = this.identificacion;
          this.loading = false;
        } else {
          this.modalService.mostrarModal(
            'No se encontraron datos asociados al correo proporcionado.',
            'warning',
            'error'
          );
          this.loading = false;
        }
      },
      error: (err: any) => {
        this.modalService.mostrarModal(
          'Error al buscar el correo. Verifica los datos e intenta nuevamente.',
          'warning',
          'error'
        );
        this.loading = false;
      },
    });
  }
}
