import { Gadm } from "./gadm";

export class Proyecto {
    idProyecto!: number;
    nombre!: string;
    alias!: string;
    dotacion!: number;
    poblacion!: number;
    gadm!: Gadm;
}