import { ImplicitAutenticationService } from '../../../@core/utils/implicit_autentication.service';
import { NuxeoService } from '../../../@core/utils/nuxeo.service';
import { Admision } from './../../../@core/data/models/admision';
import { InfoPersona } from './../../../@core/data/models/info_persona';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocumentoService } from '../../../@core/data/documento.service';
import { CampusMidService } from '../../../@core/data/campus_mid.service';
import { AdmisionesService } from '../../../@core/data/admisiones.service';
import { PersonaService } from '../../../@core/data/persona.service';
import { FORM_INFO_PERSONA } from './form-info_persona';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import { IAppState } from '../../../@core/store/app.state';
import { Store } from '@ngrx/store';
import { ListService } from '../../../@core/store/services/list.service';
import { UserService } from '../../../@core/data/users.service';

@Component({
  selector: 'ngx-crud-info-persona',
  templateUrl: './crud-info_persona.component.html',
  styleUrls: ['./crud-info_persona.component.scss'],
})
export class CrudInfoPersonaComponent implements OnInit {
  filesUp: any;
  Foto: any;
  SoporteDocumento: any;
  config: ToasterConfig;
  info_persona_id: number;

  @Input('info_persona_id')
  set name(info_persona_id: number) {
    this.info_persona_id = info_persona_id;
    this.loadInfoPersona();
    // this.loadAdmision();
    console.info ('InfoPersonaId: ' + info_persona_id);
  }

  @Output() eventChange = new EventEmitter();

  @Output('result') result: EventEmitter<any> = new EventEmitter();

  info_info_persona: any;
  formInfoPersona: any;
  regInfoPersona: any;
  info_admision: any;
  clean: boolean;
  loading: boolean;
  percentage: number;
  aceptaTerminos: boolean;
  programa: number = 1;
  aspirante: number;
  periodo: any;

