export interface Usuario {
  role:                string[];
  documento:           string;
  email:               string;
  Codigo:              string;
  Estado:              string;
}
  
export interface Rol {
  rol: string;
  selected: boolean;
};
