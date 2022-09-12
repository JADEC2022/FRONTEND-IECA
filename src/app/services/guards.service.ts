import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const baseUrl = environment.baseUrl + '/validar';
const baseUrl2 = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class GuardsService {

  constructor(private http: HttpClient) {}

  validarToken() {
    const id = localStorage.getItem('id_usuario');
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${baseUrl}/token/${id}`, {
      headers: {
        'x-token': token
      }
    }).pipe(map((resp: any) => {
      return resp.status;
    }));
  }

  validarEmail() {
    const id = localStorage.getItem('id_usuario');
    return this.http.get(`${baseUrl}/email/${id}`)
    .pipe(map((resp: any ) => {
      return resp.status;
    }));
  }
  
  validarPerfil() {
    const id = localStorage.getItem('id_usuario');
    return this.http.get(`${baseUrl}/perfil/${id}`)
    .pipe(map((resp: any ) => {
      return resp;
    })) 
  }

  validarEmpresaAceptada() {
    const id = localStorage.getItem('id_usuario');
    return this.http.get(`${baseUrl2}/usuarios/${id}`)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }
}
