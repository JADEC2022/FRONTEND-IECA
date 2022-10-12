import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { VacantesI } from "../../../../models/vacante";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthResponseI } from "../../../../models/auth-response";

const baseUrl = environment.baseUrl;

@Injectable({
	providedIn: "root",
})
export class VacanteService {
	constructor(private http: HttpClient) {}

	getSucursales() {
		const id_empresa = localStorage.getItem("id_usuario");
		return this.http.get(`${baseUrl}/sucursales/${id_empresa}`);
	}

	updateVacante(idVacante, formData: VacantesI) {
		return this.http.put(`${baseUrl}/vacantes/${idVacante}`, formData);
	}

	deleteVacante(idVacante) {
		return this.http.delete(`${baseUrl}/vacantes/${idVacante}`);
	}

	readCompany(): Observable<any> {
		const id = localStorage.getItem("id_usuario");
		return this.http.get(`${baseUrl}/usuarios/${id}`).pipe(
			map((response: AuthResponseI) => {
				return response;
			})
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
