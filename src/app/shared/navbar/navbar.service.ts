import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { Observable, Subject } from "rxjs";

const baseUrl = environment.baseUrl;

@Injectable({
	providedIn: "root",
})
export class NavbarService {
	constructor(private http: HttpClient) {}

	private numN = new Subject<number>();
	private num = 0;
	getCantidadNotifocaciones() {
		const idUsuario = localStorage.getItem("id_usuario");
		const tipo = localStorage.getItem("tipo_usuario");
		if (tipo === "Administrador") {
			return this.http.get(`${baseUrl}/notificaciones/sin-ver/2`); // 2 debe ser el id del SuperAdministrador
		} else {
			return this.http.get(`${baseUrl}/notificaciones/sin-ver/${idUsuario}`);
		}
	}

	setNumN(numero: number) {
		this.numN.next(numero);
		this.num = numero;
	}

	getNumN(): Observable<number> {
		return this.numN.asObservable();
	}

	getNum(): number {
		return this.num;
	}
}
