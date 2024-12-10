import { AutenticacionService } from './../../../services/autenticacion.service';
import {Component,ElementRef,ViewChild,ChangeDetectorRef,} from '@angular/core';
import { Router } from '@angular/router';

import { HistoricoUsuariosMidService } from 'src/app/services/historico-usuarios-mid.service';
import { TercerosService } from 'src/app/services/terceros.service';
import { ModalService } from 'src/app/services/modal.service';
import { ActivatedRoute } from '@angular/router';
import { ImplicitAutenticationService } from 'src/app/services/implicit-autentication.service';

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
  loading = false;
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
  permisoEdicion: boolean = false;
  permisoConsulta: boolean = false;

  constructor(
    private historico_service: HistoricoUsuariosMidService,
    private terceros_service: TercerosService,
    private autenticacionService: AutenticacionService,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private authService: ImplicitAutenticationService,
    private modalService: ModalService,
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((params) => {
      const documento = params['documento'];
      const id_periodo = params['id_periodo'];
      if (documento && id_periodo) {
        this.documentoInput.nativeElement.value = documento;
        this.BuscarDocumento(documento, id_periodo);
        this.changeDetector.detectChanges();
      }
    });

    this.authService
      .getRole()
      .then((roles) => {
        this.permisoEdicion = this.authService.PermisoEdicion(roles);
        console.log('Permiso de edición:', this.permisoEdicion);
        this.permisoConsulta = this.authService.PermisoConsulta(roles);
        console.log('Permiso de consulta:', this.permisoConsulta);
      })
      .catch((error) => {
        console.error('Error al obtener los roles del usuario:', error);
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
            this.changeDetector.detectChanges();
          } else {
            this.modalService.mostrarModal('Usuario no encontrado.','warning','error');
          }
          this.loading = false;
        },
        error: (err: any) => {
          this.modalService.mostrarModal('Error al buscar usuario.','warning','error');
          this.loading = false;
        },
      });
  }

  BuscarDocumento(documento: string, idPeriodo: number) {
    if (!documento) {
      this.modalService.mostrarModal('Por favor, ingresa un documento válido.', 'warning','error' );
      return;
    }
    this.loading = true;
    this.idPeriodo = idPeriodo;

    this.autenticacionService
      .getDocumento(`token/documentoToken`, documento)
      .subscribe({
        next: (data: any) => {
          if (data && data.documento) {
            this.identificacion = data.documento;
            this.emailInput.nativeElement.value = data.email;
            this.BuscarTercero(this.identificacion);
            this.changeDetector.detectChanges();
            this.InfoPeriodo(idPeriodo);
          } else {
            this.modalService.mostrarModal('Usuario no encontrado.','warning','error');
          }
          this.loading = false;
        },
        error: (err: any) => {
          this.modalService.mostrarModal('Error al buscar el documento.','warning','error');
          this.loading = false;
        },
      });
  }

  InfoPeriodo(idPeriodo: number) {
    this.loading = true;
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
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar el periodo:', err);
        this.modalService.mostrarModal('Error al cargar el periodo.','warning','error');
        this.loading = false;
      },
    });
  }

  ActualizarPeriodo() {
    if (this.estadoPeriodo === 'Finalizado') {
      this.loading = true;
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
                  this.loading = false;
                  this.modalService.mostrarModal('Periodo actualizado exitosamente.','success','Actualizado');
                },
                error: (err: any) => {
                  console.error('Error al actualizar periodo:', err);
                  this.modalService.mostrarModal('Error al actualizar el periodo.','warning','error');
                  this.loading = false;
                },
              });
          },
          error: (err: any) => {
            console.error('Error al eliminar rol:', err);
            this.modalService.mostrarModal('Error al eliminar el rol.','warning','error');
            this.loading = false;
          },
        });
    } else {
      console.log('El estado no es "Finalizado", no se realizan cambios.');
    }
  }

  regresar() {
    this.router.navigate(['gestion-usuarios/consulta-usuarios']);
  }

  estados = ['Finalizado'];
}
