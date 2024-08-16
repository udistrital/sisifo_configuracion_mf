import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { TercerosService } from 'src/app/services/terceros.service';
import { HistoricoUsuariosMidService } from 'src/app/services/historico-usuarios-mid.service';

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
  styleUrls: ['./consulta-usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  @ViewChild('documentoInput') documentoInput!: ElementRef;
  formUsuarios!: FormGroup;
  identificacion: string = '';
  nombreCompleto: string = '';
  displayedColumns: string[] = ['nombre', 'documento', 'correo', 'rolUsuario', 'estado', 'fechaInicial', 'fechaFinal', 'finalizado', 'acciones'];
  dataSource = new MatTableDataSource<UserData>([  ]);

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
      documento: ['', [Validators.required]]
    });

    this.formUsuarios.valueChanges.subscribe(value => {
      console.log('Formulario actualizado:', value);
    });

    this.PeriodosUsuario(10, 0);

    // Inicializamos el filtro con funciones predicadas personalizadas
    //this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  onSubmit() {
    if (this.formUsuarios.valid) {
      console.log('Formulario válido:', this.formUsuarios.value);
    } else {
      console.log('Formulario no válido');
    }
  }


  PeriodosUsuario(limit: number, offset: number) {
    this.autenticacionService
    .getPeriodos(`rol/periods?limit=${limit}&offset=${offset}`)
    .subscribe({
      next: (response: ApiResponse) => {
        if (response.Success && response.Data && response.Data.length > 0) {
          this.dataSource.data = response.Data;
          this.cdr.detectChanges();
          console.log('data:', response.Data);
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
    console.log('documento:', documento);

    this.autenticacionService
    .getPeriodos(`rol/user/${documento}/periods`)
    .subscribe({
      next: (response: ApiResponse) => {
        if (response.Success && response.Data && response.Data.length > 0) {
          this.dataSource.data = response.Data;
          this.cdr.detectChanges();
          console.log('data:', response.Data);
        } else {
          this.usuarioNoExisteModal();
        }
      },
      error: (err: any) => {
        this.usuarioNoExisteModal();
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
    this.router.navigate(['/gestion-usuarios/actualizar-usuario'], { queryParams: { documento, id_periodo } });
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
    this.dataSource.filter = JSON.stringify({ role: filterValue, state: this.currentStateFilter });
  }

  applyStateFilter(event: MatSelectChange) {
    const filterValue = event.value === 'all' ? '' : event.value.toString();
    this.dataSource.filter = JSON.stringify({ role: this.currentRoleFilter, state: filterValue });
  }

  get currentRoleFilter() {
    const currentFilter = this.dataSource.filter ? JSON.parse(this.dataSource.filter) : {};
    return currentFilter.role || '';
  }

  get currentStateFilter() {
    const currentFilter = this.dataSource.filter ? JSON.parse(this.dataSource.filter) : {};
    return currentFilter.state || '';
  }

  usuarioNoExisteModal(): void {
    this.dialog.open(UsuarioNoEncontradoComponent, {
      width: '400px',
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