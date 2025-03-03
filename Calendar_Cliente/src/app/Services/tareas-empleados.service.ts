import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TareasEmpleadosService {

  constructor() { }

  getHorarios(): any {
    const horarios = {
      "Empleado1": [
        { title: 'Corte de Cabello - Diana Franco', start: '2025-03-08T10:00:00', end: '2025-03-08T11:00:00', color: "#2c3e50" },
        { title: 'Tinte de Cabelo - Diana Franco', start: '2025-03-08T12:00:00', end: '2025-03-08T13:00:00', color: "#2c3e50" },
      ],
      "Empleado2": [
        { title: 'Pintado de Uñas para Manos - Paola Aparicio', start: '2025-03-08T14:00:00', end: '2025-03-08T15:00:00', color: "#FFA725" },
        { title: 'Exsfoliación para la Cara - Paola Aparicio', start: '2025-03-10T15:00:00', end: '2025-03-10T16:00:00', color: "#FFA725" },
      ],
      "Empleado3": [
        { title: 'Delineado de Ojos - Alejandra Fernández', start: '2025-03-10T17:00:00', end: '2025-03-10T17:00:00', color: "#C599B6" },
        { title: 'Maquillaje Facial - Alejandra Fernández', start: '2025-03-27T17:00:00', end: '2025-03-27T20:00:00', color: "#C599B6" },
      ],
      "Empleado4": [
        { title: 'Masaje de columna - Eduardo Cortez', start: '2025-03-09T00:00:00', end: '2025-03-09T24:00:00', color:"#2DAA9E"},
        { title: 'Exsfoliación para la Cara 2 - Paola Aparicio', start: '2025-03-10T15:00:00', end: '2025-03-10T16:00:00', color: "#2DAA9E" },

      ]
    };
    return horarios;
  }
}
