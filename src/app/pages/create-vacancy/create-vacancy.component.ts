import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VacancyService } from './vacancy.service';
import { SucursalesI } from '../../models/sucursal';
import { AuthResponseI } from '../../models/auth-response';
import { PerfilI } from '../../models/perfil';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

export interface Element {
  value: string,
  viewValue: string
}

const NIVEL: Element[] = [
  {value: 'Practicante', viewValue: 'Practicante'},
  {value: 'Ejecutivo', viewValue: 'Ejecutivo'},
  {value: 'Supervisor', viewValue: 'Supervisor'},
];

const MODALIDAD: Element[] = [
  {value: 'Tiempo completo', viewValue: 'Tiempo completo'},
  {value: 'Medio tiempo', viewValue: 'Medio tiempo'},
  {value: 'Temporal', viewValue: 'Temporal'},
  {value: 'Home Office', viewValue: 'Home Office'},
];

@Component({
  selector: 'app-create-vacancy',
  templateUrl: './create-vacancy.component.html',
  styleUrls: [ './create-vacancy.component.css'
  ]
})
export class CreateVacancyComponent implements OnInit {

  sucursales: SucursalesI[];
  perfiles: PerfilI[] = [];
  idVacante = 1;

  public niveles = NIVEL;
  public modalidades = MODALIDAD;
  public negociable = false;
  public elegirSucursal = false;

  public formSubmitted = false;
  public vacanteForm = this.formBuilder.group({
    puesto: ["", [Validators.required, Validators.minLength(5)]],
    nivel: ["", Validators.required],
    sueldo: ["", [Validators.required, Validators.min(1)]],
    modalidad: ["", Validators.required],
    descripcion: ["", Validators.required],
    id_sucursal_fk: [],
    publicada: [],
    fecha_publicacion: [],
    negociable: [],
    elegirSucursal: []
  });

  selectable = true;
  removable = true;
  guardarPerfil = false;
  perfilCtrl = new FormControl();
  filteredPerfil: Observable<PerfilI[]>;
  ListaPerfiles: PerfilI[];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('perfilInput') perfilInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') MatAutocomplete: MatAutocomplete;


  constructor(
    private formBuilder: FormBuilder,
    private vacanteService: VacancyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vacanteService.getSucursales().subscribe(
      (resp: AuthResponseI) => {
        if (resp.status) {
          this.sucursales = resp.data;
        }
      }
    )

    this.vacanteService.getPerfiles().subscribe(
      (resp: AuthResponseI) => {
        if (resp.status) {
          this.ListaPerfiles = resp.data;
          this.filteredPerfil = this.perfilCtrl.valueChanges.pipe(
            startWith(null),
            map((perfil: string | PerfilI | null) => perfil ?
            this._filter(perfil) : this.ListaPerfiles.slice())
          );
        }
      }
    )
  }

  guardarVacante(tipo) {
    this.cargarData(tipo);
    this.formSubmitted = true;
    if (this.vacanteForm.valid) {
      this.vacanteService.addVacante(this.vacanteForm.value).subscribe(
        (resp: AuthResponseI) => {
          if (resp.status) {
            this.vacanteService.addPerfilesVacante(resp.data.id_vacante, this.perfiles).subscribe(
              (resp: AuthResponseI) => {
                console.log(resp);
              }
            );
            this.negociable = false;
            this.elegirSucursal = false;
            this.vacanteForm.reset();
            this.doneMassage('Experiencia Laboral guardada');
            this.router.navigateByUrl('/my-vacancies');
          }
        })
    } else {
      this.errorMassage();
    }
  }

  cargarData(tipo) {
    if (this.negociable) {
      this.vacanteForm.get("sueldo").setValue("Negociable");
    }
    if (!this.elegirSucursal) {
      this.vacanteForm.get("id_sucursal_fk").setValue(null);
    }
    if (tipo == 1) {
      this.vacanteForm.get("publicada").setValue(false);
    } else {
      this.vacanteForm.get("publicada").setValue(true);
      let date = new Date(Date.now());
      this.vacanteForm.get("fecha_publicacion").setValue(date);
    }
  }

  isNegociable() {
    if (this.vacanteForm.get("negociable").value) {
      this.negociable = false;
    } else {
      this.negociable = true;
    }

  }

  isSucursal() {
    if (this.vacanteForm.get("elegirSucursal").value) {
      this.elegirSucursal = false;
    } else {
      this.elegirSucursal = true;
    }
  }

  addPer(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    
    if ((value || '').trim()) {
      this.perfiles.push({
        descripcion: value.trim()
      });
    }

    if (input) {
      input.value = '';
    }
    
    this.perfilCtrl.setValue(null);
  }

  removePer(perfiles: PerfilI): void {
    const index = this.perfiles.indexOf(perfiles);

    if (index >= 0) {
      this.perfiles.splice(index, 1);
    }
  }

  selectedPer(event: MatAutocompleteSelectedEvent): void{
    this.perfiles.push({
      descripcion: event.option.viewValue
    });
    this.perfilInput.nativeElement.value = '';
    this.perfilCtrl.setValue(null);
  }

  _filter(perfil: string | PerfilI): PerfilI[] {
    let perfilDescripcion = '';
    if(typeof(perfil) == 'string') {
      perfilDescripcion = perfil.toLowerCase();
    } else {
      perfilDescripcion = perfil.descripcion.toLowerCase();
    }
    return this.ListaPerfiles.filter(perfil => 
      perfil.descripcion.toLowerCase().indexOf(perfilDescripcion) === 0);
  }


  capturarImage(event) {
    console.log(event);
  }

  //  ---------- VALIDADORES ---------- //
  /* Validar los control name */
  campoNoValido(campo: string): boolean {
    if (this.vacanteForm.get(campo).invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

    //  ---------- MENSAJES ---------- //
    errorServer(error: any): void { // Lo sentimos su petición no puede ser procesada, favor de ponerse en contacto con soporte técnico
    Swal.fire({
      icon: 'error',
      title: 'Petición no procesada',
      text: `Vuelve a intentar de nuevo.
      Si el error persiste, comuníquese con el soporte técnico.`,
    });
    console.log(error);
  }

  errorMassage(): void {
    Swal.fire({
      icon: 'error',
      title: 'Verifica el formulario',
      text: 'Verifica que el formulario este completo.',
      showConfirmButton: false,
      timer: 2700
    });
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

  errorPeticion(error: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error,
      showConfirmButton: false,
      timer: 2700
    });
  }

}
