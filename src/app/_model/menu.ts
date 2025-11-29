import { Rol } from "./rol";

export interface Menu {
    idMenu: number;
    icono: string;
    nombre: string;
    url: string;
    roles: Rol[];
}