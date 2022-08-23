import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { ExperienciaLaboralI } from '../../../../models/experiencia-laboral';

const baseUrl = environment.baseUrl + '/experiencias-laborales';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaLaboralService {

  constructor(private http: HttpClient) { }

  addExpLaboral (formData: ExperienciaLaboralI) {
    const id = parseInt(localStorage.getItem('id_usuario'));
    formData.id_usuario_fk = id;
    return this.http.post(`${baseUrl}`, formData);
  }

  updateExpLaboral(id, formData: ExperienciaLaboralI) {
    return this.http.put(`${baseUrl}/${id}`, formData);
  }


  deleteExpLaboral(id) {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
