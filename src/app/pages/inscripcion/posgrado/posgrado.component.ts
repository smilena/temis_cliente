import { Component, OnInit , OnChanges} from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ImplicitAutenticationService } from './../../../@core/utils/implicit_autentication.service';
import { PersonaService } from '../../../@core/data/persona.service';
import { UtilidadesService } from '../../../@core/utils/utilidades.service';
import { ProgramaAcademicoService } from '../../../@core/data/programa_academico.service';
import { AdmisionesService } from '../../../@core/data/admisiones.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
// import Swal from 'sweetalert2';
// import { Router } from '@angular/router';

@Component({
  selector: 'ngx-posgrado',
  templateUrl: './posgrado.component.html',
  styleUrls: ['./posgrado.component.scss'],
})
export class PosgradoComponent implements OnInit, OnChanges {

  info_persona_id: number;
  info_ente_id: number;
  info_info_persona: any;
  step = 0;
  cambioTab = 0;
  nForms: number;
  percentage_info: number = 0;
  percentage_acad: number = 0;
  percentage_expe: number = 0;
  percentage_proy: number = 0;
  // percentage_prod: number = 0;
  percentage_tab_info = [];
  percentage_tab_expe = [];
  percentage_tab_acad = [];
  percentage_tab_proy = [];
  // percentage_tab_prod = [];
  posgrados = [];
  show_info = false;
  show_profile = false;
  show_acad = false;
  show_expe = false;
  show_proy = false;
  show_prod = false;
  info_contacto: boolean;
  info_persona: boolean;
  info_caracteristica: boolean;
  button_politica: boolean = true;
  programa_seleccionado: any;
  selectedValue: any;

  constructor(
    private autenticacion: ImplicitAutenticationService,
    private personaService: PersonaService,
    private translate: TranslateService,
  //  private router: Router,
    private admisionesService: AdmisionesService,
    private programaService: ProgramaAcademicoService) {
    this.translate = translate;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
    this.getInfoPersonaId();
    this.loadInfoPostgrados();
    // if (this.autenticacion.live()) {
    //  this.loadInfoPostgrados();
    // }else {
    //  Swal({type: 'error', text: ' No hay sesión abierta'});
    //  this.router.navigate(['/']);
    // }
  }

  setPercentage_info(number, tab) {
    this.percentage_tab_info[tab] = (number * 100) / 3;
    this.percentage_info = Math.round(UtilidadesService.getSumArray(this.percentage_tab_info));
  }

  setPercentage_acad(number, tab) {
    this.percentage_tab_info[tab] = (number * 100) / 1;
    this.percentage_info = Math.round(UtilidadesService.getSumArray(this.percentage_tab_info));
  }

  setPercentage_expe(number, tab) {
    this.percentage_tab_info[tab] = (number * 100) / 1;
    this.percentage_info = Math.round(UtilidadesService.getSumArray(this.percentage_tab_info));
  }
  setPercentage_proy(number, tab) {
    this.percentage_tab_proy[tab] = (number * 100) / 1;
    this.percentage_proy = Math.round(UtilidadesService.getSumArray(this.percentage_tab_proy));
}

  // setPercentage_prod(number, tab) {
  //   this.percentage_tab_prod[tab] = (number * 100) / 1;
  //   this.percentage_prod = Math.round(UtilidadesService.getSumArray(this.percentage_tab_prod));
  // }

  traerInfoPersona(event, tab) {
    this.setPercentage_info(event, tab);
    if (event !== 0) this.getInfoPersonaId();
  }

