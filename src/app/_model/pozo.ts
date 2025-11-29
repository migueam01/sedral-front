import { Descarga } from "./descarga";
import { Responsable } from "./responsable";
import { Sector } from "./sector";

export class Pozo {
    idPozo!: number;
    nombre!: string;
    sistema!: string;
    fechaCatastro!: string;
    fechaActualizacion!: string;
    tapado!: string;
    norteMovil!: number;
    esteMovil!: number;
    cotaMovil!: number;
    norteTopo!: number;
    esteTopo!: number;
    cotaTopo!: number;
    aproximacion!: number;
    zona!: string;
    srid!: number;
    estado!: string;
    calzada!: string;
    fluido!: string;
    dimensionTapa!: number;
    altura!: number;
    ancho!: number;
    calleOE!: string;
    calleNS!: string;
    observacion!: string;
    pathMedia!: string;
    actividadCompletada!: number;
    sector!: Sector;
    responsable!: Responsable;
    descarga!: Descarga;
}