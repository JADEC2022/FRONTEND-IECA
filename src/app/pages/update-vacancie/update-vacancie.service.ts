import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";

const baseUrl = environment.baseUrl;

@Injectable({
	providedIn: "root",
})
export class UpdateVacancieService {
	constructor(private http: HttpClient) {}

	getPerfilesVacante(idVacante) {
		return this.http.get(`${baseUrl}/perfiles/vacante/${idVacante}`);
	}

	getVacante(idVacante) {
		const idUsuario = localStorage.getItem("id_usuario");
		return this.http.get(
			`${baseUrl}/vacantes/vacante/${idVacante}/${idUsuario}`
		);
	}

	getAlcance(idVacante) {
		return this.http.get(`${baseUrl}/vistas-vacantes/${idVacante}`);
	}

	getNumPostulaciones(idVacante) {
		return this.http.get(
			`${baseUrl}/vacantes/numero-postulaciones/${idVacante}`
		);
	}
}
