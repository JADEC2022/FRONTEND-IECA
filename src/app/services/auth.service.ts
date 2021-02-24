import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, pipe } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { UsuarioI } from '../models/usuario';
import { EmpresaI } from '../models/empresa';
import { AuthResponseI } from '../models/auth-response';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //  ---------- VARIABLES ---------- //
  private baseUrl: string = environment.baseUrl;
  private _usuario!: UsuarioI;
  private _empresa!: EmpresaI;
  userToken: string;

  get usuario(): UsuarioI {
    return { ...this._usuario };
  }

  get empresa(): EmpresaI {
    return { ...this._empresa };
  }

  constructor(private http: HttpClient) {
    this.userToken = '';
  }

  logout(): void {
    localStorage.clear();
  }

  loginUsuario(form: UsuarioI): Observable<AuthResponseI>  {
    const url  = `${ this.baseUrl }/auth-postulantes/login`;
    return this.http.post<AuthResponseI>(url, form)
    pipe(
      map(
        (usuario: any) => {
          if(!usuario.status){
            return;
          }
          this._usuario = usuario.data;
        }
      )
    )
    ;
  }

  registroUsuario(form: UsuarioI): Observable<AuthResponseI> {
    const url  = `${ this.baseUrl }/auth-postulantes/register`;
    return this.http.post<AuthResponseI>(url, form);
  }

  loginEmpresa(form: EmpresaI): Observable<AuthResponseI> {
    const url  = `${ this.baseUrl }/auth-empresas/login`;
    return this.http.post<AuthResponseI>(url, form);
  }

  registroEmpresa(form: EmpresaI): Observable<AuthResponseI> {
    const url  = `${ this.baseUrl }/auth-empresas/register`;
    return this.http.post<AuthResponseI>(url, form);
  }

  validarToken(): Observable<boolean> {
    const url = `${ this.baseUrl }/auth-postulante/renew-token`;
    const headers = new HttpHeaders()
      .set('x-token', [localStorage.getItem('token'),this._usuario.email] || '' );

    return this.http.get<AuthResponseI>( url, { headers } )
      .pipe(
        map( (resp) => {
          localStorage.setItem('token', resp.token!);

          return resp.status;
        }),
        catchError( err => of(false) )
      );
  }

}
