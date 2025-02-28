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
  Tiempo_Servicios: { [key: string]: number } = {
    "01": 60,//1hora
    "02": 120,//2horas
    "03": 180,//3horas
    "04": 240,//4horas
    "05": 90,//1 hora y media
  }

  Tiempo_Servicios_Horas: { [key: string]: string } = {
    "01": " 1 hora ",
    "02": " 2 horas ",
    "03": " 3 horas ",
    "04": " 4 horas ",
    "05": " 1 hora y media ",
  }
  //Esta variable hace referencia al listado donde se visualizan los eventos
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  //Variable para mostrar la fecha:
  fecha_select: String = new Date().toLocaleDateString();

  //
  servicioEscogido_value: string = "00";
  servicioEscogido_text: string = "No escogió servicio";

  EventosGuardados: any[] = [
    { title: 'Corte de Cabello - Diana Franco', start: '2025-03-08T10:00:00', end: '2025-03-08T11:00:00' },
    { title: 'Tinte de Cabelo - Diana Franco', start: '2025-03-08T12:00:00', end: '2025-03-08T13:00:00' },
    { title: 'Pintado de Uñas para Manos - Paola Aparicio', start: '2025-03-08T14:00:00', end: '2025-03-08T15:00:00' },
    { title: 'Exsfoliación para la Cara - Paola Aparicio', start: '2025-03-10T15:00:00', end: '2025-03-10T16:00:00' },
    { title: 'Delineado de Ojos - Alejandra Fernández', start: '2025-03-10T17:00:00', end: '2025-03-10T17:00:00' },
    { title: 'Maquillaje Facial - Alejandra Fernández', start: '2025-03-27T17:00:00', end: '2025-03-27T20:00:00' },
    { title: 'Masaje de columna - Eduardo Cortez', start: '2025-03-01T00:00:00', end: '2025-03-01T24:00:00' },
  ];

  DiasBloqueados = ['2025-03-07', '2025-03-13', '2028-02-29'];

  calendarOptions: CalendarOptions = {
    locale: "eS",
    initialView: 'dayGridMonth',
    weekends: true,
    plugins: [dayGridOptions, interactionPluggin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: this.EventosGuardados,
    dayMaxEvents: true,
    selectAllow: this.fechasExcluidas.bind(this),
    dayCellClassNames: this.setDayCellClassNames.bind(this),
    //Esta propiedad deshabilita todos los días, 1=lunes, 2=martes..hiddenDays: [3,4],
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

    // Obtener solo la parte de la fecha (año, mes y día)
    const fechaActualStr = fechaActual.toISOString().split('T')[0];
    const fechaEscogidaStr = fechaEscogida.toISOString().split('T')[0];

    if (this.DiasBloqueados.includes(fechaEscogidaStr)) {
      alert("Esta fecha fue deshabilitada");
      return;
    }

    if (fechaEscogidaStr >= fechaActualStr) {
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
      alert("Solo se pueden agendar citas en horarios permitidos");
    }
    //alert('date click! ' + arg.dateStr);
  }

  //Esta función es para cuando se hace click en las horas del listado 
  handleSelect(arg: any) {
    const tiempoMax = this.Tiempo_Servicios[this.servicioEscogido_value];
    const selectStart = new Date(arg.start);
    const selectEnd = new Date(arg.end);
    const duration = (selectEnd.getTime() - selectStart.getTime()) / (1000 * 60);

    if (this.eventoOcupado(arg.start, arg.end)) {
      alert("La hora que deseas ya está ocupada, prueba con otra ");
    } else {

      //Estas validaciones son solo para mostrar un mensaje personalizado dependiendo del tiempo escogido, mostrando el tiempo en horas
      if (duration > tiempoMax || duration < tiempoMax) {
        alert("El tiempo seleccionado para ese tratamiento no coincide, el tiempo estimado es de" + this.Tiempo_Servicios_Horas[this.servicioEscogido_value]);
      } else {
        //const title = prompt("Ingrese tu nombre para agendar la cita: ");
        //if (title) {
        const newEvent = {
          title: this.servicioEscogido_text + "-" + "NombreRecibidoPorElBot",
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
        //}
      }
    }
  }

  //Esta función es para ocultar los fines de semana o mostrarlos.
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

  //Esta función es para obtener de forma simulada el tipo de servicio que agendará la persona
  serviciosSalon(event: Event) {
    const selectValue = (event.target as HTMLSelectElement);
    if (selectValue) {
      this.servicioEscogido_text = selectValue.options[selectValue.selectedIndex].text;
      this.servicioEscogido_value = selectValue.value;
      console.log(this.servicioEscogido_value);
    } else {
      console.log("Nulo");
    }
  }

  fechasExcluidas(selectInfo: any) {
    const selectDate = selectInfo.startStr.split("T")[0];
    return !this.DiasBloqueados.includes(selectDate);
  }

  //Esta función es para colocarle la clase disabled a cada fecha excluída.
  setDayCellClassNames(arg: any) {
    const dateStr = arg.date.toISOString().split("T")[0];
    if (this.DiasBloqueados.includes(dateStr)) {
      return ["disabled-date"];
    }
    return [];
  }
}
