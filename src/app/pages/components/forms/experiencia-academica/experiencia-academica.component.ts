import { Component, Host, Input, OnInit } from '@angular/core';
import { Form, FormControl, FormGroupDirective } from '@angular/forms';
import {MAT_DATE_FORMATS} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import { FormBuilder, Validators } from "@angular/forms";
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import * as _rollupMoment from 'moment';

import {Moment} from 'moment';
import { ExperienciaAcademicaI } from '../../../../models/experiencia-academica';
import Swal from 'sweetalert2';
import { AuthResponseI } from '../../../../models/auth-response';
import { UserProfileComponent } from 'app/pages/user-profile/user-profile.component';
import { ExperienciaAcademicaService } from './experiencia-academica.service';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-experiencia-academica-form',
  templateUrl: './experiencia-academica.component.html',
  styleUrls: ['./experiencia-academica.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class ExperienciaAcademicaComponent implements OnInit {

  public formSubmitted = false;
  @Input() experienciaAcademica: ExperienciaAcademicaI;
  @Input() tipo: string;
  activedAnio_salida = false;

  
  public academicaForm = this.formBuilder.group(
    {
      nivel: ['', Validators.required],
      institucion: ['', Validators.required],
      anio_entrada: ['', Validators.required],
      anio_salida: [''],
      carrera: [''],
      estudiando: [false]
    }
  )
 /*  date = new FormControl(moment([2000]));
  date2 = new FormControl(moment([2000]));
   */
  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>, tipo: number) {
    if (tipo == 1) {
      if (!moment(this.academicaForm.get('anio_entrada').value).isValid()) {
        this.academicaForm.get('anio_entrada').setValue(moment([2000]));
      } 
      const ctrlValue = this.academicaForm.get('anio_entrada').value;
      ctrlValue.year(normalizedYear.year());
      this.academicaForm.get('anio_entrada').setValue(ctrlValue);
      datepicker.close();
    } else {
      if (!moment(this.academicaForm.get('anio_salida').value).isValid()) {
        this.academicaForm.get('anio_salida').setValue(moment([2000]));
      } 
      const ctrlValue2 = this.academicaForm.get('anio_salida').value;
      ctrlValue2.year(normalizedYear.year());
      this.academicaForm.get('anio_salida').setValue(ctrlValue2);
      datepicker.close();
    }
  }
  
  constructor(
    private formBuilder: FormBuilder, 
    @Host() private _userProC: UserProfileComponent,
    private expAcademicaSerice: ExperienciaAcademicaService
    ) { }

  ngOnInit(): void {
    if (this.tipo == 'update') {
      this.loadData(this.experienciaAcademica);
    }
  }
  campoNoValido(campo: string): boolean {
    if(this.academicaForm.get(campo).invalid && this.formSubmitted){
      return true;
    } else {
      return false;
    }
  }

  anioEntradaValido(){
    if(!this.formSubmitted) return false;

    let anio_entrada = this.academicaForm.get('anio_entrada').value;
    let anio = moment(anio_entrada);

    if(anio.isValid()) return false;
    
    return true;
  }

  anioSalidaValido(){
    if(!this.formSubmitted && this.activedAnio_salida) return  false;

    let anio_salida = this.academicaForm.get('anio_salida').value;
    let anio = moment(anio_salida);

    if(anio.isValid()) return false;

    return true;
  }

  loadData( expAcademica: ExperienciaAcademicaI) {
    if (expAcademica.estudiando) {
      this.activedAnio_salida = true;
    }
    this.academicaForm.reset(expAcademica);
    let anio_entrada = moment(expAcademica.anio_entrada, 'YYYY');
    this.academicaForm.get('anio_entrada').setValue(anio_entrada); 
    let anio_salida = moment(expAcademica.anio_salida, 'YYYY');
    this.academicaForm.get('anio_salida').setValue(anio_salida); 

  }

  actionForm(formDirective: FormGroupDirective){
    if(this.tipo=='add'){
      this.addExpAcademica(formDirective);
    } else {
      this.updateExpAcademica();
    }
  }

  addExpAcademica(formDirective: FormGroupDirective){
    this.formSubmitted = true;
    if(this.academicaForm.valid) {
      this.expAcademicaSerice.addExpAcademica(this.academicaForm.value).subscribe((resp: AuthResponseI) => {
        if (resp.status) {
          this._userProC.getExperienciasAcademicas();
          this.formSubmitted = false;
          this.academicaForm.reset();
          formDirective.resetForm();
          this.academicaForm.get('estudiando').setValue(false);
          this._userProC.panelExpA = false;
          this.doneMassage('Experiencia academica registrada');
        } else {
          this.errorPeticion('Error al registrar la experiencia academica');
        }
      }, (error) => this.errorServer(error));
    } else {
      this.errorMassage();
    }
  }

  cancelarAdd(formDirective: FormGroupDirective) {
    this.formSubmitted = false;
    this.academicaForm.reset();
    formDirective.resetForm();
    this.academicaForm.get('estudiando').setValue(false);
    this._userProC.panelExpA = false;
  }

  updateExpAcademica(){
    this.formSubmitted = true;
    if(this.academicaForm.valid){
      this.expAcademicaSerice.updateExpAcademica(this.experienciaAcademica.id_experiencia_academica, this.academicaForm.value).subscribe((resp: AuthResponseI) => {
        if (resp.status) {
          this._userProC.getExperienciasAcademicas();
          this.doneMassage('Experiencia academica actualizada');
        } else {
          this.errorPeticion('Error al actualizar la experiencia laboral');
        }
      }, (error) => this.errorServer(error));
    } else {
      this.errorMassage();
    }
  }

  deleteExpAcademica(){
    this.expAcademicaSerice.deleteExpAcademica(this.experienciaAcademica.id_experiencia_academica).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this._userProC.getExperienciasAcademicas();
        this.doneMassage('Experiencia academica eliminada');
      } else {
        this.errorPeticion('Error al eliminar la experiencia academica');
      }
    }, (error) => this.errorServer(error));
  }

  /* loadFechasForm() {
    if (!this.activedAnio_salida) {
      let date = moment(this.date.value);
      let anio_entrada = date.format('YYYY');
      this.academicaForm.get('anio_entrada').setValue(anio_entrada);
      let date2 = moment(this.date2.value);
      let anio_salida = date2.format('YYYY');
      this.academicaForm.get('anio_salida').setValue(anio_salida);
    } else {
      let date = moment(this.date.value);
      let anio_entrada = date.format('YYYY');
      this.academicaForm.get('anio_entrada').setValue(anio_entrada);
    }
  } */

  //  ---------- MENSAJES ---------- //
  errorServer(error: any): void { // Lo sentimos su petición no puede ser procesada, favor de ponerse en contacto con soporte técnico
    Swal.fire({
      icon: 'error',
      title: 'Petición no procesada',
      text: `Vuelve a intentar de nuevo.
      Si el error persiste, comuníquese con el soporte técnico.`,
    });
    console.log(error);
  }

  errorMassage(): void {
    Swal.fire({
      icon: 'error',
      title: 'Verifica el formulario',
      text: 'Verifica que el formulario este completo.',
      showConfirmButton: false,
      timer: 2700
    });
  }

  doneMassage(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Cambios Actualizados',
      text: message,
      showConfirmButton: false,
      timer: 2700
    });
  }

  errorPeticion(error: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error,
      showConfirmButton: false,
      timer: 2700
    });
  }

  ischecked() {
    if (this.academicaForm.get('estudiando').value) {
      this.activedAnio_salida = false;
    } else {
      this.activedAnio_salida = true;
    }
  }

}
