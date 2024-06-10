export interface Usuario {
  role:                string[];
  documento:           string;
  email:               string;
  Estado:              string;
}
  
export interface Rol {
  rol: string;
  selected: boolean;
};
