import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
//import { FORM_USUARIOS } from '../../dynamic-form/form-plantilla';
import { FormParams } from '../../components/form-plantilla';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  formParams: FormParams;
  formGroup: FormGroup | undefined;

  constructor() {
    this.formParams = {
      fieldName1: {
        label: 'nombre',
        tipo: 'input',
        requerido: true,
        valor: 'a',
        soloLectura: false,
        tipoDato: 'text',
        claseGrid: 'col-lg-3 col-md-3 col-sm-12 col-xs-12',
      },
        
      fieldName2: {
        label: 'Field 2',
        tipo: 'select',
        requerido: true,
        valor: 'b',
        soloLectura: false,
        tipoDato: 'text',
        claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
        opciones: [{Nombre: 'Nombre'}, {Nombre: 'Correo'}],
      },
      fieldName3: {
        label: 'Descripción',
        tipo: 'textarea',
        requerido: true,
        valor: '',
        soloLectura: false,
        tipoDato: 'text',
        claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
        placeholder: 'Escriba una descripción',
        rows:5,
      },
    };
  }

  ngOnInit(): void {}

  onFormCreated(form: FormGroup): void {
    console.log('Form created:', form);
    this.formGroup = form; // Guarda la referencia al formGroup
  }

  onFormUpdated(form: FormGroup): void {
    console.log('Form updated:', form);
  }

  printFormData(): void {
    if (this.formGroup) {
      console.log('Form Data:', this.formGroup.value);
      alert(JSON.stringify(this.formGroup.value, null, 2)); // Muestra los datos en un alert
    }
  }
}
