import { Component, Input, OnInit, Output, ViewChild, EventEmitter, Host } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

import { SucursalesService } from './sucursales.service';

import { AuthResponseI } from '../../../../models/auth-response';
import { SucursalesI } from '../../../../models/sucursal';
import { CompanyProfileComponent } from '../../../company-profile/company-profile.component';


@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.css']
})
export class SucursalesComponent implements OnInit {

  @Input() branch: SucursalesI;
  @Input() update = false;
  @Input() id_sucursal: number;


  public sucursalForm = this.formBuilder.group(
    {
      nombre: ['', Validators.required],
      ubicacion: ['', Validators.required],
    }
  );

  @ViewChild('placesRef') placesRef: GooglePlaceDirective; // autocompletar dirección

  constructor(@Host() private _companyComponent: CompanyProfileComponent,
              private formBuilder: FormBuilder,
              private branchesSvc: SucursalesService) {  }

  ngOnInit(): void {
    if (this.update) { this.loadData(); }
  }


  //  ---------- VALIDADOR ---------- //
  campoNoValido(campo: string): boolean {
      return this.sucursalForm.controls[campo].errors
          && this.sucursalForm.controls[campo].touched;
  };


  //  ---------- LOADERS ---------- //
  loadData(): void {
    this.sucursalForm.reset({
      nombre: this.branch.nombre,
      ubicacion: this.branch.ubicacion,
    });
  }

  loadBranches(): void {
      this.branchesSvc.readBranches()
          .subscribe(() => this._companyComponent.loadBranches())
  }


  //  ---------- MÉTODOS ---------- //
  getBranch(id_sucursal: number): void {
    this.branchesSvc.getBranches(id_sucursal).subscribe(
        (result: AuthResponseI) => {
          this.sucursalForm.reset({
            nombre: result.data.nombre,
            ubicacion: result.data.ubicacion,
          });
        }
    );
  }

  createBranch(): void {

    if (this.sucursalForm.invalid) {
      return this.sucursalForm.markAllAsTouched();
    }

    this.branchesSvc.createBranches(this.sucursalForm.value).subscribe(
        result => {
          this.sucursalForm.reset();
          return this._companyComponent.loadBranches();
        },
        error => {
          /* ! Mensaje de error si el servidor no recibe las peticiones */
          console.log(error);
          // this.errorServer();
        }
    );
  }

  updateBranch(id_sucursal: number): void {

    if (this.sucursalForm.invalid) {
      return this.sucursalForm.markAllAsTouched();
    }

    this.branchesSvc.updateBranches(id_sucursal, this.sucursalForm.value).subscribe(
        () => this._companyComponent.loadBranches(),
        error => {
          /* ! Mensaje de error si el servidor no recibe las peticiones */
          console.log(error);
          // this.errorServer();
        }
    );
  }

  deleteBranch(id?: number): void {

    if (!this.update) {
      this._companyComponent.panel = false;
      return this.sucursalForm.reset();
    }


    this.branchesSvc.deleteBranch(id).subscribe(
        () => this._companyComponent.loadBranches(),
        error => {
          /* ! Mensaje de error si el servidor no recibe las peticiones */
          console.log(error);
          // this.errorServer();
        }
    );
  }

  // Autocompletar la dirección en la ubicación
  public handleAddressChange(address: Address) {
    // Do some stuff
    // console.log(address);

    // Asignar el valor de google al formulario de registerEmpresaForm
    this.sucursalForm.reset({
      nombre: this.sucursalForm.value.nombre,
      ubicacion: address.formatted_address,
    });
  }


}
