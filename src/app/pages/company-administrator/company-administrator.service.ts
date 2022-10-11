import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";

const baseUrlUsuario = environment.baseUrl + "/usuarios";
const baseUrlAccion = environment.baseUrl + "/administrador-acciones";
const baseUrlNotificacion = environment.baseUrl + "/notificaciones";
const formData = {
	estado: null,
};

@Injectable({
	providedIn: "root",
})
export class CompanyAdministratorService {
	constructor(private http: HttpClient) {}

	getCompanysByEstado(formData) {
		return this.http.put(`${baseUrlUsuario}/empresa/1`, formData);
	}

	getCompanysEnEsperaXDias(dias: number) {
		return this.http.get(
			`${baseUrlUsuario}/empresas-espera-sin-modificar/${dias}`
		);
	}

	aceptarEmpresa(id: number) {
		return this.http.put(`${baseUrlUsuario}/aceptar/${id}`, formData);
	}

	enEsperaEmpresa(id: number, dias: number) {
		const formData = {
			dias: dias,
		};
		return this.http.put(`${baseUrlUsuario}/en-espera/${id}`, formData);
	}

	rechazarEmpresa(idEmpresa: number, idAdmin: number) {
		return this.http.put(
			`${baseUrlUsuario}/rechazar/${idEmpresa}/${idAdmin}`,
			formData
		);
	}

	buscarEmpresas(palabra: string) {
		const body = {
			palabra: palabra,
		};
		return this.http.put(`${baseUrlUsuario}/buscar-por-nombre/Empresa`, body);
	}

	addAccionEmpresa(formData) {
		return this.http.post(`${baseUrlAccion}/`, formData);
	}

	addNotificacion(url, titulo, mensaje, idEmpresa, idReceptor) {
		const data = {
			url: url,
			titulo: titulo,
			mensaje: mensaje,
			id_vacante_fk: null,
			id_postulacion_fk: null,
			id_receptor: idReceptor,
			id_empresa: idEmpresa,
		};
		return this.http.post(baseUrlNotificacion, data);
	}
}
