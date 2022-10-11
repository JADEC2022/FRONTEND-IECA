import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

const baseUrlVacante = environment.baseUrl + "/vacantes";
const baseUrlAccion = environment.baseUrl + "/administrador-acciones";
const baseUrlNotificacion = environment.baseUrl + "/notificaciones";
const formData = {
	estado: null,
};

@Injectable({
	providedIn: "root",
})
export class VacanciesAdministratorService {
	constructor(private http: HttpClient) {}

	getVacantesByEstado(formDataX) {
		return this.http.put(`${baseUrlVacante}/estado`, formDataX);
	}

	getVacantesEnEsperaXDias(dias: number) {
		return this.http.get(
			`${baseUrlVacante}/vacantes-espera-sin-modificar/${dias}`
		);
	}

	aceptarVacante(id: number) {
		return this.http.put(`${baseUrlVacante}/aceptar/${id}`, formData);
	}

	enEsperaVacante(id: number, dias: number) {
		const formData = {
			dias: dias,
		};
		return this.http.put(`${baseUrlVacante}/en-espera/${id}`, formData);
	}

	rechazarVacante(idVacante: number, idAdmin: number) {
		return this.http.put(
			`${baseUrlVacante}/rechazar/${idVacante}/${idAdmin}`,
			formData
		);
	}

	buscarVacantes(palabra: string) {
		const body = {
			palabra,
		};
		return this.http.put(`${baseUrlVacante}/buscar-por-puesto`, body);
	}

	addAccionVacante(formData) {
		return this.http.post(`${baseUrlAccion}/`, formData);
	}

	addNotificacion(url, titulo, mensaje, idVacante, idReceptor) {
		const data = {
			url: url,
			titulo: titulo,
			mensaje: mensaje,
			id_vacante_fk: idVacante,
			id_postulacion_fk: null,
			id_receptor: idReceptor,
			id_empresa: null,
		};
		return this.http.post(baseUrlNotificacion, data);
	}
}
