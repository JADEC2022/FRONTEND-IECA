import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { UsuarioI } from '../../models/usuario';

const baseUrl = environment.baseUrl + '/usuarios';

@Injectable({
  providedIn: 'root'
})
export class NewAdministratorService {

  constructor(private http: HttpClient) { }

  register(formData: UsuarioI) {
    return this.http.post(`${baseUrl}`, formData);
  }
}
