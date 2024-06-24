import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

interface UserData {
  nombre: string;
  documento: string;
  correo: string;
  rolUsuario: string;
  estado: boolean;
  fechaInicial: Date;
  fechaFinal: Date;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  formUsuarios!: FormGroup;
  displayedColumns: string[] = ['nombre', 'documento', 'correo', 'rolUsuario', 'estado', 'fechaInicial', 'fechaFinal', 'acciones'];
  dataSource = new MatTableDataSource<UserData>([
    { 
      nombre: 'John', 
      documento: '123456789', 
      correo: 'johndoe@example.com', 
      rolUsuario: 'Administrador', 
      estado: true, 
      fechaInicial: new Date('2024-06-01'), 
      fechaFinal: new Date('2024-06-30') 
    },
    { 
      nombre: 'Juan', 
      documento: '453456789', 
      correo: 'juandoe@example.com', 
      rolUsuario: 'Usuario Estándar', 
      estado: false, 
      fechaInicial: new Date('2024-05-15'), 
      fechaFinal: new Date('2024-07-15') 
    },
    { 
      nombre: 'Pedro', 
      documento: '789456123', 
      correo: 'pedroejemplo@example.com', 
      rolUsuario: 'Usuario Estándar', 
      estado: true, 
      fechaInicial: new Date('2024-06-10'), 
      fechaFinal: new Date('2024-06-25') 
    },
  ]);

  roles: string[] = ['Administrador', 'Usuario Estándar'];
  
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formUsuarios = this.fb.group({
      correo: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$')]]
    });

    this.formUsuarios.valueChanges.subscribe(value => {
      console.log('Formulario actualizado:', value);
    });

    // Inicializamos el filtro con funciones predicadas personalizadas
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  onSubmit() {
    if (this.formUsuarios.valid) {
      console.log('Formulario válido:', this.formUsuarios.value);
    } else {
      console.log('Formulario no válido');
    }
  }

  edit(element: UserData) {
    console.log('Edit', element);
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

  customFilterPredicate() {
    return (data: UserData, filter: string): boolean => {
      const filterObj = JSON.parse(filter);
      const matchRole = filterObj.role ? data.rolUsuario === filterObj.role : true;
      const matchState = filterObj.state ? data.estado.toString() === filterObj.state : true;
      return matchRole && matchState;
    };
  }
}