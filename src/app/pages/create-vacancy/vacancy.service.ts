import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { VacantesI } from "../../models/vacante";
import { PerfilI } from "app/models/perfil";
import { Observable } from "rxjs";
import { AuthResponseI } from "../../models/auth-response";
import { map } from "rxjs/operators";

const baseUrl = environment.baseUrl;

@Injectable({
	providedIn: "root",
})
export class VacancyService {
	constructor(private http: HttpClient) {}

	getSucursales() {
		const id_empresa = parseInt(localStorage.getItem("id_usuario"));
		return this.http.get(`${baseUrl}/sucursales/${id_empresa}`);
	}

	addVacante(formData: VacantesI) {
		const id_empresa = parseInt(localStorage.getItem("id_usuario"));
		formData.id_usuario_fk = id_empresa;
		return this.http.post(`${baseUrl}/vacantes`, formData);
	}

	getPerfiles() {
		return this.http.get(`${baseUrl}/perfiles`);
	}

	readCompany(): Observable<any> {
		const id = localStorage.getItem("id_usuario");
		return this.http.get(`${baseUrl}/usuarios/${id}`).pipe(
			map((response: AuthResponseI) => {
				return response;
			})
		);
	}

	addPerfilesVacante(id_vacante, perfiles: PerfilI[]) {
		const formData = {
			id_vacante: id_vacante,
			perfiles: perfiles,
		};
		return this.http.post(`${baseUrl}/perfiles/vacante`, formData);
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

	getVacantes() {
		const id = localStorage.getItem("id_usuario");
		return this.http.get(`${baseUrl}/vacantes/empresa/${id}`);
	}
}
