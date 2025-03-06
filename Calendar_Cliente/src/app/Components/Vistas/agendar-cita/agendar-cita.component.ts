import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridOptions from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPluggin, { DateClickArg } from '@fullcalendar/interaction';


@Component({
  selector: 'app-agendar-cita',
  imports: [FullCalendarModule,],
  templateUrl: './agendar-cita.component.html',
  styleUrl: './agendar-cita.component.css'
})
export class AgendarCitaComponent implements OnInit {

  calendarioInLine!: CalendarOptions;
  dateListCalendar!: CalendarOptions;

  @ViewChild('days_calendar') calendarComponent!: FullCalendarComponent;
  @ViewChild('list_calendar') dateListComponent!: FullCalendarComponent;

  ngOnInit(): void {
    this.calendarioInLine = {
      locale: "eS",
      initialView: "dayGridWeek",
      //headerToolbar: false,
      dayHeaders: true,
      plugins: [dayGridOptions, interactionPluggin],
      //events: eventos
      dayHeaderFormat: { weekday: 'long', day: "2-digit" }, // Formato de encabezado (solo día)
      titleFormat: { year: 'numeric', month: 'long' }, // Muestra solo mes y año

      dayHeaderContent: (args: any) => {
        const dayNumber = args.date.getDate(); // Obtén el número del día
        const dayName = args.view.calendar.formatDate(args.date, { weekday: "short" }); // Obtén el nombre del día

        // Crear los elementos para el encabezado
        const container = document.createElement('div');
        container.classList.add('container-fechas');

        const numberElement = document.createElement('div');
        numberElement.classList.add('number-element');
        numberElement.textContent = dayNumber.toString();

        const nameElement = document.createElement('div');
        nameElement.classList.add('name-element');
        nameElement.textContent = dayName;

        container.appendChild(numberElement);
        container.appendChild(nameElement);

        // Agregar un event listener al contenedor para manejar los clics
        container.addEventListener('click', () => {
          const fakeDateClickArg = {
            date: args.date, // Pasar la fecha correspondiente al encabezado
            dateStr: args.date.toISOString().split('T')[0], // Cadena ISO ajustada a solo fecha
            allDay: true, // Simular propiedad
            dayEl: container, // Elemento contenedor
            jsEvent: null, // Simular evento del mouse
            view: args.view // Vista actual
          };
          const boleano = this.handleDateClick(fakeDateClickArg);
          if (boleano) {
            // Encuentra el elemento actualmente activo
            const previousActive = document.querySelector('.touch-date');
            if (previousActive) {
              previousActive.classList.remove('touch-date'); // Quita la clase
            }
            container.classList.add('touch-date'); // Añade la clase al elemento actual
          }
        });

        return { domNodes: [container] };
      },


      firstDay: this.obtenerFechaActual(),

      customButtons: {
        customPrev: {
          text: "Siguiente",
          click: () => {
            const dayApi = this.dateListComponent.getApi();

            const currentStartDate = dayApi.getDate();
            // Calcula la nueva fecha inicial (avanzar un día)
            const newStartDate = new Date(currentStartDate.setDate(currentStartDate.getDate() + 1));
            // Cambia la vista actual al nuevo rango
            dayApi.gotoDate(newStartDate);

            const seleccionado = document.querySelector("fc-day-today");

            const elementoAnterior = document.querySelector('.clase-prueba');
            if (elementoAnterior) {
              elementoAnterior.classList.remove('clase-prueba');
            }
            const previousActive = document.querySelector('.touch-date');
            if (previousActive) {
              previousActive.classList.remove("touch-date");
              const fechaEscogida = newStartDate.toISOString().split("T")[0];
              const data_date = document.querySelector('th[data-date="' + fechaEscogida + '"]');
              if (data_date) {
                data_date.classList.add("clase-prueba");
              } else {
                alert("existe");
              }
            } else {
              const fechaEscogida = newStartDate.toISOString().split("T")[0];
              const data_date = document.querySelector('th[data-date="' + fechaEscogida + '"]');
              if (data_date) {
                data_date.classList.add("clase-prueba");
              }
            }
          }
        },
        nextPrev: {
          text: "Anterior",
          click: () => {
            const calendarApi = this.dateListComponent.getApi();

            const currentStartDate = calendarApi.getDate();

            // Calcula la nueva fecha inicial (avanzar un día)
            const newStartDate = new Date(currentStartDate.setDate(currentStartDate.getDate() - 1));

            // Cambia la vista actual al nuevo rango
            calendarApi.gotoDate(newStartDate);
          }
        }
      },
      headerToolbar: {
        right: "customPrev,nextPrev",
      }
    }

    this.dateListCalendar = {
      locale: "eS",//Coloca los datos en idioma español 
      headerToolbar: {
        start: '', // 
        center: '',
        end: ''
      },
      initialView: 'timeGridDay',
      weekends: true,
      plugins: [dayGridOptions, interactionPluggin, timeGridPlugin],
      //events: eventos,
      //eventSources: [{ events: this.EventosGuardados }, { events: this.EventosGuardados2 }],
      selectable: true,
      //select: this.handleSelect.bind(this),
      //eventClick: this.handleEventeClick.bind(this),
      allDaySlot: false,
      slotEventOverlap: false,

      //Estas opciones serán para configurar la hora de inicio y la hora final para recibir citas:
      slotMinTime: '06:00:00',
      slotMaxTime: '23:00:00',

      //Opciones para configurar el formato de como se muestra la hora:
      slotLabelFormat: { hour: "2-digit", minute: "2-digit", hour12: true },
    };
  }

  obtenerFechaActual(): number {
    //return new Date().toISOString().split("T")[0];//Retorna la fecha así: YYYY-MM-DD
    return new Date().getUTCDay();
  }

  handleDateClick(arg: any): boolean {
    const fechaActual = new Date();
    const fechaEscogida = new Date(arg.dateStr);

    // Obtener solo la parte de la fecha (año, mes y día)
    const fechaActualStr = fechaActual.toISOString().split('T')[0];
    const fechaEscogidaStr = fechaEscogida.toISOString().split('T')[0];

    if (fechaEscogidaStr >= fechaActualStr) {
      //this.fecha_select = arg.date.toLocaleDateString();
      const calendarApi = this.dateListComponent.getApi();
      calendarApi.gotoDate(arg.dateStr);
      return true;
    } else {
      alert("Solo se pueden agendar citas en horarios permitidos");
      return false;
    }
  }

}
