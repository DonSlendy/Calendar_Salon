import { Routes } from '@angular/router';
import { DashboardClienteComponent } from './Components/Vistas/dashboard-cliente/dashboard-cliente.component';

export const routes: Routes = [
    { path: "", redirectTo: "EscogerFecha", pathMatch: "full"},
    { path: "EscogerFecha", component: DashboardClienteComponent,  },

    { path: "**", redirectTo: "EscogerFecha", pathMatch: "full" }

];
