import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";

const baseUrl = environment.baseUrl;

@Injectable({
	providedIn: "root",
})
export class PostulateVacancyService {
	constructor(private http: HttpClient) {}

	getUsuario() {
		const id = localStorage.getItem("id_usuario");
		return this.http.get(`${baseUrl}/usuarios/${id}`);
	}

	getVacante(idVacante) {
		const id = localStorage.getItem("id_usuario");
		return this.http.get(`${baseUrl}/vacantes/vacante/${idVacante}/${id}`);
	}

	addPostulante(idVacante) {
		const idUsuario = localStorage.getItem("id_usuario");
		const formData = {
			id_usuario_fk: idUsuario,
			id_vacante_fk: idVacante,
		};
		return this.http.post(`${baseUrl}/postulaciones`, formData);
	}

	cancelarPostulacion(idPostulacion) {
		return this.http.get(`${baseUrl}/postulaciones/cancelar/${idPostulacion}`);
	}

	getPostulacion(idVacante) {
		const idUsuario = localStorage.getItem("id_usuario");
		return this.http.get(
			`${baseUrl}/postulaciones/validar/${idUsuario}/${idVacante}`
		);
	}

	markFavorite(idVacante) {
		const id = localStorage.getItem("id_usuario");
		const formData = {
			id_usuario_fk: id,
			id_vacante_fk: idVacante,
		};
		return this.http.post(`${baseUrl}/vacantes-favoritas`, formData);
	}

	unmarkFavorite(idVacanteFav) {
		return this.http.delete(`${baseUrl}/vacantes-favoritas/${idVacanteFav}`);
	}

	addNotificacion(url, titulo, mensaje, idPostulacion, idReceptor) {
		const data = {
			url: url,
			titulo: titulo,
			mensaje: mensaje,
			id_vacante_fk: null,
			id_postulacion_fk: idPostulacion,
			id_receptor: idReceptor,
			id_empresa: null,
		};
		return this.http.post(`${baseUrl}/notificaciones`, data);
	}
}
