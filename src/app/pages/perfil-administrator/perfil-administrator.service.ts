import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { UsuarioI } from "../../models/usuario";

const baseUrl = environment.baseUrl + "/usuarios";

@Injectable({
	providedIn: "root",
})
export class PerfilAdministratorService {
	constructor(private http: HttpClient) {}

	getUsuario() {
		const id = localStorage.getItem("id_usuario");
		return this.http.get(`${baseUrl}/${id}`);
	}

	updateUsuario(formData: UsuarioI) {
		const id = localStorage.getItem("id_usuario");
		return this.http.put(`${baseUrl}/update/${id}`, formData);
	}

	updateFoto(formData: any) {
		const id = localStorage.getItem("id_usuario");
		return this.http.put(`${baseUrl}/usuarios/updatefoto/${id}`, formData);
	}
}
