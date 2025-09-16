import { Gadm } from "./gadm";

export class Proyecto {
    idProyecto!: number;
    nombre!: string;
    alias!: string;
    sincronizado!: boolean;
    gadm!: Gadm;
}