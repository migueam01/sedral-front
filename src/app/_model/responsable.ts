import { Rol } from "./rol";

export class Responsable {
    idResponsable!: number;
    nombre!: string;
    apellido!: string;
    username!: string;
    password!: string;
    telefono!: string;
    habilitado!: boolean;
    correo!: string;
    roles: Rol[] = [];
}