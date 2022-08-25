import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";

const baseUrl = environment.baseUrl + "/usuarios";

@Injectable({
	providedIn: "root",
})
export class CompanyAdministratorService {
	constructor(private http: HttpClient) {}

	getCompanysByEstado(estado) {
		const formData = {
			estado: estado,
		};
		return this.http.post(`${baseUrl}/empresa/1`, formData);
	}
}
