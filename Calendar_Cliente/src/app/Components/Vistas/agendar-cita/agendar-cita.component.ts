import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-agendar-cita',
  imports: [FullCalendarModule,],
  templateUrl: './agendar-cita.component.html',
  styleUrl: './agendar-cita.component.css'
})
export class AgendarCitaComponent implements OnInit {

  calendarioInLine!: CalendarOptions;


  ngOnInit(): void {
    this.calendarioInLine = {
      initialView: "dayGridWeek",
      //headerToolbar: false,
      dayHeaders: true,
      plugins: [dayGridPlugin],
      //events: eventos
    }
  }

}
