import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";

const baseUrl = environment.baseUrl + "/notificaciones";

@Injectable({
	providedIn: "root",
})
export class NotificationsService {
	constructor(private http: HttpClient) {}

	getNotificaciones() {
		const id = localStorage.getItem("id_usuario");
		const tipo = localStorage.getItem("tipo_usuario");
		if (tipo === "Administrador") {
			return this.http.get(`${baseUrl}/2`); // 2 debe ser el id del SuperAdministrador
		} else {
			return this.http.get(`${baseUrl}/${id}`);
		}
	}

	verNotificacion(idPostulacion) {
		return this.http.get(`${baseUrl}/ver/${idPostulacion}`);
	}
}
