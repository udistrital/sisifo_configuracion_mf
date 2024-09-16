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
import { ImplicitAutenticationService } from 'src/app/services/implicit-autentication.service';


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
    private authService: ImplicitAutenticationService,
    private modalService: ModalService
  ) {}

  ngOnInit() {

    this.authService.getRole().then(roles => {
      this.permisoEdicion = this.authService.PermisoEdicion(roles);
      console.log('Permiso de edición:', this.permisoEdicion);
      this.permisoConsulta = this.authService.PermisoConsulta(roles);
      console.log('Permiso de consulta:', this.permisoConsulta);
      if (!this.permisoEdicion) {
        this.displayedColumns = this.displayedColumns.filter(col => col !== 'acciones');
      }
    }).catch(error => {
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

    // Inicializamos el filtro con funciones predicadas personalizadas
    //this.dataSource.filterPredicate = this.customFilterPredicate();

  }

  ngAfterViewInit() {   
    this.paginator.page.subscribe(() => {      
      const limit = this.paginator.pageSize;
      const offset = this.paginator.pageIndex * limit;
      if (this.formUsuarios.get('documento')?.value) {
        this.BuscarDocumento(this.formUsuarios.get('documento')?.value, limit, offset);
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
            this.modalService.mostrarModal('No se encontraron periodos.', 'warning','error');
          }
        },
        error: (err: any) => {
          this.modalService.mostrarModal(
            'Ocurrió un error al intentar obtener los periodos. Inténtalo nuevamente.', 'warning','error'
          );
        },
      });
  }

  BuscarDocumento(documento: string, limit: number, offset: number) {
    if (!documento) {
      this.modalService.mostrarModal('Por favor, ingresa un documento válido.', 'warning', 'error');
      return;
    }
    this.loading = true;

    this.autenticacionService
      .getPeriodos(
        `rol/user/${documento}/periods?query=sistema_informacion:${this.sistemaInformacion}&limit=${limit}&offset=${offset}`
      )
      .subscribe({
        next: (response: ApiResponse) => {
          this.loading = false;
          if (response.Success && response.Data && response.Data.length > 0) {
            this.dataSource.data = response.Data;
            this.total = response.Metadata.Count;
            this.changeDetector.detectChanges();
          } else {
            this.modalService.mostrarModal(
              `No se encontraron periodos para el documento ingresado.`, 'warning','error'
            );
          }
        },
        error: (err: any) => {
          this.loading = false;
          this.modalService.mostrarModal(
            `Ocurrió un error al buscar el documento ingresado. Inténtalo nuevamente.`, 'warning','error'
          );
        },
      });
  }
  // BuscarCorreo(correo: string) {
  //   if (!correo) {
  //     this.modalService.mostrarModal('Por favor, ingresa un documento válido.', 'warning', 'error');
  //     return;
  //   }

  //   this.autenticacionService.getEmail(`token/userRol`, correo).subscribe({
  //     next: (data: any) => {
  //       if (data && data.documento) {
  //         this.identificacion = data.documento;

  //         this.BuscarTercero(this.identificacion);
  //         this.documentoInput.nativeElement.value = this.identificacion;
  //       } else {
  //         this.modalService.mostrarModal();
  //       }
  //     },
  //     error: (err: any) => {
  //       this.modalService.mostrarModal();
  //     },
  //   });
  // }

  edit(documento: string, id_periodo: number) {
    this.router.navigate(['/gestion-usuarios/actualizar-usuario'], {
      queryParams: { documento, id_periodo },
    });
  }

  delete(element: UserData) {
    console.log('Delete', element);
  }

  applyDocumentFilter() {
    // Implementa la lógica para filtrar documentos aquí
    console.log('Filtro de documento aplicado');
  }

  applyRoleFilter(event: MatSelectChange) {
    const filterValue = event.value === 'all' ? '' : event.value;
    this.dataSource.filter = JSON.stringify({
      role: filterValue,
      state: this.currentStateFilter,
    });
  }

  applyStateFilter(event: MatSelectChange) {
    const filterValue = event.value === 'all' ? '' : event.value.toString();
    this.dataSource.filter = JSON.stringify({
      role: this.currentRoleFilter,
      state: filterValue,
    });
  }

  get currentRoleFilter() {
    const currentFilter = this.dataSource.filter
      ? JSON.parse(this.dataSource.filter)
      : {};
    return currentFilter.role || '';
  }

  get currentStateFilter() {
    const currentFilter = this.dataSource.filter
      ? JSON.parse(this.dataSource.filter)
      : {};
    return currentFilter.state || '';
  }

  // customFilterPredicate() {
  //   return (data: UserData, filter: string): boolean => {
  //     const filterObj = JSON.parse(filter);
  //     const matchRole = filterObj.role ? data.rolUsuario === filterObj.role : true;
  //     const matchState = filterObj.state ? data.estado.toString() === filterObj.state : true;
  //     return matchRole && matchState;
  //   };
  // }
}