import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { VacantesI } from '../../models/vacante';
import { AuthResponseI } from '../../models/auth-response';
import { UsuarioI } from '../../models/usuario';

import { environment } from '../../../environments/environment';
import { SucursalesI } from '../../models/sucursal';



const baseUrl = environment.baseUrl + '/usuarios';

@Injectable({
  providedIn: 'root'
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
      'x-token': localStorage.getItem('token'),
      'email': this.getCompany.email
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
    const id = localStorage.getItem('id_usuario');
    return this.http.get(`${baseUrl}/${id}`)
        .pipe( map(
            (response: AuthResponseI) => {
              this._company = response.data;
              return response;
            }));
  }

  updateCompany(form: any): Observable<any> {
    const id = localStorage.getItem('id_usuario');
    return this.http.put(`${baseUrl}/update/${id}`, form, { headers: this.headers });
  }

  deleteCompany(form: number): Observable<AuthResponseI> {
    return;
  }

  updateFoto(formData: any) {
    const id = localStorage.getItem('id_usuario');
    return this.http.put(`${baseUrl}/updatefoto/${id}`, formData);
  }

}
