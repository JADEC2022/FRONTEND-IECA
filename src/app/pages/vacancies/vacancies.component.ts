import { Component, OnInit } from '@angular/core';
import { VacanciesService } from './vacancies.service';
import { AuthResponseI } from '../../models/auth-response';
import { VacantesI } from '../../models/vacante';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { VacantesFavI } from 'app/models/vacantes-favoritas';
import { PageEvent } from '@angular/material/paginator';
import { PerfilI } from '../../models/perfil';
import { FormBuilder, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { SearchPipe } from '../pipes/search.pipe';


@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['../pages.component.css']
})
export class VacanciesComponent implements OnInit {
  
  page_size: number = 5;
  page_number: number = 1;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  recientes = true;
  recientesAux = true
  filterActive = false;
  searchValue = '';
  spinerActived = true;

  vacantes: VacantesI[] = [];
  perfiles: PerfilI[] = [];
  perfilesAux: PerfilI[] = [];
  

  filtered = {
    fecha: "DESC",
    filter_perfiles: false,
    perfiles: []
  }

  public filterForm = this.formBuilder.group(
    {
      recientes: [{value: this.recientes, disabled: this.recientes}],
      antiguas: [{value: !this.recientes, disabled: !this.recientes}],
      fecha: [''],
      filter_perfiles: [false],
      perfiles: [[]]
    }
  );

  search = new FormControl('');

  // slides = [{image: '1'}, {image: '2'}, {image: '3'}]

  constructor(
    private formBuilder: FormBuilder,
    private vacantesService: VacanciesService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.vacantesService.getVacantes(this.filtered).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.spinerActived = false;
        this.vacantes = resp.data;
      } 
    });

    this.vacantesService.getPerfilesUsuario().subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.perfiles = resp.data;
      }
    });

    this.search.valueChanges
    .pipe(
      debounceTime(300)
    )  
    .subscribe((value) => {
        this.searchValue = value;
    });
  }

  filtrarVcantes() {
    if(this.recientes) {
      this.filterForm.get('fecha').setValue('DESC');
    } else {
      this.filterForm.get('fecha').setValue('ASC');
    }

    if(this.filterForm.get('perfiles').value.length > 0) {
      this.filterForm.get('filter_perfiles').setValue(true);
    } else {
      this.filterForm.get('filter_perfiles').setValue(false);
    }

    this.vacantesService.getVacantes(this.filterForm.value).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.filterActive = false;
        this.vacantes = resp.data;
        this.recientesAux = this.recientes;
        this.perfilesAux = this.filterForm.get('perfiles').value;
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

  changeRecientes() {
    this.filterForm.get('recientes').setValue(true);
    this.filterForm.get('recientes').disable();
    this.filterForm.get('antiguas').setValue(false);
    this.filterForm.get('antiguas').enable();
    this.recientes = true;
    this.filterActive = this.compararFilter();
  }

  changeAntiguos() {
    this.filterForm.get('recientes').setValue(false);
    this.filterForm.get('recientes').enable();
    this.filterForm.get('antiguas').setValue(true);
    this.filterForm.get('antiguas').disable();
    this.recientes = false;
    this.filterActive = this.compararFilter();
  }

  changeSelection() {
    this.filterActive = this.compararFilter();
  }

  compararFilter() {
    if (this.recientesAux != this.recientes) return true;
    if (!this.compararArregos(this.perfilesAux, this.filterForm.get('perfiles').value)) return true;
    return false;
  }

  compararArregos(arreglo: any[], arreglo2: any[]) {
    if (arreglo.length != arreglo2.length) return false;
    for (let i = 0; i < arreglo.length; i++) {
      if (arreglo[i].descripcion != arreglo2[i].descripcion) {
        return false;
      }
    }
    return true;
  }

  markFavorite(vacante: VacantesI): void {
    this.vacantesService.markFavorite(vacante.id_vacante).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        vacante.Vacantes_Favoritas.push(resp.data);
        this.doneMassage("Vacante agregada a favoritas");
      }
    })
  }

  unmarkFavorite(vacantesFav: VacantesFavI[]): void {
    this.vacantesService.unmarkFavorite(vacantesFav[0].id_vacante_favorita).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        vacantesFav.pop();
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
      title: 'Cambios actualizados',
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

  filterVacantes() {
    const newSearchValue = this.searchValue.toUpperCase();
    const vacantesFilter =  this.vacantes.filter(
      (vacante) =>
        vacante.puesto.toUpperCase().includes(newSearchValue) ||
        vacante.modalidad.toUpperCase().includes(newSearchValue) ||
        vacante.nivel.toUpperCase().includes(newSearchValue) ||
        vacante.Usuario.nombre.toUpperCase().includes(newSearchValue) 
    );  
    if (vacantesFilter.length > 0 ) return true;
    return false;
  }
}
