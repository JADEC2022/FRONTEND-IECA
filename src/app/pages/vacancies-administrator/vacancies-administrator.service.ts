import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const baseUrl = environment.baseUrl + '/vacantes'
const formData = {
  estado: null
}

@Injectable({
  providedIn: 'root'
})
export class VacanciesAdministratorService {

  constructor(private http: HttpClient) { }

  getVacantesByEstado (formDataX) {
    return this.http.put(`${baseUrl}/estado`, formDataX);
  }

  aceptarVacante (id: number) {
    return this.http.put(`${baseUrl}/aceptar/${id}`, formData);
  }

  enEsperaVacante (id: number) {
    return this.http.put(`${baseUrl}/en-espera/${id}`, formData);
  }

  rechazarVacante (idVacante: number, idAdmin: number) {
    return this.http.put(`${baseUrl}/rechazar/${idVacante}/${idAdmin}`, formData);
  }
}
