import { Component, OnInit } from '@angular/core';
import { VacantesI } from '../../models/vacante';
import { MyVacanciesService } from './my-vacancies.service';
import { AuthResponseI } from '../../models/auth-response';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-vacancies',
  templateUrl: './my-vacancies.component.html',
  styleUrls: ['./my-vacancies.component.css']
})
export class MyVacanciesComponent implements OnInit {

  vacantesP: VacantesI[];
  vacantesB: VacantesI[];
  vacantesC: VacantesI[];
  vacantesD: VacantesI[];
  numVacantesP: number;
  numVacantesB: number;
  numVacantesC: number;
  numVacantesD: number;
  
  constructor(
    private myVacanciesService: MyVacanciesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadVacantes();
  }

  loadVacantes () {
    this.myVacanciesService.getVacantes().subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.vacantesP = resp.data.VacantesPublicadas;
        this.vacantesB = resp.data.VacantesBorradores;
        this.vacantesC = resp.data.VacantesCerradas;
        this.vacantesD = resp.data.VacantesDisponibles;
        this.numVacantesP = this.vacantesP.length;
        this.numVacantesB = this.vacantesB.length;
        this.numVacantesC = this.vacantesC.length;
        this.numVacantesD = this.vacantesD.length;
      }
    })
  }

  updateVacante(id) {
    this.router.navigate(['/update-vacancie', id]);
  }

  publicar(idVacante) {
    this.myVacanciesService.publicarVacante(idVacante).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.doneMassage("Vacante públicada");
        this.loadVacantes();
      }
    })
  }

  noPublicar(idVacante) {
    this.myVacanciesService.noPublicarVacante(idVacante).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.doneMassage("Vacante no públicada");
        this.loadVacantes();
      }
    })
  }

  cerrar(idVacante) {
    this.myVacanciesService.cerrarVacante(idVacante).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.doneMassage("Vacante cerrada");
        this.loadVacantes();
      }
    })
  }

  abrir(idVacante) {
    this.myVacanciesService.abrirVacante(idVacante).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.doneMassage("Vacante abierta");
        this.loadVacantes();
      }
    })
  }

  borrar(idVacante) {
    this.myVacanciesService.borrarVacante(idVacante).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.doneMassage("Vacante eliminada");
        this.loadVacantes();
      }
    })
  }

  verPostulaciones(idVacante) {
    this.router.navigate(['/postulations', idVacante, 1]);
  }
  
  statusVacante(status) {
    if (status == 1) return true;
    return false;
  }

  confirmarEliminacionVacante(idVacante) {
    Swal.fire({
      icon: 'warning',
      title: "¿Está seguro que desea eliminar esta vacante?",
      showCancelButton: true,
      confirmButtonText: 'Sí, estoy seguro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.borrar(idVacante);
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

}
