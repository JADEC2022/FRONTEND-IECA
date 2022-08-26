import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";

const baseUrl = environment.baseUrl + "/usuarios";
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

	aceptarEmpresa(id: number) {
		return this.http.put(`${baseUrl}/aceptar/${id}`, formData);
	}

	enEsperaEmpresa(id: number) {
		return this.http.put(`${baseUrl}/en-espera/${id}`, formData);
	}

	rechazarEmpresa(idEmpresa: number, idAdmin: number) {
		return this.http.put(
			`${baseUrl}/rechazar/${idEmpresa}/${idAdmin}`,
			formData
		);
	}
}
