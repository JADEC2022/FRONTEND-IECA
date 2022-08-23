import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { CursoCertificacionI } from 'app/models/cursos-certificaciones';

const baseUrl = environment.baseUrl + '/cursos-certificaciones';

@Injectable({
  providedIn: 'root'
})
export class CursoCertificacionService {

  constructor(private http: HttpClient) { }

  addCursoCertifi (formData: CursoCertificacionI) {
    const id = parseInt(localStorage.getItem('id_usuario'));
    formData.id_usuario_fk = id;
    return this.http.post(`${baseUrl}`, formData);
  }

  updateCursoCertifi (id, formData: CursoCertificacionService) {
    return this.http.put(`${baseUrl}/${id}`, formData);
  }

  deleteCursoCertifi (id) {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
