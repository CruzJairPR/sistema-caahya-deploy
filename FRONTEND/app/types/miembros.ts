export interface Miembro {
  _id?: string;
  nombre: string;
  entidad?: string;
  correoElectronico?: string;
  telefono1?: string;
  telefono2?: string;
  telefono3?: string;
  correoSecretario1?: string;
  correoSecretario2?: string;
  correoSecretario3?: string;
  [key: string]: any;
}
