import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";

const baseUrl = environment.baseUrl;

@Injectable({
	providedIn: "root",
})
export class PostulationsService {
	constructor(private http: HttpClient) {}

	getPostulantesVacante(idVacante) {
		return this.http.get(`${baseUrl}/vacantes/postulantes/${idVacante}`);
	}

	aceptarPostulacion(idPostulacion) {
		return this.http.get(`${baseUrl}/postulaciones/aceptar/${idPostulacion}`);
	}

	rechazarPostulacion(idPostulacion, comentario) {
		const data = {
			comentario: comentario,
		};
		return this.http.put(
			`${baseUrl}/postulaciones/rechazar/${idPostulacion}`,
			data
		);
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
		return this.http.post(`${baseUrl}/notificaciones`, data);
	}
}
