import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ExperienciaAcademicaI } from 'app/models/experiencia-academica';

const baseUrl = environment.baseUrl + '/experiencias-academicas';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaAcademicaService {

  constructor(private http: HttpClient) { }

  addExpAcademica (formData: ExperienciaAcademicaI) {
    const id  = parseInt(localStorage.getItem('id_usuario'));
    formData.id_usuario_fk = id;
    return this.http.post(`${baseUrl}`, formData);
  }

  updateExpAcademica (id, formData: ExperienciaAcademicaService) {
    return this.http.put(`${baseUrl}/${id}`, formData);
  }

  deleteExpAcademica (id) {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
