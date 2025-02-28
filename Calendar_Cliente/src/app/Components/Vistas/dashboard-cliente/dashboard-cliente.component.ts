import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

//Modulos de fullcalendar
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';

import dayGridOptions from '@fullcalendar/daygrid';
import interactionPluggin, { DateClickArg } from '@fullcalendar/interaction';
import timePlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-dashboard-cliente',
  imports: [
    CommonModule,
    //RouterOutlet,
    FullCalendarModule,
  ],
  templateUrl: './dashboard-cliente.component.html',
  styleUrl: './dashboard-cliente.component.css'
})
export class DashboardClienteComponent {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  //Variable para mostrar la fecha:
  fecha_select: String = new Date().toLocaleDateString();

  EventosGuardados: any[] = [
    /*{
      title: 'event 1',
      start: '2025-02-25',
      end: '2025-02-28',
      color: 'red',
    },*/
    { title: 'Corte de Cabello - Diana Franco', start: '2025-03-08T10:00:00', end: '2025-03-08T11:00:00' },
    { title: 'Tinte de Cabelo - Diana Franco', start: '2025-03-08T12:00:00', end: '2025-03-08T13:00:00' },
    { title: 'Pintado de Uñas para Manos - Paola Aparicio', start: '2025-03-08T14:00:00', end: '2025-03-08T15:00:00' },
    { title: 'Exsfoliación para la Cara - Paola Aparicio', start: '2025-03-10T15:00:00', end: '2025-03-10T16:00:00' },
    { title: 'Delineado de Ojos - Alejandra Fernández', start: '2025-03-10T17:00:00', end: '2025-03-10T17:00:00' },
    { title: 'Maquillaje Facial - Alejandra Fernández', start: '2025-03-27T17:00:00', end: '2025-03-27T20:00:00' },
    { title: 'Masaje de columna - Eduardo Cortez', start: '2025-03-01T00:00:00', end: '2025-03-01T24:00:00' },


  ];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    weekends: true,
    plugins: [dayGridOptions, interactionPluggin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: this.EventosGuardados,
    dayMaxEvents: true,
  };

  dateListCalendar: CalendarOptions = {
    headerToolbar: {
      start: '', // will normally be on the left. if RTL, will be on the right
      center: '',
      end: ''
    },
    initialView: 'timeGridDay',
    weekends: true,
    plugins: [dayGridOptions, interactionPluggin, timePlugin],
    events: this.EventosGuardados,
    selectable: true,
    select: this.handleSelect.bind(this),
    allDaySlot: false,

  };

  //Esta función es para cuando se hace click en una casilla del calendario
  handleDateClick(arg: DateClickArg) {
    const fechaActual = new Date();
    const fechaEscogida = new Date(arg.dateStr);

    if (fechaEscogida >= fechaActual) {
      this.fecha_select = arg.date.toLocaleDateString();
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.gotoDate(arg.dateStr);
    }
      /*
      const agregarEvento = { title: 'Nuevo evento', date: arg.dateStr };
      this.calendarOptions.events = [
        ...this.EventosGuardados,
        agregarEvento
      ];
    } */else {
      alert("Solo se pueden agendar citas a partir del siguiente día y horarios permitidos");
    }
    //alert('date click! ' + arg.dateStr);
  }

  //Esta función es para cuando se hace click en las horas del listado 
  handleSelect(arg: any) {/*
    const fechaActual = new Date();
    const fechaEscogida = new Date(arg.dateStr);
    if(fechaEscogida>=fechaActual){
      alert("Fecha actual");
    }
    */

    
    if (this.eventoOcupado(arg.start, arg.end)) {
      alert("La fecha que deseas ya está ocupada, prueba con otra ");
    } else {
      const title = prompt("Ingrese tu nombre para agendar la cita: ");
      if (title) {
        const newEvent = {
          title: title,
          start: arg.startStr,
          end: arg.endStr,
        };
        this.EventosGuardados = [
          ...this.EventosGuardados,
          newEvent
        ];
        // Forzar la actualización del listado
        this.dateListCalendar = {
          ...this.dateListCalendar,
          events: this.EventosGuardados
        };
        console.log(this.EventosGuardados);
        //Para el calendario
        this.calendarOptions = {
          ...this.calendarOptions,
          events: this.EventosGuardados
        }
      }
    }
  }

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends;
  }

  //Función para verificar que no se pueda ingresar una fecha colindante con otro registro
  eventoOcupado(start: any, end: any): boolean {

    //Se usa la función some para verificar si existe algún dato guardado que choque con las fechas existentes, retorna TRUE
    return this.EventosGuardados.some(event => {
      //Estas dos variables obtienen el tiempo de cualquiera de los eventos guardados, tanto inicial como final
      const eventStart = new Date(event.start).getTime();
      const eventEnd = new Date(event.end).getTime();

      //Estas dos obtienen el tiempo del nuevo evento a guardar
      const selectStart = new Date(start).getTime();
      const selectEnd = new Date(end).getTime();

      //Compara que el tiempo seleccionado no choque con el tiempo final de algún evento existente
      //También compara si el final del evento seleccionado no comience con el evento inicial de otro
      return (selectStart < eventEnd && selectEnd > eventStart);

    })
  }

  obtenerFechaActual(): string {
    return new Date().toISOString().split("T")[0];
  }
}
