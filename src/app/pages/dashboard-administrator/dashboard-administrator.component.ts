import { Component, OnInit } from '@angular/core';
import { DashboardAdministratorService } from "./dashboard-administrator.service";
import { EmpresaI } from 'app/models/empresa';
import { AuthResponseI } from '../../models/auth-response';
import { PageEvent } from "@angular/material/paginator";
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

	administradorAccionesHoy: AdministradorAccionI[] = [];
	administradorAccionesAyer: AdministradorAccionI[] = [];
	administradorAccionesTodas: AdministradorAccionI[] = [];

	page_size_recent_activitys: number = 5;
	page_number_recent_activitys: number = 1;
	pageSizeOptionsRecentActivitys: number[] = [5, 10];

	page_size_recent_companys: number = 5;
	page_number_recent_companys: number = 1;
	pageSizeOptionsRecentCompanys: number[] = [5, 10];

    page_size_recent_vacancies: number = 5;
    page_number_recent_vacancies: number = 1;
    pageSizeOptionsRecentVacancies: number[] = [5, 10];

  constructor(private dashboardAdministratorService: DashboardAdministratorService) { }

  ngOnInit(): void {
    this.getEmpresasByEstado('ACEPTADA');
    this.getEmpresasByEstado('RECHAZADA');
	this.getEmpresasByEstado('EN ESPERA');
   

    this.getVacantesByEstado('ACEPTADA');
	this.getVacantesByEstado('RECHAZADA');
	this.getVacantesByEstado('EN ESPERA');
    

	this.getAdministradorAcciones();
	this.getAdministradorAccionesFiltroDia('hoy');
	this.getAdministradorAccionesFiltroDia('ayer');

  }

  getEmpresasByEstado(estado): void {
		const formData = { estado: estado };
		this.dashboardAdministratorService
			.getCompanysByEstado(formData)
			.subscribe((resp: AuthResponseI) => {
				if (resp.status) {
					if(estado === 'ACEPTADA'){
						this.empresasAceptadas = resp.data;
					} else if (estado === 'RECHAZADA'){
						this.empresasRechazadas = resp.data;
					} else if (estado === 'EN ESPERA') {
						this.empresasEnEspera = resp.data;
					}
				}
			});
	}

   getVacantesByEstado(estado): void {
	 	const formData = { estado: estado };
	 	this.dashboardAdministratorService
	 		.getVacanciesByEstado(formData)
	 		.subscribe((resp: AuthResponseI) => {
	 			if (resp.status) {
            		if(estado === 'ACEPTADA'){
						this.vacantesAceptadas = resp.data;
					} else if (estado === 'RECHAZADA'){
						this.vacantesRechazadas = resp.data;
					} else if (estado === 'EN ESPERA') {
						this.vacantesEnEspera = resp.data;
					}
	 			}
	 		});
	 }

	 getAdministradorAcciones(): void{
		this.dashboardAdministratorService.getActionsByAdministrator()
		.subscribe((resp: AuthResponseI) => {
			if (resp.status) {
				this.administradorAccionesTodas = resp.data
			}
		});
	 }

	 getAdministradorAccionesFiltroDia(filtrodia): void{
		this.dashboardAdministratorService.getActionsByAdministratorFiltroDia(filtrodia)
		.subscribe((resp: AuthResponseI) => {
			if (resp.status) {
				if(filtrodia === 'hoy'){
					this.administradorAccionesHoy = resp.data;
				} else {
					this.administradorAccionesAyer = resp.data;
				}
			}
		});
	 }

	 urlEmpresa(id: number){
		return `#/company-administrator/${id}`
	 }

	 urlVacante(id: number){
		return `#/vacancies-administrator/${id}`
	 }

	 handlePageRecentActivitys(e: PageEvent) {
		this.page_size_recent_activitys = e.pageSize;
		this.page_number_recent_activitys = e.pageIndex + 1;
	}

	handlePageRecentCompanys(e: PageEvent) {
		this.page_size_recent_companys = e.pageSize;
		this.page_number_recent_companys = e.pageIndex + 1;
	}

	handlePageRecentVacancies(e: PageEvent) {
		this.page_size_recent_vacancies = e.pageSize;
		this.page_number_recent_vacancies = e.pageIndex + 1;
	}
}