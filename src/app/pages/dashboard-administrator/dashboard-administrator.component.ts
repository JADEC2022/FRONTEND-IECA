import { Component, OnInit } from '@angular/core';
import { DashboardAdministratorService } from "./dashboard-administrator.service";
import { EmpresaI } from 'app/models/empresa';
import { AuthResponseI } from '../../models/auth-response';
import { EmpresaService } from '../company-profile/empresa.service';
import { VacantesI } from 'app/models/vacante';
import { AdministradorAccionI } from '../../models/administrador-acciones';

@Component({
  selector: 'app-dashboard-administrator',
  templateUrl: './dashboard-administrator.component.html',
  styleUrls: ['./dashboard-administrator.component.css']
})
export class DashboardAdministratorComponent implements OnInit {
  empresasAceptadas: EmpresaI[] = [];
  empresasEnEspera: EmpresaI[] = [];
  empresasRechazadas: EmpresaI[] = [];

  vacantesAceptadas: VacantesI[] = [];
  vacantesEnEspera: VacantesI[] = [];
  vacantesRechazadas: VacantesI[] = [];

  administradorAcciones: AdministradorAccionI [] = [];

  constructor(private dashboardAdministratorService: DashboardAdministratorService) { }

  ngOnInit(): void {
    this.getEmpresasByEstadoAceptada('ACEPTADA');
    this.getEmpresasByEstadoEnEspera('EN ESPERA');
    this.getEmpresasByEstadoRechazada('RECHAZADA');
   

    this.getVacantesByEstadoAceptada('ACEPTADA');
    this.getVacantesByEstadoEnEspera('EN ESPERA');
    this.getVacantesByEstadoRechazada('RECHAZADA');

	this.getAdministradorAcciones();
  }

  getEmpresasByEstadoAceptada(estado: "ACEPTADA"): void {
		const formData = { estado: estado };
		this.dashboardAdministratorService
			.getCompanysByEstado(formData)
			.subscribe((resp: AuthResponseI) => {
				if (resp.status) {
            this.empresasAceptadas = resp.data
				}

			});
	}

  getEmpresasByEstadoEnEspera(estado: "EN ESPERA"): void {
		const formData = { estado: estado };
		this.dashboardAdministratorService
			.getCompanysByEstado(formData)
			.subscribe((resp: AuthResponseI) => {
				if (resp.status) {
            this.empresasEnEspera = resp.data
				}
			});
	}

  getEmpresasByEstadoRechazada(estado: "RECHAZADA"): void {
		const formData = { estado: estado };
		this.dashboardAdministratorService
			.getCompanysByEstado(formData)
			.subscribe((resp: AuthResponseI) => {
				if (resp.status) {
            this.empresasRechazadas = resp.data
				}
			});
	}

   getVacantesByEstadoAceptada(estado: "ACEPTADA"): void {
	 	const formData = { estado: estado };
	 	this.dashboardAdministratorService
	 		.getVacanciesByEstado(formData)
	 		.subscribe((resp: AuthResponseI) => {
	 			if (resp.status) {
             this.vacantesAceptadas = resp.data
	 			}
	 		});
	 }

   getVacantesByEstadoEnEspera(estado: "EN ESPERA"): void {
	 	const formData = { estado: estado };
	 	this.dashboardAdministratorService
	 		.getVacanciesByEstado(formData)
	 		.subscribe((resp: AuthResponseI) => {
	 			if (resp.status) {
             this.vacantesEnEspera = resp.data
	 			}
	 		});
	 }

   getVacantesByEstadoRechazada(estado: "RECHAZADA"): void {
	 	const formData = { estado: estado };
	 	this.dashboardAdministratorService
	 		.getVacanciesByEstado(formData)
	 		.subscribe((resp: AuthResponseI) => {
	 			if (resp.status) {
             this.vacantesRechazadas = resp.data
	 			}
	 		});
	 }

	 getAdministradorAcciones(): void{
		this.dashboardAdministratorService.getActionsByAdministrator()
		.subscribe((resp: AuthResponseI) => {
			if (resp.status) {
		this.administradorAcciones = resp.data
			}
		});
	 }

}