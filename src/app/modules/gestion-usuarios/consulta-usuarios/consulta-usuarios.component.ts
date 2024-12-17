import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { TercerosService } from 'src/app/services/terceros.service';
import { HistoricoUsuariosMidService } from 'src/app/services/historico-usuarios-mid.service';
import { environment } from 'src/environments/environment';
import { ModalService } from 'src/app/services/modal.service';

import { Router } from '@angular/router';
import { ImplicitAuthenticationService } from 'src/app/services/implicit-authentication.service';
import { catchError, map, of, switchMap } from 'rxjs';


interface UserData {
  nombre: string;
  documento: string;
  correo: string;
  rol_usuario: string;
  estado: boolean;
  fecha_inicial: string;
  fecha_final: string;
  finalizado: boolean;
}
interface ApiResponse {
  Success: boolean;
  Status: number;
  Message: string;
  Metadata: any;
  Data: UserData[];
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './consulta-usuarios.component.html',
  styleUrls: ['./consulta-usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  loading: boolean = false;
  @ViewChild('documentoInput') documentoInput!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  formUsuarios!: FormGroup;
  identificacion: string = '';
  nombreCompleto: string = '';
  displayedColumns: string[] = [
    'nombre',
    'documento',
    'correo',
    'rolUsuario',
    'estado',
    'fechaInicial',
    'fechaFinal',
    'finalizado',
    'acciones',
  ];
  dataSource = new MatTableDataSource<UserData>([]);
  sistemaInformacion!: number;
  total!: number;
  opcionesPagina: number[] = [2, 4, 6];
  permisoEdicion: boolean = false;
  permisoConsulta: boolean = false;

  roles: string[] = ['Administrador', 'Usuario Estándar'];

  constructor(
    private fb: FormBuilder,
    private terceros_service: TercerosService,
    private autenticacionService: AutenticacionService,
    private historico_service: HistoricoUsuariosMidService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private authService: ImplicitAuthenticationService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.authService
      .getRole()
      .then((roles) => {
        this.permisoEdicion = this.authService.PermisoEdicion(roles);
        console.log('Permiso de edición:', this.permisoEdicion);
        this.permisoConsulta = this.authService.PermisoConsulta(roles);
        console.log('Permiso de consulta:', this.permisoConsulta);
        if (!this.permisoEdicion) {
          this.displayedColumns = this.displayedColumns.filter(
            (col) => col !== 'acciones'
          );
        }
      })
      .catch((error) => {
        console.error('Error al obtener los roles del usuario:', error);
      });

    this.formUsuarios = this.fb.group({
      documento: ['', [Validators.required]],
    });

    this.formUsuarios.valueChanges.subscribe((value) => {
      console.log('Formulario actualizado:', value);
    });

    this.sistemaInformacion = environment.SISTEMA_INFORMACION_ID;
    this.PeriodosUsuario(this.sistemaInformacion, this.opcionesPagina[0], 0);

  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      const limit = this.paginator.pageSize;
      const offset = this.paginator.pageIndex * limit;
      if (this.formUsuarios.get('documento')?.value) {
        this.BuscarDocumento(
          this.formUsuarios.get('documento')?.value,
          limit,
          offset
        );
      } else {
        this.PeriodosUsuario(this.sistemaInformacion, limit, offset);
      }
    });
  }

  onSubmit() {
    if (this.formUsuarios.valid) {
      console.log('Formulario válido:', this.formUsuarios.value);
    } else {
      console.log('Formulario no válido');
    }
  }

  IniciarPaginacion() {
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.opcionesPagina[0];
  }

  PeriodosUsuario(sistema: number, limit: number, offset: number) {
    this.loading = true;
    this.autenticacionService
      .getPeriodos(
        `rol/periods?query=sistema_informacion:${sistema}&limit=${limit}&offset=${offset}`
      )
      .subscribe({
        next: (response: ApiResponse) => {
          this.loading = false;
          if (response.Success && response.Data && response.Data.length > 0) {
            this.dataSource.data = response.Data;
            this.total = response.Metadata.Count;
            this.changeDetector.detectChanges();
          } else {
            this.loading = false;
            this.modalService.mostrarModal(
              'No se encontraron periodos.',
              'warning',
              'error'
            );
          }
        },
        error: (err: any) => {
          this.modalService.mostrarModal(
            'Ocurrió un error al intentar obtener los periodos. Inténtalo nuevamente.',
            'warning',
            'error'
          );
        },
      });
  }

  BuscarDocumento(input: string, limit: number, offset: number) {
    if (!input) {
      this.modalService.mostrarModal(
        'Por favor, ingresa un dato valido.',
        'warning',
        'error'
      );
      return;
    }
    this.loading = true;
    const esEmail = (dato: string): boolean => dato.includes('@');

    const documento$ = esEmail(input)
      ? this.autenticacionService.getEmail(`token/userRol`, input).pipe(
          map((data: any) => {
            if (data?.documento) {
              return data.documento;
            } else if (data?.System?.Error === "Usuario no registrado") {
              throw new Error('Usuario no encontrado.');
            } else {
              throw new Error(data?.Message);
            }
          }),
          catchError((error) => {
            this.modalService.mostrarModal(
              'No se pudo procesar la solicitud.',
              'warning',
              'error'
            );
            this.loading = false;
            return of(null);
          })
        )
      : of(input);

    documento$
      .pipe(
        switchMap((documento: string | null) => {
          if (!documento) {
            return of(null);
          }
          return this.autenticacionService.getPeriodos(
            `rol/user/${documento}/periods?query=sistema_informacion:${this.sistemaInformacion}&limit=${limit}&offset=${offset}`
          );
        })
      )
      .subscribe({
        next: (response: ApiResponse | null) => {
          this.loading = false;
          if (!response) return;
          if (response.Success && response.Data.length > 0) {
            this.dataSource.data = response.Data;
            this.total = response.Metadata.Count;
            this.changeDetector.detectChanges();
          } else {
            this.modalService.mostrarModal(
              `No se encontraron periodos para el documento ingresado.`,
              'warning',
              'error'
            );
          }
        },
        error: (err: any) => {
          this.loading = false;
          this.modalService.mostrarModal(
            `Ocurrió un error al buscar el documento ingresado. Inténtalo nuevamente.`,
            'warning',
            'error'
          );
        },
      });
  } 

  EliminarPeriodo(id_periodo: number) {
    this.modalService
      .modalConfirmacion(
        'El periodo del usuario será eliminado',
        'warning',
        '¿Deseas continuar?'
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.loading = true;
          this.historico_service
            .delete('periodos-rol-usuarios/', id_periodo)
            .subscribe({
              next: (data: any) => {
                this.loading = false;
                this.IniciarPaginacion();
                this.PeriodosUsuario(
                  this.sistemaInformacion,
                  this.opcionesPagina[0],
                  0
                );
                this.modalService.mostrarModal(
                  'El periodo del usuario ha sido eliminado.',
                  'success',
                  'Eliminado'
                );
              },
              error: (err: any) => {
                this.loading = false;
                this.modalService.mostrarModal(
                  'Ocurrio un error al intentar eliminar el periodo del usuario. Intente nuevamente.',
                  'error',
                  'error'
                );
              },
            });
        }
      });
  }

  edit(documento: string, id_periodo: number) {
    this.router.navigate(['/gestion-usuarios/actualizar-usuario'], {
      queryParams: { documento, id_periodo },
    });
  } 
  
}