  constructor(
    private translate: TranslateService,
    private campusMidService: CampusMidService,
    private autenticationService: ImplicitAutenticationService,
    private documentoService: DocumentoService,
    private nuxeoService: NuxeoService,
    private store: Store < IAppState > ,
    private listService: ListService,
    private admisionesService: AdmisionesService,
    private userService: UserService,
    private personaService: PersonaService,
    private toasterService: ToasterService) {
    this.formInfoPersona = FORM_INFO_PERSONA;
    this.construirForm();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.construirForm();
    });
    this.listService.findGenero();
    this.listService.findEstadoCivil();
    this.listService.findTipoIdentificacion();
    this.loading = false;
    this.CargarPeriodo();
    this.loadLists();
  }

  construirForm() {
    // this.formInfoPersona.titulo = this.translate.instant('GLOBAL.info_persona');
    this.formInfoPersona.btn = this.translate.instant('GLOBAL.guardar');
    for (let i = 0; i < this.formInfoPersona.campos.length; i++) {
      this.formInfoPersona.campos[i].label = this.translate.instant('GLOBAL.' + this.formInfoPersona.campos[i].label_i18n);
      this.formInfoPersona.campos[i].placeholder = this.translate.instant('GLOBAL.placeholder_' + this.formInfoPersona.campos[i].label_i18n);
    }
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  getIndexForm(nombre: String): number {
    for (let index = 0; index < this.formInfoPersona.campos.length; index++) {
      const element = this.formInfoPersona.campos[index];
      if (element.nombre === nombre) {
        return index
      }
    }
    return 0;
  }

  public loadAdmision(): void {
    // if (this.admision_id !== undefined && this.admision_id !== 0) {
    console.info (this.info_persona_id)
      this.admisionesService.get('admision/?query=Aspirante:' + this.info_persona_id + ',periodo:1')
        .subscribe(res => {
          if (res !== null) {
            this.info_admision = res[0];
                if (res !== null ) {
                  this.info_admision = <Admision>res[0];
                  console.info('Estado Terminos: ' + this.info_admision.AceptaTerminos)
                    this.aceptaTerminos = true;
                }
          }
        });
   }
  public loadInfoPersona(): void {
    this.loading = true;
    if (this.info_persona_id !== undefined && this.info_persona_id !== 0 &&
      this.info_persona_id.toString() !== '') {
      this.campusMidService.get('persona/ConsultaPersona/?id=' + this.info_persona_id)
        .subscribe(res => {
          if (res !== null) {
            const temp = <InfoPersona>res;
            const files = []
            if (temp.Foto + '' !== '0') {
              files.push({ Id: temp.Foto, key: 'Foto' });
            }
            if (temp.SoporteDocumento + '' !== '0') {
              files.push({ Id: temp.SoporteDocumento, key: 'SoporteDocumento' });
            }
            this.nuxeoService.getDocumentoById$(files, this.documentoService)
              .subscribe(response => {
                const filesResponse = <any>response;
                if (Object.keys(filesResponse).length === files.length) {
                  this.info_info_persona = temp;
                  this.Foto = this.info_info_persona.Foto;
                  this.SoporteDocumento = this.info_info_persona.SoporteDocumento;
                  this.info_info_persona.Foto = filesResponse['Foto'] + '';
                  this.info_info_persona.SoporteDocumento = filesResponse['SoporteDocumento'] + '';
                  this.loading = false;
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
      this.info_info_persona = undefined
      this.clean = !this.clean;
      this.loading = false;
  }
  this.loadAdmision()
  }

  updateInfoPersona(infoPersona: any): void {
    const opt: any = {
      title: this.translate.instant('GLOBAL.actualizar'),
      text: this.translate.instant('GLOBAL.actualizar') + '?',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      cancelButtonText: this.translate.instant('GLOBAL.cancelar'),
    };
    Swal(opt)
      .then((willDelete) => {
        if (willDelete.value) {
          this.loading = true;
          this.info_info_persona = <any>infoPersona;
          const files = [];
          if (this.info_info_persona.Foto.file !== undefined) {
            files.push({ file: this.info_info_persona.Foto.file, documento: this.Foto, key: 'Foto' });
          }
          if (this.info_info_persona.SoporteDocumento.file !== undefined) {
            files.push({ file: this.info_info_persona.SoporteDocumento.file, documento: this.SoporteDocumento, key: 'SoporteDocumento' });
          }
          if (files.length !== 0) {
            this.nuxeoService.updateDocument$(files, this.documentoService)
              .subscribe(response => {
                if (Object.keys(response).length === files.length) {
                  const documentos_actualizados = <any>response;
                  this.info_info_persona.Foto = this.Foto;
                  this.info_info_persona.SoporteDocumento = this.SoporteDocumento;
                  this.campusMidService.put('persona/ActualizarPersona', this.info_info_persona)
                    .subscribe(res => {
                      if (documentos_actualizados['Foto'] !== undefined) {
                        this.info_info_persona.Foto = documentos_actualizados['Foto'].url + '';
                      }
                      if (documentos_actualizados['SoporteDocumento'] !== undefined) {
                        this.info_info_persona.SoporteDocumento = documentos_actualizados['SoporteDocumento'].url + '';
                      }
                      this.loading = false;
                      this.eventChange.emit(true);
                      this.loadInfoPersona();
                      this.showToast('info', this.translate.instant('GLOBAL.actualizar'),
                        this.translate.instant('GLOBAL.info_persona') + ' ' +
                        this.translate.instant('GLOBAL.confirmarActualizar'));
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
            console.info(this.info_info_persona);
            this.info_info_persona.Foto = this.Foto;
            this.info_info_persona.SoporteDocumento = this.SoporteDocumento;
            this.campusMidService.put('persona/ActualizarPersona', this.info_info_persona)
              .subscribe(res => {
                this.eventChange.emit(true);
                this.loadInfoPersona();
                this.loading = false;
                this.showToast('info', this.translate.instant('GLOBAL.actualizar'),
                  this.translate.instant('GLOBAL.info_persona') + ' ' +
                  this.translate.instant('GLOBAL.confirmarActualizar'));
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
        }
         // this.createAdmision(this.info_info_persona.ente);
      });
  }

  createInfoPersona(infoPersona: any): void {
    const opt: any = {
      title: this.translate.instant('GLOBAL.crear'),
       // text: this.translate.instant('GLOBAL.crear') + '?',
       type: 'success',
       showConfirmButton: true,
       //   timer: 1500,
       //   buttons: true,
       confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
    };
    Swal(opt)
      .then((willDelete) => {
        this.loading = true;
        if (willDelete.value) {
          const files = []
          this.info_info_persona = <any>infoPersona;
          console.info(this.info_info_persona);
          if (this.info_info_persona.Foto.file !== undefined) {
            files.push({
              nombre: this.autenticationService.getPayload().sub, key: 'Foto',
              file: this.info_info_persona.Foto.file, IdDocumento: 1});
          }
          if (this.info_info_persona.SoporteDocumento.file !== undefined) {
            files.push({
              nombre: this.autenticationService.getPayload().sub, key: 'SoporteDocumento',
              file: this.info_info_persona.SoporteDocumento.file, IdDocumento: 2});
          }
          this.nuxeoService.getDocumentos$(files, this.documentoService)
            .subscribe(response => {
              if (Object.keys(response).length === files.length) {
                this.filesUp = <any>response;
                if (this.filesUp['Foto'] !== undefined) {
                  this.info_info_persona.Foto = this.filesUp['Foto'].Id;
                }
                if (this.filesUp['SoporteDocumento'] !== undefined) {
                  this.info_info_persona.SoporteDocumento = this.filesUp['SoporteDocumento'].Id;
                }
                this.info_info_persona.Usuario = this.autenticationService.getPayload().sub;
                console.info(this.info_info_persona);
                this.campusMidService.post('persona/GuardarPersona', this.info_info_persona)
                  .subscribe(res => {
                    const r = <any>res
                    if (r !== null && r.Type !== 'error') {
                      this.eventChange.emit(true);
                      this.info_persona_id = r.Body.Ente;
                      this.createAdmision(this.info_persona_id);
                      this.loadInfoPersona();
                      this.loading = false;
                      this.showToast('info', this.translate.instant('GLOBAL.crear'),
                      this.translate.instant('GLOBAL.info_persona') + ' ' + this.translate.instant('GLOBAL.confirmarCrear'));
                    } else {
                      this.showToast('error', this.translate.instant('GLOBAL.error'),
                      this.translate.instant('GLOBAL.error'));
                    }
                  },
                  (error: HttpErrorResponse) => {
                    const usu = window.localStorage.getItem('usuario').toString()
                    this.personaService.get(`persona?query=Usuario:${usu}`)
                    .subscribe(res_usu => {
                      const r_usu = <any>res_usu;
                      if (res_usu !== null && r_usu.Type !== 'error') {
                        this.admisionesService.get(`admision/?query=Aspirante:${res_usu[0].Ente}`)
                        .subscribe(res_2 => {
                          const r_2 = <any>res_2;
                          if (res_2 !== null && r_2.Type !== 'error') {
                            console.info(`ya existe esta admision`);
                          } else {
                            console.info(`aun no existe una admision`);
                            this.info_persona_id =  res_usu[0].Ente;
                            this.createAdmision(res_usu[0].Ente);
                          }
                        },
                        (error_1: HttpErrorResponse) => {
                          Swal({
                            type: 'error',
                            title: error_1.status + '',
                            text: this.translate.instant('ERROR.' + error_1.status),
                            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                          });
                        });

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
                    Swal({
                      type: 'error',
                      title: error.status + '',
                      text: this.translate.instant('ERROR.' + error.status),
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
            })
        }
      });
  }

  ngOnInit() {
      // this.info_admision()
  }

  // validarForm(event) {
  //   if (event.valid) {
  //     if (this.info_info_persona === undefined) {
  //       this.validarTerminos(event);
  //       // this.createInfoPersona(event.data.InfoPersona);
  //     } else {
  //       this.validarTerminos(event);
  //       // this.updateInfoPersona(event.data.InfoPersona);
  //       // this.loadAdmision();
  //     }
  //   }
  // }

  validarForm(event) {
    // this.loadAdmision();
    if (event.valid) {
      if (this.info_admision === undefined) {
      // if (this.aceptaTerminos !== true) {
        this.validarTerminos(event);
      } else {
          if (this.info_admision.AceptaTerminos !== true) {
            this.validarTerminos(event);
            this.loadAdmision();
          }else {
             this.updateInfoPersona(event.data.InfoPersona)
           }
      }
    }
  }

  validarTerminos(event) {
    Swal({
      title: ' Política de privacidad y tratamiento de Datos ',
      width: 800,
      allowOutsideClick: true,
      allowEscapeKey: true,
      html: '<embed src="/assets/pdf/politicasUD.pdf" type="application/pdf" style="width:100%; height:375px;" frameborder="0"></embed>',
      input: 'checkbox',
      inputPlaceholder: 'He leido y estoy de acuerdo con los terminos de la política de tratamiento y privacidad de la información',
      confirmButtonText: '<u>Aceptar</u>',
    })
    .then((result) => {
        if (result.value) {
            if ( this.info_info_persona === undefined) {
              this.createInfoPersona(event.data.InfoPersona);
            }else {
              this.updateInfoPersona(event.data.InfoPersona);
              if (this.info_admision === undefined) {
                this.createAdmision(this.info_persona_id)
              }else {
                this.updateAdmision();
              }
            }
            this.loadAdmision();
        } else if (result.value === 0) {
              Swal({type: 'error', text: ' Para poder guardar acepte los terminos'});
              this.aceptaTerminos = false;
              // this.loading = false;  // rev
        }
        // } else if (result.dismiss === Swal.DismissReason.cancel) {
        //     Swal(
        //         'Cancelled',
        //         'Your imaginary file is safe :)',
        //         'error',
        //       )
        //     }
    });
  }
  createAdmision(ente_id): void {
    // this.loadInfoPersona();
    console.info(ente_id);
    this.aspirante = ente_id;
    this.programa = this.userService.getPrograma();
    console.info(`este es el aspirante numero: ${this.aspirante}`)
    const admisionPost = {
     Periodo: {
        Id: this.periodo.Id,
     },
     Aspirante: this.aspirante,
     ProgramaAcademico: this.programa,
     LineaInvestigacion: {
       Id: 1, // TODO: Cambiar a nulo
     },
     EstadoAdmision: {
       Id: 1,
     },
     Enfasis: {
       Id: 1, // TODO: Cambiar a nulo
     },
     AceptaTerminos: true,
   };
        console.info(admisionPost);
        this.info_admision = <Admision>admisionPost;
        this.info_admision.Aspirante = Number(this.info_persona_id);
        console.info(this.info_admision);
        this.admisionesService.post('admision', this.info_admision)
          .subscribe(res => {
            this.info_admision = <Admision>res;
            this.eventChange.emit(true);
            Swal({
              type: 'info',
              title: this.translate.instant('GLOBAL.crear'),
              text: `${this.translate.instant('GLOBAL.inscrito')} ${this.periodo.Nombre};`,
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
            // this.showToast('info', 'created', 'Admision created');
          });

  }
  updateAdmision(): void {
    this.loadAdmision();
    this.info_admision.AceptaTerminos = true;
    console.info(this.info_admision);
    this.admisionesService.put('admision', this.info_admision, this.info_admision.Id)
      .subscribe(res => {
        this.eventChange.emit(true);
        this.showToast('info', this.translate.instant('GLOBAL.actualizar'),
        this.translate.instant('GLOBAL.admision') + ' ' +
        this.translate.instant('GLOBAL.confirmarActualizar'));
      });
    this.loadAdmision();
  }

  setPercentage(event) {
    this.percentage = event;
    this.result.emit(this.percentage);
  }

  CargarPeriodo(): void {
    this.admisionesService.get('periodo_academico/?query=Activo:true&sortby=Id&order=desc&limit=1')
      .subscribe(res => {
        const r = <any>res;
        if (res !== null && r.Type !== 'error') {
          this.periodo = <any>res[0]; // se carga el periodo academico activo mas reciente
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

  private showToast(type: string, title: string, body: string) {
    this.config = new ToasterConfig({
      // 'toast-top-full-width', 'toast-bottom-full-width', 'toast-top-left', 'toast-top-center'
      positionClass: 'toast-top-center',
      timeout: 5000,  // ms
      newestOnTop: true,
      tapToDismiss: false, // hide on click
      preventDuplicates: true,
      animation: 'slideDown', // 'fade', 'flyLeft', 'flyRight', 'slideDown', 'slideUp'
      limit: 5,
    });
    const toast: Toast = {
      type: type, // 'default', 'info', 'success', 'warning', 'error'
      title: title,
      body: body,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.toasterService.popAsync(toast);
  }

  public loadLists() {
    this.store.select((state) => state).subscribe(
      (list) => {
        this.formInfoPersona.campos[this.getIndexForm('Genero')].opciones = list.listGenero[0];
        this.formInfoPersona.campos[this.getIndexForm('EstadoCivil')].opciones = list.listEstadoCivil[0];
        this.formInfoPersona.campos[this.getIndexForm('TipoIdentificacion')].opciones = list.listTipoIdentificacion[0];
      },
    );
  }
}
