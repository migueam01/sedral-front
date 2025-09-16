import { Pozo } from "./pozo";

export class Tuberia {
    idTuberia!: number;
    orientacion!: string;
    base!: number;
    corona!: number;
    diametro!: number;
    material!: string;
    flujo!: string;
    funciona!: string;
    sincronizado!: boolean;
    pozoInicio!: Pozo;
    pozoFin!: Pozo;
}