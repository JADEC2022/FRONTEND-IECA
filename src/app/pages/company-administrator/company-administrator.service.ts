import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";

const baseUrl = environment.baseUrl + "/usuarios";
const baseUrlAccion = environment.baseUrl + "/administrador-acciones";
const formData = {
	estado: null,
};

@Injectable({
	providedIn: "root",
})
export class CompanyAdministratorService {
	constructor(private http: HttpClient) {}

	getCompanysByEstado(formData) {
		return this.http.put(`${baseUrl}/empresa/1`, formData);
	}

	getCompanysEnEsperaXDias(dias: number) {
		return this.http.get(`${baseUrl}/empresas-espera-sin-modificar/${dias}`);
	}

	aceptarEmpresa(id: number) {
		return this.http.put(`${baseUrl}/aceptar/${id}`, formData);
	}

	enEsperaEmpresa(id: number, dias: number) {
		const formData = {
			dias: dias,
		};
		return this.http.put(`${baseUrl}/en-espera/${id}`, formData);
	}

	rechazarEmpresa(idEmpresa: number, idAdmin: number) {
		return this.http.put(
			`${baseUrl}/rechazar/${idEmpresa}/${idAdmin}`,
			formData
		);
	}

	buscarEmpresas(palabra: string) {
		const body = {
			palabra: palabra,
		};
		return this.http.put(`${baseUrl}/buscar-por-nombre/Empresa`, body);
	}

	addAccionEmpresa(formData) {
		return this.http.post(`${baseUrlAccion}/`, formData);
	}
}
