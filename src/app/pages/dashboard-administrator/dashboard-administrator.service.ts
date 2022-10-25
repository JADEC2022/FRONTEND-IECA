import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
const baseUrlEmpresasAprobadas = environment.baseUrl + "/usuarios";
const baseUrlVacantesRechazadas = environment.baseUrl + "/vacantes";
const baseUrlAdministradorAcciones = environment.baseUrl + "/administrador-acciones"

const formData = {
	estado: null,
};

@Injectable({
	providedIn: "root",
})
export class DashboardAdministratorService {
	constructor(private http: HttpClient) {}

	getCompanysByEstado(formData) {
		return this.http.put(`${baseUrlEmpresasAprobadas}/empresa/1`, formData);
	}

    getVacanciesByEstado(formData) {
		return this.http.put(`${baseUrlVacantesRechazadas}/estado`, formData);
	}

	getActionsByAdministratorFiltroDia(filtrodia){
		const idAdministrator = localStorage.getItem("id_usuario");
		return this.http.get(`${baseUrlAdministradorAcciones}/${idAdministrator}/${filtrodia}`);
	}

	getActionsByAdministrator(){
		const idAdministrator = localStorage.getItem("id_usuario");
		return this.http.get(`${baseUrlAdministradorAcciones}/${idAdministrator}`);
	}
	
}
