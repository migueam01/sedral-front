export interface CalculoHidraulico {
    idCalculo: number,
    idTuberia: number,
    nombrePozoInicio: string,
    nombrePozoFin: string,
    diametro: number,
    material: string,
    calado: number,
    manning: number,
    pendiente: number,
    velocidad: number,
    caudal: number,
    relacionCaudal: number,
    relacionVelocidad: number,
    relacionArea: number
}