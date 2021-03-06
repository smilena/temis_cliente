import { AuthInterceptor } from './_Interceptor/auth.Interceptor';
import { EnteService } from './data/ente.service';
import { UbicacionesService } from './data/ubicaciones.service';
import { PersonaService } from './data/persona.service';
import { MontoAceptadoCobrarService } from './data/monto_aceptado_cobrar.service';
import { RegistrarCobroService } from './data/registrar_cobro.service';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthModule, NbDummyAuthStrategy, NbTokenLocalStorage, NbTokenStorage } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf } from 'rxjs';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { DataModule } from './data/data.module';
import { AnalyticsService } from './utils/analytics.service';
import { DocumentoService } from './data/documento.service'
import { NotificacionesService } from './utils/notificaciones.service';
import { WebsocketService } from './utils/websocket.service';
import { AuthGuard } from './_guards/auth.guard';
import { ListService } from './store/services/list.service';
import { StoreModule } from '@ngrx/store';
import { rootReducer } from './store/rootReducer';
import { AdmisionesService } from './data/admisiones.service';
import { IdiomaService } from './data/idioma.service';
import { ProgramaAcademicoService } from './data/programa_academico.service';
import { ProduccionAcademicaService } from './data/produccion_academica.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DtfService } from './data/dtf.service';
import { IpcService } from './data/ipc.service';
import { SalarioMinimoService } from './data/salario_minimo.service';
import { RegistrarCobroModel } from './data/models/registrar_cobro';
import { TipoRelacionOrganizacionService } from './data/tipo_relacion_organizacion.service';
import { TipoOrganizacionService } from './data/tipo_organizacion.service';
import { OrganizacionService } from './data/organizacion.service';
import { RelacionOrganizacionService } from './data/relacion_organizacion.service';
import { TipoEnteService } from './data/tipo_ente.service';
import { IdentificacionService } from './data/identificacion.service';
import { TipoIdentificacionService } from './data/tipo_identificacion.service';
import { TipoDedicacionService } from './data/tipo_dedicacion.service';
import { TipoVinculacionService } from './data/tipo_vinculacion.service';
import { CargoService } from './data/cargo.service';
import { DatoAdicionalExperienciaLaboralService } from './data/dato_adicional_experiencia_laboral.service';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Injectable } from '@angular/core';
import { ImplicitAutenticationService } from './utils/implicit_autentication.service';

@Injectable()
export class RoleProvider implements NbRoleProvider {

  constructor(private authService: NbAuthService,
    private authToken: ImplicitAutenticationService) {
  }

  getRole(): Observable<string> {
    var token = this.authToken.getPayload()

    if (token) {
      try {
        if (typeof token != 'string')
          return observableOf(token['role'][0]);
        else
          return observableOf(token)
      }
      catch (Error) {
        return observableOf('guest')
      }
    } else
      return observableOf('guest');
  }
}

export const NB_CORE_PROVIDERS = [
  ...DataModule.forRoot().providers,

  ...NbAuthModule.forRoot({
    strategies: [
      NbDummyAuthStrategy.setup({
        name: 'email',
      }),
    ],
    forms: {},
  }).providers,
  {
    provide: NbTokenStorage,
    useClass: NbTokenLocalStorage
  },

  NbSecurityModule.forRoot({
    accessControl: {
      ADMIN_CAMPUS: {
        view: '*',
        create: '*',
        delete: '*',
        edit: '*'
      },
      "Internal/everyone": {
        view: '*'
      },
      "Internal/selfsignup": {
        view: '*'
      },
      "Application/utest01_DefaultApplication_SANDBOX": {
        view: '*'
      },
      guest: {
        view: '*',
      },
    },
  }).providers,
  {
    provide: NbRoleProvider,
    useClass: RoleProvider,
  },
  AnalyticsService,
];

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(rootReducer)
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
  providers: [
    AuthGuard,
    ListService,
    PersonaService,
    AdmisionesService,
    IdiomaService,
    UbicacionesService,
    ProgramaAcademicoService,
    ProduccionAcademicaService,
    EnteService,
    MontoAceptadoCobrarService,
    RegistrarCobroService,
    DtfService,
    IpcService,
    SalarioMinimoService,
    TipoRelacionOrganizacionService,
    TipoOrganizacionService,
    OrganizacionService,
    RelacionOrganizacionService,
    RegistrarCobroModel,
    TipoEnteService,
    IdentificacionService,
    TipoIdentificacionService,
    TipoDedicacionService,
    TipoVinculacionService,
    CargoService,
    DatoAdicionalExperienciaLaboralService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
        DocumentoService,
        NotificacionesService,
        WebsocketService,
      ],
    };
  }
}
