import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TareasEmpleadosService } from '../../../Services/tareas-empleados.service';

//Modulos de fullcalendar
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridOptions from '@fullcalendar/daygrid';
import interactionPluggin, { DateClickArg } from '@fullcalendar/interaction';
import timePlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid'

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
export class DashboardClienteComponent implements OnInit {
  calendarOptions!: CalendarOptions;
  dateListCalendar!: CalendarOptions;

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
  //Esta variable hace referencia al listado donde se visualizan los eventos
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  //Variable para mostrar la fecha:
  fecha_select: String = new Date().toLocaleDateString();

  //
  servicioEscogido_value: string = "00";
  servicioEscogido_text: string = "No escogió servicio";

  EventosGuardados: any[] = [];

  DiasBloqueados = ['2025-03-07', '2025-03-13', '2028-02-29'];

  constructor(private horariosService: TareasEmpleadosService,) { }

  ngOnInit(): void {
    this.horariosActualizados = this.horariosService.getHorarios();

    console.log("Estos son los horarios, en const", this.horariosActualizados);

    const eventos: { title: string; start: any; end: any; color: any; }[] = [];

    Object.keys(this.horariosActualizados).forEach(empleado => {
      this.horariosActualizados[empleado].forEach((evento: { title: any; start: any; end: any; color: any; }) => {
        eventos.push({
          title: `${empleado}: ${evento.title}`,
          start: evento.start,
          end: evento.end,
          color: evento.color
        });
      });
    });

    this.EventosGuardados = eventos;

    this.calendarOptions = {
      locale: "eS",//Coloca los datos en idioma español 
      initialView: 'dayGridMonth', //La forma de como se visualizará, en este caso como un calendario
      weekends: true, //días fines de semana activos: si
      plugins: [dayGridOptions, interactionPluggin],//Los plugins sirven para darle funcionalidad extra, daygrid muestra el calendario en modo mensual e interaction sirve para poder hacerle click a las casillas del calendario
      dateClick: (arg) => this.handleDateClick(arg),//Define que, si se hace click, ejecuta la función handleDateClick
      events: eventos,//Los eventos son la información que cargan los datos dentro del calendario, 
      //eventSources: [{ events: this.EventosGuardados }, { events: this.EventosGuardados2 }],
      dayMaxEvents: true,
      selectAllow: this.fechasExcluidas.bind(this),//Esta opción marca celdas que no se podrán seleccionar
      dayCellClassNames: this.setDayCellClassNames.bind(this),//Esto les da a las fechas no seleccionadas una clase que las hace visibles
      //Esta propiedad deshabilita todos los días, 1=lunes, 2=martes..hiddenDays: [3,4],
    };

    this.dateListCalendar = {
      locale: "eS",//Coloca los datos en idioma español 
      headerToolbar: {
        start: '', // 
        center: '',
        end: ''
      },
      initialView: 'timeGridDay',
      weekends: true,
      plugins: [dayGridOptions, interactionPluggin, timePlugin],
      events: eventos,
      //eventSources: [{ events: this.EventosGuardados }, { events: this.EventosGuardados2 }],
      selectable: true,
      select: this.handleSelect.bind(this),
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

    const empleados = Object.keys(this.horariosActualizados);
    console.log("estos son los empleados y sus horarios:", empleados, this.horariosActualizados);

    let empleadoDisponible: string | null = null;

    for (const empleado of empleados) {
      if (!this.eventoOcupado(arg.start, arg.end, this.horariosActualizados[empleado])) {
        empleadoDisponible = empleado;
        break;
      }
    }

    if (empleadoDisponible) {
      // const colorSelect:string=empleadoDisponible.color; 
      //Estas validaciones son solo para mostrar un mensaje personalizado dependiendo del tiempo escogido, mostrando el tiempo en horas
      if (duration > tiempoMax || duration < tiempoMax) {
        alert("El tiempo seleccionado para ese tratamiento no coincide, el tiempo estimado es de" + this.Tiempo_Servicios_Horas[this.servicioEscogido_value]);
      } else {

        const empleadoColor = this.horariosActualizados[empleadoDisponible][0]?.color || "purple"; // Por defecto azul si no tiene color

        console.log("El empleado asignado fue:", empleadoDisponible);
        const newEvent = {
          title: empleadoDisponible + ": " + this.servicioEscogido_text + " - " + "NombreRecibidoPorElBot",
          start: arg.startStr,
          end: arg.endStr,
          color: empleadoColor,
        };

        this.horariosActualizados[empleadoDisponible] = [
          ...this.horariosActualizados[empleadoDisponible],
          newEvent
        ];

        this.EventosGuardados = [
          ...this.EventosGuardados,
          newEvent
        ];

        // Forzar la actualización del listado
        this.dateListCalendar = {
          ...this.dateListCalendar,
          events: this.EventosGuardados
        };

        //Para el calendario
        this.calendarOptions = {
          ...this.calendarOptions,
          events: this.EventosGuardados
        }
      }
    } else {
      alert("La hora que deseas ya está ocupada, prueba con otra ");
    }
  }

  //

  //Esta función es para ocultar los fines de semana o mostrarlos.
  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends;
  }

  //Función para verificar que no se pueda ingresar una fecha colindante con otro registro
  eventoOcupado(start: any, end: any, eventos: any[]): boolean {
    console.log("El EVento eventoOcupado", eventos);
    //Se usa la función some para verificar si existe algún dato guardado que choque con las fechas existentes, retorna TRUE
    return eventos.some(event => {
      console.log("El event", event);
      //Estas dos variables obtienen el tiempo de cualquiera de los eventos guardados, tanto inicial como final
      const eventStart = new Date(event.start).getTime();
      const eventEnd = new Date(event.end).getTime();

      //Estas dos obtienen el tiempo del nuevo evento a guardar
      const selectStart = new Date(start).getTime();
      const selectEnd = new Date(end).getTime();

      //Compara que el tiempo seleccionado no choque con el tiempo final de algún evento existente
      //También compara si el final del evento seleccionado no comience con el evento inicial de otro
      return (selectStart < eventEnd && selectEnd > eventStart);
    });
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
