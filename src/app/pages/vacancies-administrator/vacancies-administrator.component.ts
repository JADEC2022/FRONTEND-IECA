import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { VacanciesAdministratorService } from './vacancies-administrator.service';
import { VacantesI } from '../../models/vacante';
import { AuthResponseI } from '../../models/auth-response';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vacancies-administrator',
  templateUrl: './vacancies-administrator.component.html',
  styleUrls: ['./vacancies-administrator.component.css']
})
export class VacanciesAdministratorComponent implements OnInit {

  vacantes: VacantesI[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private vacantesAdministradorService: VacanciesAdministratorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    /*const formData = { estado: null }
    this.vacantesAdministradorService.getVacantesByEstado(formData).subscribe((resp: AuthResponseI) => {
        if (resp.status) {
          this.vacantes = resp.data;
        }
    });*/
    this.getVacantesSinEstado();
  }

  getVacantesSinEstado(): void {
    const formData = { estado: null }
    this.vacantesAdministradorService.getVacantesByEstado(formData).subscribe((resp: AuthResponseI) => {
        if (resp.status) {
          this.vacantes = resp.data;
        }
    });
  }

  aceptarVacante(vacante: VacantesI): void {
    this.vacantesAdministradorService.aceptarVacante(vacante.id_vacante).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.vacantes = [];
        this.getVacantesSinEstado();
        this.doneMassage("Vacante ACEPTADA, se le ha mandado un correo a la empresa para notificarle de ello");
      } else {
        this.errorMassage("No fue posible ACEPTAR la vacante");
      }
    });
  }

  rechazarVacante(vacante: VacantesI): void {
    const idAdmin = parseInt(localStorage.getItem("id_usuario"));
    this.vacantesAdministradorService.rechazarVacante(vacante.id_vacante, idAdmin).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.vacantes = [];
        this.getVacantesSinEstado();
        this.doneMassage("Vacante RECHAZADA, se le ha mandado un correo a la empresa para notificarle de ello");
      } else {
        this.errorMassage("No fue posible RECHAZAR la vacante");
      }
    });
  }

  enEsperaVacante(vacante: VacantesI): void {
    this.vacantesAdministradorService.enEsperaVacante(vacante.id_vacante).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.vacantes = [];
        this.getVacantesSinEstado();
        this.doneMassage("Vacante puesta EN ESPERA, se le ha mandado un correo a la empresa para notificarle de ello");
      } else {
        this.errorMassage("No fue posible poner EN ESPERA la vacante");
      }
    });
  }

  doneMassage(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Estado actualizado',
      text: message,
      showConfirmButton: false,
      timer: 4000
    });
  }

  errorMassage(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Ocurrió un error',
      text: message,
      showConfirmButton: false,
      timer: 4000
    });
  }

}