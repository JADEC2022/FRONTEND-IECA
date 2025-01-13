import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { UsuarioI } from '../models/usuario';

const baseUrl = environment.baseUrl + '/usuarios';

@Injectable({
  providedIn: 'root'
})
export class ComponentsService {

  constructor(private http: HttpClient) { }

  getUsuario(id_usuario = null) {
    let id = localStorage.getItem('id_usuario');
    if(!id){
      id = id_usuario;
    }
    return this.http.get(`${baseUrl}/${id}`);
  }

  forgotPass(id, formData: UsuarioI) {
    return this.http.put(`${baseUrl}/renewpass/${id}`, formData);
  }

  validarEmail(id) {
    return this.http.get(`${baseUrl}/validemail/${id}`);
  }

  sendEmail(formData) {
    console.log(formData);
    return this.http.post(`${baseUrl}/send-email/`, formData)
  }
}

