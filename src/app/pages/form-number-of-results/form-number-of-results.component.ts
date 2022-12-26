import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardAdministratorService } from '../dashboard-administrator/dashboard-administrator.service';
import { AdministradorAccionI } from '../../models/administrador-acciones';

@Component({
  selector: 'app-form-number-of-results',
  templateUrl: './form-number-of-results.component.html',
  styleUrls: ['./form-number-of-results.component.css'],
})
export class FormNumberOfResultsComponent {
  administradoraccion: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FormNumberOfResultsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FormGroup,
    public dashboardsdministratorservice: DashboardAdministratorService,
  ) {}

  ngOnInit(): void {
    this.administradoraccion = new FormGroup({
      cantidadResultados: new FormControl(this.data.value.cantidadResultados, {
        validators: [Validators.required, Validators.minLength(1)]
      }),
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
