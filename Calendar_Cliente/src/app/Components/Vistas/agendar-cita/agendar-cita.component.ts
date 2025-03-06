import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
export class AgendarCitaComponent implements OnInit, AfterViewInit {

  calendarioInLine!: CalendarOptions;
  dateListCalendar!: CalendarOptions;

  @ViewChild('days_calendar') calendarComponent!: FullCalendarComponent;
  @ViewChild('list_calendar') dateListComponent!: FullCalendarComponent;

  horariosActualizados: any = {};

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

  //Variable para mostrar la fecha:
  fecha_select: String = new Date().toLocaleDateString();

  //
  servicioEscogido_value: string = "00";
  servicioEscogido_text: string = "No escogió servicio";

  EventosGuardados: any[] = [];

  DiasBloqueados = ['2025-03-14', '2025-03-12', '2025-03-06', '2025-03-07', '2025-03-08', '2025-03-13', '2028-02-29', "2025-03-09"];

  fechaBloqueada!: Boolean;

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

        const fechaCompleta = new Date(args.date).toISOString().split("T")[0];//Retorna la fecha así: YYYY-MM-DD

        // Crear los elementos para el encabezado
        const container = document.createElement('div');
        container.classList.add('container-fechas');

        if (this.DiasBloqueados.includes(fechaCompleta)) {
          container.classList.add("fecha-bloqueada");
        }

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

          const elementoAnterior = document.querySelector('.clase-prueba');
          if (elementoAnterior) {
            elementoAnterior.classList.remove('clase-prueba');
          }

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

      themeSystem: "bootstrap5",
      customButtons: {
        customPrev: {
          icon: 'bi bi-arrow-left',
          click: () => {
            //Se crean las constantes para manipular los calendarios
            const dayApi = this.dateListComponent.getApi();
            const calendarApi = this.calendarComponent.getApi();

            const currentStartDate = dayApi.getDate();
            // Calcula la nueva fecha inicial (avanzar un día)
            // Calcula la nueva fecha inicial (avanzar un día)
            let newStartDate = new Date(currentStartDate.setDate(currentStartDate.getDate() - 0));//Formato Dia Mes 00 00:00:00 GMT-0600 (Hora Est...)...

            // Encontrar la siguiente fecha no bloqueada
            do {
              newStartDate.setDate(newStartDate.getDate() - 1); // Avanza un día
            } while (this.DiasBloqueados.includes(newStartDate.toISOString().split("T")[0]));

            console.log("Nueva fecha no bloqueada: ", newStartDate.toISOString().split("T")[0]);

            const fechaActual = new Date();
            const fechaEscogida = new Date(newStartDate);

            if (fechaActual.toISOString().split("T")[0] > fechaEscogida.toISOString().split("T")[0]) {
              alert("Solo puedes agendar citas en fechas actuales");
            } else {

              // Cambia la vista actual al nuevo rango
              dayApi.gotoDate(newStartDate);
              calendarApi.gotoDate(newStartDate);

              //Este código de acá señaliza la ubicación actual para mostrar donde se encuentra el usuario actualmente
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
          }
        },
        nextPrev: {
          icon: 'bi bi-arrow-right',

          click: () => {
            const dayApi = this.dateListComponent.getApi();
            const calendarApi = this.calendarComponent.getApi();

            const currentStartDate = dayApi.getDate();

            // Calcula la nueva fecha inicial (avanzar un día)
            let newStartDate = new Date(currentStartDate.setDate(currentStartDate.getDate() + 0));//Formato Dia Mes 00 00:00:00 GMT-0600 (Hora Est...)...

            // Encontrar la siguiente fecha no bloqueada
            do {
              newStartDate.setDate(newStartDate.getDate() + 1); // Avanza un día
            } while (this.DiasBloqueados.includes(newStartDate.toISOString().split("T")[0]));

            console.log("Nueva fecha no bloqueada: ", newStartDate.toISOString().split("T")[0]);

            // Cambia la vista actual al nuevo rango
            dayApi.gotoDate(newStartDate);
            calendarApi.gotoDate(newStartDate);

            //Este código de acá señaliza la ubicación actual para mostrar donde se encuentra el usuario actualmente
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
        }
      },
      headerToolbar: {
        right: "customPrev,nextPrev",
      },
      firstDay: this.obtenerFechaActual(),
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

  ngAfterViewInit(): void {/*
    const diaActual = new Date().toISOString().split("T")[0];
    if (this.DiasBloqueados.includes(diaActual)) {
      console.log("Este dia actual está bloqueado");
      this.fechaBloqueada = true;
    } else {
      console.log("Este dia actual NO está bloqueado");
      this.fechaBloqueada = false;

    }*/
    setTimeout(() => {
      const calendarApi = this.dateListComponent.getApi();

      if (calendarApi) {
        const initialDate = this.iniciarDiaHabil(); // Método para calcular la fecha deseada
        calendarApi.gotoDate(initialDate); // Establece la fecha inicial del calendario
        console.log('Fecha inicial establecida:', initialDate);
      } else {
        console.error('El API del calendario no está disponible.');
      }
    }, 0);
  }

  obtenerFechaActual(): number {
    return new Date().getUTCDay();
  }

  //Esta función es para cuando se quiera hacer clicks en fechas bloqueadas
  handleDateClick(arg: any): boolean {
    const fechaActual = new Date();
    const fechaEscogida = new Date(arg.dateStr);

    // Obtener solo la parte de la fecha (año, mes y día)
    const fechaActualStr = fechaActual.toISOString().split('T')[0];
    const fechaEscogidaStr = fechaEscogida.toISOString().split('T')[0];

    if (this.DiasBloqueados.includes(fechaEscogidaStr)) {
      alert("Esta fecha fue deshabilitada");
      return false;
    }

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

  iniciarDiaHabil(): string {
    const dayApi = this.dateListComponent.getApi();
    const currentStartDate = dayApi.getDate();
    // Calcula la nueva fecha inicial (avanzar un día)
    // Calcula la nueva fecha inicial (avanzar un día)
    let newStartDate = new Date(currentStartDate.setDate(currentStartDate.getDate() + 0));//Formato Dia Mes 00 00:00:00 GMT-0600 (Hora Est...)...

    // Encontrar la siguiente fecha no bloqueada
    do {
      newStartDate.setDate(newStartDate.getDate() + 1); // Avanza un día
    } while (this.DiasBloqueados.includes(newStartDate.toISOString().split("T")[0]));

    console.log("Nueva fecha no bloqueada: ", newStartDate.toISOString().split("T")[0]);

    return newStartDate.toISOString().split("T")[0];
  }

}
