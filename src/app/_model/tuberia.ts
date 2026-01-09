import { Pozo } from "./pozo";

export class Tuberia {
    idTuberia!: number;
    orientacion!: string;
    base!: number;
    corona!: number;
    diametro!: number;
    material!: string;
    longitud!: number;
    flujo!: string;
    funciona!: string;
    areaAporte!: number;
    calado!: number;
    pozoInicio!: Pozo;
    pozoFin!: Pozo;
}