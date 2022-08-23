import { Component, Host, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { CursoCertificacionI } from '../../../../models/cursos-certificaciones';
import { AuthResponseI } from '../../../../models/auth-response';
import Swal from 'sweetalert2';
import { UserProfileComponent } from 'app/pages/user-profile/user-profile.component';
import { CursoCertificacionService } from './curso-certificacion.service';
@Component({
  selector: 'app-curso-certificacion-form',
  templateUrl: './curso-certificacion.component.html',
  styleUrls: ['./curso-certificacion.component.css']
})
export class CursoCertificacionComponent implements OnInit {

  public formSubmitted = false;
  @Input() cursoCertificacion: CursoCertificacionI;
  @Input() tipo: string;

  public certificadoForm = this.formBuilder.group(
    {
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      link: ['']
    }
  )

  constructor(private formBuilder: FormBuilder, 
    @Host() private _userProC: UserProfileComponent,
    private cursoCertificacionService: CursoCertificacionService
    ) { }

  ngOnInit(): void {
    if (this.tipo == 'update') {
      this.loadData(this.cursoCertificacion);
    }
  }

  campoNoValido(campo: string): boolean {
    if(this.certificadoForm.get(campo).invalid && this.formSubmitted){
      return true;
    } else {
      return false;
    }
  }

  loadData(cursoCertificacion: CursoCertificacionI) {
    this.certificadoForm.reset(cursoCertificacion);
  }

  actionForm(formDirective: FormGroupDirective){
    if(this.tipo == 'add'){
      this.addCursoCert(formDirective);
    } else {
      this.updateCursoCert();
    }
  }

  addCursoCert(formDirective: FormGroupDirective){
    this.formSubmitted = true;
    if(this.certificadoForm.valid) {
      this.cursoCertificacionService.addCursoCertifi(this.certificadoForm.value).subscribe((resp: AuthResponseI) => {
        if (resp.status) {
          this._userProC.getCursosCertificaciones();
          this.formSubmitted = false;
          this.certificadoForm.reset();
          formDirective.resetForm();
          this._userProC.panelCurC = false;
          this.doneMassage('Curso y/o certificación registrado');
        } else {
          this.errorPeticion('Error al registrar elcurso y/o certificación');
        }
      }, (error) => this.errorServer(error));
    } else {
      this.errorMassage();
    }
  }

  cancelarAdd(formDirective: FormGroupDirective) {
    this.formSubmitted = false;
    this.certificadoForm.reset();
    formDirective.resetForm();
    this._userProC.panelCurC = false;
  }

  updateCursoCert(){
    this.formSubmitted = true;
    if(this.certificadoForm.valid) {
      this.cursoCertificacionService.updateCursoCertifi(this.cursoCertificacion.id_curso_certificacion, this.certificadoForm.value).subscribe((resp: AuthResponseI) => {
        if (resp.status) {
          this._userProC.getCursosCertificaciones();
          this.doneMassage('Curso y/o certificación Actualizado');
        } else {
          this.errorPeticion('Error al actualizar el curso y/o certificación');
        }
      }, (error) => this.errorServer(error));
    } else {
      this.errorMassage();
    }
  }

  deleteCursoCert(){
    this.cursoCertificacionService.deleteCursoCertifi(this.cursoCertificacion.id_curso_certificacion).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this._userProC.getCursosCertificaciones();
        this.doneMassage('Curso y/o certificación eliminado');
      } else {
        this.errorPeticion('Error al eliminar el curso y/o certificación');
      }
    }, (error) => this.errorServer(error));
  }

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
}
