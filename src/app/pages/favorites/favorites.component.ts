import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { AuthResponseI } from '../../models/auth-response';
import { FavoritesService } from './favorites.service';
import { VacantesFavI } from '../../models/vacantes-favoritas';
import { PageEvent } from '@angular/material/paginator';
import { VacanciesService } from '../vacancies/vacancies.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['../pages.component.css']
})
export class FavoritesComponent implements OnInit {

  /* ? ----- VARIABLES ----- */
  page_size: number = 5;
  page_number: number = 1;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  vacantes: VacantesFavI[] = [];

  // slides = [{image: '1'}, {image: '2'}, {image: '3'}]

  constructor(
    private vacantesService: VacanciesService,
    private vacantesFavService: FavoritesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  /* ? ----- METODOS ----- */
  loadData(): void {
    this.vacantesFavService.getVacantesFav().subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.vacantes = resp.data.Vacantes_Favoritas;
      }
    });
  }

  visualizar(idVacante) {
    this.vacantesService.verVacante(idVacante).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.router.navigate(['/postulate-vacancy', idVacante]);
      } else {
        this.errorMassage('Error al cargar la vacante');
      }
    })
  }

  unmarkFavorite(idVacanteFav: number): void {
    this.vacantesService.unmarkFavorite(idVacanteFav).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.vacantesFavService.getVacantesFav().subscribe((resp: AuthResponseI) => {
          this.vacantes = resp.data.Vacantes_Favoritas;
        })
        this.doneMassage("Vacante eliminada de favoritas");
      }
    })
  }

  handlePage(e: PageEvent) {
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex + 1;
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

  errorMassage(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Ocurrió un error',
      text: message,
      showConfirmButton: false,
      timer: 2700
    });
  }



}
