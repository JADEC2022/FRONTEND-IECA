import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SucursalesI } from '../../../../models/sucursal';
import { environment } from '../../../../../environments/environment';



const baseUrl = environment.baseUrl + '/sucursales';

@Injectable({
  providedIn: 'root'
})
export class SucursalesService {

  constructor(private http: HttpClient) { }

//  ---------- SUCURSALES CRUD ---------- //
  createBranches(form: SucursalesI): Observable<any> {

    // Agregamos 'id_usuario_fk' al cuerpo de la petición
    const body = {
      id_usuario_fk: localStorage.getItem('id_usuario'),
      ...form
    };

    return this.http.post(`${baseUrl}`, body);
  }

  readBranches(): Observable<any> {
    const id = localStorage.getItem('id_usuario');
    return this.http.get(`${baseUrl}/${id}`);
  }

  updateBranches(id_sucursal: number, form: SucursalesI): Observable<any> {
    return this.http.put(`${baseUrl}/${id_sucursal}`, form);
  }

  deleteBranch(id: number) {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  getBranches(id_sucursal: number): Observable<any> {
    return;
  }

}
