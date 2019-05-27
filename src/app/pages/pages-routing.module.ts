import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetalleAdmisionComponent } from './detalle-admision/detalle-admision.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'gestion_informacion',
      loadChildren: './gestion_informacion/gestion_informacion.module#GestionInformacionModule',
    },
    {
      path: 'inscripcion',
      loadChildren: './inscripcion/inscripcion.module#InscripcionModule',
    },
    {
      path: 'admision',
      loadChildren: './admision/admision.module#AdmisionModule',
    },
    {
      path: 'notificacion',
      loadChildren: './notificacion/notificacion.module#NotificacionModule',
    },
    {
      path: 'propuesta_grado',
      loadChildren: './propuesta_grado/propuesta_grado.module#PropuestaGradoModule',
    },
    {
      path: 'experiencia_laboral',
      loadChildren: './experiencia_laboral/experiencia_laboral.module#ExperienciaLaboralModule',
    },
    {
      path: 'registrar_cobro',
      loadChildren: './registrar_cobro/registrar_cobro.module#RegistrarCobroModule',
    },
    // {
    //   path: 'libro',
    //   loadChildren: './libro/libro.module#LibroModule',
    // },
    {
      path: 'tipo_proyecto',
      loadChildren: './tipo_proyecto/tipo_proyecto.module#TipoProyectoModule',
    },
    { path: 'detalleInfo/:id',
      component: DetalleAdmisionComponent },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
