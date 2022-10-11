import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";

const baseUrl = environment.baseUrl;

@Injectable({
	providedIn: "root",
})
export class SeeProfileService {
	constructor(private http: HttpClient) {}

	getPostulante(id) {
		return this.http.get(`${baseUrl}/postulaciones/${id}`);
	}

	getExpLaboral(id) {
		return this.http.get(`${baseUrl}/experiencias-laborales/${id}`);
	}

	getExpAcademica(id) {
		return this.http.get(`${baseUrl}/experiencias-academicas/${id}`);
	}

	getHabilidad(id) {
		return this.http.get(`${baseUrl}/habilidades/${id}`);
	}

	getValor(id) {
		return this.http.get(`${baseUrl}/valores/${id}`);
	}

	getIdioma(id) {
		return this.http.get(`${baseUrl}/idiomas/${id}`);
	}

	getPerfil(id) {
		return this.http.get(`${baseUrl}/perfiles/usuario/${id}`);
	}

	getCursoCertificado(id) {
		return this.http.get(`${baseUrl}/cursos-certificaciones/${id}`);
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
