import { Validators } from "@angular/forms";

export class FormParams {
  [name: string]: Param;
}

export class Param {
  label?: string;
  placeholder?: string;
  placeholder_info?: string;
  tipo: string = '';
  tipoDato: string = '';
  validador?: Validators[] = [];
  requerido: boolean = false;
  soloLectura: boolean = false;
  desabilitado?: boolean = false;
  valor: any = null;
  valorDefecto?: any = null;
  oculto?: boolean = false;
  minimo?: number = 0;
  maximo?: number = 0;
  paso?: number = 1;
  opciones?: any[] = [];
  coincidencia?: RegExp = /.*/;
  error?: string = '';
  info?: string = '';
  notificar?: boolean = false;
  claseGrid: string = '';
  claseAux?: string = '';
  rows?: number = 0;
}