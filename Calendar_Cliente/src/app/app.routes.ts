import { Routes } from '@angular/router';
import { DashboardClienteComponent } from './Components/Vistas/dashboard-cliente/dashboard-cliente.component';
import { AgendarCitaComponent } from './Components/Vistas/agendar-cita/agendar-cita.component';

export const routes: Routes = [
    { path: "", redirectTo: "EscogerFecha", pathMatch: "full" },
    { path: "EscogerFecha", component: DashboardClienteComponent, },
    { path: "ClienteVista", component: AgendarCitaComponent },

    { path: "**", redirectTo: "EscogerFecha", pathMatch: "full" }

];
