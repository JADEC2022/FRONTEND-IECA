import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import { VacantesI } from "../../models/vacante";
import { AuthResponseI } from "../../models/auth-response";
import { UsuarioI } from "../../models/usuario";

import { environment } from "../../../environments/environment";

const baseUsuario = environment.baseUrl + "/usuarios";
const baseNotificacion = environment.baseUrl + "/notificaciones";
@Injectable({
	providedIn: "root",
})
export class EmpresaService {
	//  ---------- VARIABLES ---------- //
	private _company: UsuarioI;
	/*headers: HttpHeaders = new HttpHeaders({
    'x-token': localStorage.getItem('token'),
  });*/

	constructor(private http: HttpClient) {
		this.readCompany();
	}

	get getCompany(): UsuarioI {
		return { ...this._company };
	}

	get headers(): HttpHeaders {
		return new HttpHeaders({
			"x-token": localStorage.getItem("token"),
			email: this.getCompany.email,
		});
	}

	//  ---------- VACANTE CRUD ---------- //
	createVacante(form: VacantesI): Observable<AuthResponseI> {
		return;
	}

	readVacante(id?: number): Observable<AuthResponseI> {
		return;
	}

	updateVacante(form: VacantesI): Observable<AuthResponseI> {
		return;
	}

	deleteVacante(form: number): Observable<AuthResponseI> {
		return;
	}

	//  ---------- COMPANY CRUD ---------- //
	createCompany(form: any): Observable<AuthResponseI> {
		return;
	}

	readCompany(): Observable<any> {
		const id = localStorage.getItem("id_usuario");
		return this.http.get(`${baseUsuario}/${id}`).pipe(
			map((response: AuthResponseI) => {
				this._company = response.data;
				return response;
			})
		);
	}

	updateCompany(form: any): Observable<any> {
		const id = localStorage.getItem("id_usuario");
		return this.http.put(`${baseUsuario}/update/${id}`, form, {
			headers: this.headers,
		});
	}

	deleteCompany(form: number): Observable<AuthResponseI> {
		return;
	}

	updateFoto(formData: any) {
		const id = localStorage.getItem("id_usuario");
		return this.http.put(`${baseUsuario}/updatefoto/${id}`, formData);
	}

	addNotificacion(url, titulo, mensaje, idReceptor, idEmpresa) {
		const data = {
			url: url,
			titulo: titulo,
			mensaje: mensaje,
			id_vacante_fk: null,
			id_postulacion_fk: null,
			id_receptor: idReceptor,
			id_empresa: idEmpresa,
		};
		return this.http.post(baseNotificacion, data);
	}

	getNotificacionesAdmin() {
		return this.http.get(`${baseNotificacion}/135`); // 135 debe de cambiarse por el id del SuperAdministrador
	}
}
