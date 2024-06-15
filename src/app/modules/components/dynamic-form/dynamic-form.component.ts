import { Component, EventEmitter, Injectable, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormParams, Param } from "../form-plantilla"
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
//import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})

export class dynamicFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input('defineForm') defineForm: FormParams= {};
  @Output() subsChanges: EventEmitter<Object> = new EventEmitter();
  @Output() createdForm: EventEmitter<any> = new EventEmitter();
  @Output() updatedForm: EventEmitter<any> = new EventEmitter();

  formFields: string[]=[];
  formGroup!: FormGroup;
  builded: boolean = false;

  constructor (
    private formBuilder: FormBuilder,
    ) {
   
  }
  
  ngOnInit(): void {
  }
  
  // * ----------
  // * Recepción de datos por trigger de cambios en Inputs 
  //#region
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['defineForm']) {
      this.formFields = Object.keys(this.defineForm);
      this.formGroup = this.buildForm(this.defineForm);
      this.suscribeToForm(this.defineForm, this.formGroup);
    }
  }
  //#endregion
  // * ----------

  // * ----------
  // * FormBuilder, check if field or spacers, manage validators, and translate
  //#region
  isField(field: Param): boolean {
    const notField = (field.tipo === 'empty') || (field.tipo === 'separator');
    return !notField;
  }

  buildForm(formParams: FormParams): FormGroup {
    let form: { [key: string]: FormControl } = {};
    const nameFields = Object.keys(formParams);
    nameFields.forEach((name, i) => {
      if (this.isField(formParams[name])) {
        const validate = this.prepareValidators(formParams[name]);
        form[name] = new FormControl(undefined, validate);
      }
      if (i+1 === nameFields.length) {
        this.builded = true;
      }
    });
    const buildedForm = this.formBuilder.group(form);
    
    this.createdForm.emit(buildedForm);
    return buildedForm;
  }

  prepareValidators(f: Param): Validators {
    let validaciones = []
    if (f.requerido) {
      validaciones.push(Validators.required);
    }
    if (f.minimo || f.minimo === 0) {
      validaciones.push(Validators.min(f.minimo));
    }
    if (f.maximo) {
      validaciones.push(Validators.max(f.maximo));
    }
    if (f.validador) {
      f.validador.push(validaciones);
    } else {
      f.validador = validaciones;
    }
    return f.validador;
  }

 
  //#endregion
  // * ----------

  // * ----------
  // * Subscribe to changes and emit events
  //#region
  suscribeToForm(formParams: FormParams, form: FormGroup): void {
    form.valueChanges.subscribe(
      (cambios: Object) => {
        this.emiteCambiosGeneral(cambios);
      }
    );
    const nameFields = Object.keys(formParams);
    nameFields.forEach(name => {
      if (this.isField(formParams[name])) {
        if (formParams[name].notificar) {
          form.get(name)?.valueChanges.subscribe(
            (fcambio: Object) => {
              let whatChanged = {[name]: fcambio};
              this.suscribeToField(whatChanged);
            }
          );
        }
        
      }
    });
  }

  suscribeToField(field:any): void {
    this.subsChanges.emit(field);
  }

  emiteCambiosGeneral(cambiosData:any): void {
    this.updatedForm.emit(this.formGroup);
  }
  //#endregion
  // * ----------

  ngOnDestroy(): void {
  }
}