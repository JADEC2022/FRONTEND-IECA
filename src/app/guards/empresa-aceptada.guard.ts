import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from "rxjs/operators";
import Swal from "sweetalert2";
import { GuardsService } from '../services/guards.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaAceptadaGuard implements CanActivate {
  
  empresaNoAceptada(estado: string): void {
    
    let divTexto: string = 'Puede crear vacantes solo si su empresa fue ACEPTADA por los administradores. ';
    let icon: string = 'info';
    let title: string = '¡No tiene permiso para realizar esta acción!';

    if (estado === 'EN ESPERA') { 
      divTexto += `Actualmente su empresa está ${estado}. Para poder crear vacantes, modifique los datos y siga las instrucciones que se le indicaron por correo.`;
    } else if (estado === 'RECHAZADA') {
      divTexto += `Actualmente su empresa está ${estado}, debido a que no modificó los datos que se le indicaron por correo.`;
    } else if (!estado) {
      divTexto += 'Actualmente su empresa está EN REVISIÓN. Espere a que los administradores validen su información y se le avise por correo.';
    }

    let html: string = `
    <style type="text/css">
      div{
        text-align: justify;
      }
    </style>
    <div>${divTexto}</div>`;

    this.mensajeInfo(html, icon, title);
  }

  mensajeInfo(html, icon, title): void {
    Swal.fire({
      icon,
      title,
      html,
      showConfirmButton: true
    });
  }

  constructor(
    private router: Router,
    private guardService: GuardsService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, 
              state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.guardService.validarEmpresaAceptada().pipe(
      map((resp) => {
        if (!resp) {

        } else if (resp.status && resp.data.estado !== 'ACEPTADA') {
          this.empresaNoAceptada(resp.data.estado);
          return false;
        }
        return true;
      })
    );
  }
  
}
