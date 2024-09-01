import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { TercerosService } from 'src/app/services/terceros.service';
import { HistoricoUsuariosMidService } from 'src/app/services/historico-usuarios-mid.service';
import { environment } from 'src/environments/environment';

import { UsuarioNoEncontradoComponent } from '../usuario-no-encontrado/usuario-no-encontrado.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


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

  roles: string[] = ['Administrador', 'Usuario Estándar'];

  constructor(
    private fb: FormBuilder,
    private terceros_service: TercerosService,
    private autenticacionService: AutenticacionService,
    private historico_service: HistoricoUsuariosMidService,
    private dialog: MatDialog,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.formUsuarios = this.fb.group({
      documento: ['', [Validators.required]],
    });

    this.formUsuarios.valueChanges.subscribe((value) => {
      console.log('Formulario actualizado:', value);
    });

    this.sistemaInformacion = environment.SISTEMA_INFORMACION_ID;
    this.PeriodosUsuario(this.sistemaInformacion, 2, 0);

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
            this.total = 7;
            this.cdr.detectChanges();
            console.log('data:', response.Data);
          } else {
            this.loading = false;
            this.usuarioNoExisteModal('No se encontraron periodos.');
          }
        },
        error: (err: any) => {
          this.usuarioNoExisteModal(
            'Ocurrió un error al intentar obtener los periodos. Inténtalo nuevamente.'
          );
        },
      });
  }

  BuscarDocumento(documento: string, limit: number, offset: number) {
    if (!documento) {
      this.usuarioNoExisteModal('Por favor, ingresa un documento válido.');
      console.log('no hay documento:');
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
            this.total = 3;
            this.cdr.detectChanges();
            console.log('data:', response.Data);
          } else {
            this.usuarioNoExisteModal(
              `No se encontraron periodos para el documento ingresado.`
            );
          }
        },
        error: (err: any) => {
          this.loading = false;
          this.usuarioNoExisteModal(
            `Ocurrió un error al buscar el documento ingresado. Inténtalo nuevamente.`
          );
        },
      });
  }
  // BuscarCorreo(correo: string) {
  //   if (!correo) {
  //     this.usuarioNoExisteModal();
  //     return;
  //   }

  //   this.autenticacionService.getEmail(`token/userRol`, correo).subscribe({
  //     next: (data: any) => {
  //       if (data && data.documento) {
  //         this.identificacion = data.documento;

  //         this.BuscarTercero(this.identificacion);
  //         this.documentoInput.nativeElement.value = this.identificacion;
  //       } else {
  //         this.usuarioNoExisteModal();
  //       }
  //     },
  //     error: (err: any) => {
  //       this.usuarioNoExisteModal();
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

  usuarioNoExisteModal(mensaje: string): void {
    console.log('Mostrando modal con mensaje:', mensaje);
    this.dialog.open(UsuarioNoEncontradoComponent, {
      width: '400px',
      data: { mensaje: mensaje },
    });
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