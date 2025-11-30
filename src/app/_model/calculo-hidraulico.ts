export interface CalculoHidraulico {
    idCalculo: number,
    idTuberia: number,
    nombrePozoInicio: string,
    nombrePozoFin: string,
    pendiente: number,
    velocidad: number,
    caudal: number
}