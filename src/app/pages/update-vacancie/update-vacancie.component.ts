import { Component, Input, OnInit } from '@angular/core';
import { VacantesI } from '../../models/vacante';
import { UpdateVacancieService } from './update-vacancie.service';
import { PerfilI } from '../../models/perfil';
import { AuthResponseI } from '../../models/auth-response';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-vacancie',
  templateUrl: './update-vacancie.component.html',
  styleUrls: ['./update-vacancie.component.css']
})
export class UpdateVacancieComponent implements OnInit {

  vacante: VacantesI;
  vistas: number = 0;
  alcance: number = 0;
  numPostulaciones: number = 0;
  idVacante: number;
  perfiles: PerfilI[];
  
  constructor(
    private updateVacanteService: UpdateVacancieService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.idVacante = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
    
    this.updateVacanteService.getPerfilesVacante(this.idVacante).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.perfiles = resp.data;
      }
    })

    this.updateVacanteService.getVacante(this.idVacante).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.vacante = resp.data;
        this.vistas = resp.data.vistas;
      }
    })

    this.updateVacanteService.getAlcance(this.idVacante).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.alcance = resp.data;
      }
    })

    this.updateVacanteService.getNumPostulaciones(this.idVacante).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.numPostulaciones = resp.data;
      }
    })

  }

  doneMassage(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Cambios Actualizados',
      text: message,
      showConfirmButton: false,
      timer: 2700
    });
  }

  verPostulaciones() {
    this.router.navigate(['/postulations', this.idVacante, 2]);
  }
}