  loadInfoPostgrados() {
    this.programaService.get('programa_academico/?limit=0')
      .subscribe(res => {
        const r = <any>res;
        if (res !== null && r.Type !== 'error') {
          this.posgrados = <any>res;
          this.admisionesService.get(`admision/?query=Aspirante:${this.info_ente_id}`)
      .subscribe(res_2 => {
        const r_2 = <any>res_2;
        if (res_2 !== null && r_2.Type !== 'error') {
          this.selectedValue = res[res_2[0].ProgramaAcademico - 1];
        }
      },
      (error_2: HttpErrorResponse) => {
        Swal({
          type: 'error',
          title: error_2.status + '',
          text: this.translate.instant('ERROR.' + error_2.status),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      });
        }
      },
      (error: HttpErrorResponse) => {
        Swal({
          type: 'error',
          title: error.status + '',
          text: this.translate.instant('ERROR.' + error.status),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      });
  }

  getInfoPersonaId() {
    interface ResponseId {
      Id: number;
      Ente: number;
    }
    if (this.autenticacion.live()) {
      this.personaService.get('persona/?query=Usuario:' + this.autenticacion.getPayload().sub)
        .subscribe(res => {
          const r = <any>res;
          if (res !== null && r.Type !== 'error') {
            this.info_info_persona = <ResponseId>res[0];
            this.info_persona_id = this.info_info_persona.Id;
            this.info_ente_id = this.info_info_persona.Ente;
          }
        },
        (error: HttpErrorResponse) => {
          Swal({
            type: 'error',
            title: error.status + '',
            text: this.translate.instant('ERROR.' + error.status),
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          });
        });
    } else {
      this.info_persona_id = undefined;
      this.info_ente_id = undefined;
    }
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  perfil_editar(event): void {
    switch (event) {
      case 'info_contacto':
        this.show_info = true;
        this.show_profile = false;
        this.show_acad = false;
        this.show_expe = false;
        this.info_contacto = true;
        this.info_caracteristica = false;
        this.info_persona = false;
        this.show_proy = false;
        this.show_prod = false;
        break;
      case 'info_caracteristica':
        this.show_info = true;
        this.show_profile = false;
        this.show_acad = false;
        this.show_expe = false;
        this.info_contacto = false;
        this.info_caracteristica = true;
        this.info_persona = false;
        this.show_proy = false;
        this.show_prod = false;
        break;
      case 'info_persona':
        this.show_info = true;
        this.show_profile = false;
        this.show_acad = false;
        this.show_expe = false;
        this.info_contacto = false;
        this.info_caracteristica = false;
        this.info_persona = true;
        this.show_proy = false;
        this.show_prod = false;
        break;
      case 'experiencia_laboral':
        this.show_info = false;
        this.show_profile = false;
        this.show_acad = false;
        this.show_expe = true;
        this.show_proy = false;
        this.show_prod = false;
        break;
      case 'formacion_academica':
        this.show_info = false;
        this.show_profile = false;
        this.show_acad = true;
        this.show_expe = false;
        this.show_proy = false;
        this.show_prod = false;
        break;
      case 'produccion_academica':
        this.show_info = false;
        this.show_profile = false;
        this.show_acad = false;
        this.show_expe = false;
        this.info_contacto = false;
        this.info_caracteristica = false;
        this.info_persona = true;
        this.show_proy = false;
        this.show_prod = true;
        break;
      case 'propuesta_grado':
        this.show_info = false;
        this.show_profile = false;
        this.show_acad = false;
        this.show_expe = false;
        this.show_proy = true;
        this.show_prod = false;
        break;
      case 'perfil':
        this.show_info = false;
        this.show_profile = true;
        this.show_acad = false;
        this.show_expe = false;
        this.show_proy = false;
        this.show_prod = false;
        break;
      default:
        this.show_info = false;
        this.show_profile = false;
        this.show_acad = false;
        this.show_expe = false;
        this.show_proy = false;
        this.show_prod = false;
        break;
    }
  }

  selectTab(event): void {
    if (event.tabTitle === this.translate.instant('GLOBAL.info_persona')) {
      if (this.info_persona)
        this.perfil_editar('info_persona');
    } else if (event.tabTitle === this.translate.instant('GLOBAL.info_caracteristica')) {
      this.perfil_editar('info_caracteristica');
    } else if (event.tabTitle === this.translate.instant('GLOBAL.informacion_contacto')) {
      this.perfil_editar('info_contacto');
    }
  }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  pruebita() {
    window.localStorage.setItem('programa', this.selectedValue.Id);
  }

  public captureScreen() {
    const data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      // const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      // const heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('MYPdf.pdf');
    });
  }
}
