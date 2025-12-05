import { Coordenada } from "./coordenadas";

export class TuberiaMapa {
    idTuberia!: number;
    diametro!: number;
    material!: string;
    funciona!: string;
    coordenadas!: Coordenada[];
    pendiente!: number;
    velocidad!: number;
    caudal!: number;
}