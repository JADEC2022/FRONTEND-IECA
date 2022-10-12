import { Component, Input, OnInit } from '@angular/core';
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { UsuarioI } from "../../models/usuario";
import { NewAdministratorService } from "../new-administrator/new-administrator.service";
import { ValidatorsService } from "../../services/validators.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthResponseI } from "../../models/auth-response";
import Swal from "sweetalert2";
import { Router } from '@angular/router';

interface Sexo {
	value: string;
	viewValue: string;
}
@Component({
  selector: 'app-new-administrator',
  templateUrl: './new-administrator.component.html',
  styleUrls: ['./new-administrator.component.css']
})
export class NewAdministratorComponent implements OnInit {

  @Input() usuarioInput: UsuarioI;
	public selected;
	navigationSubscription;

	usuario: UsuarioI = null;
  	tipo_usuario: string = 'Administrador';
	guardarPresionado: boolean = false;

	readonly separatorKeysCodes: number[] = [ENTER, COMMA];

	public userForm: FormGroup;

	sexo: Sexo[] = [
		{ value: "H", viewValue: "Hombre" },
		{ value: "M", viewValue: "Mujer" },
		{ value: "X", viewValue: "Prefiero no decirlo" },
	];

	constructor(
		private formBuilder: FormBuilder,
    	private validators: ValidatorsService,
		private newAdministratorService: NewAdministratorService,
		private router: Router
	) { this.crearFormulario() }

	ngOnInit(): void {}

	crearFormulario() {
		this.userForm = this.formBuilder.group({
			nombre: ["", Validators.required],
			apellido_paterno: ["", Validators.required],
			apellido_materno: ["", Validators.required],
			email: [
			  "",
			  [
				Validators.required,
				Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$"),
			  ],
			],
			pass: ["", [Validators.required, Validators.minLength(6)]],
			password: ["", [Validators.required, Validators.minLength(6)]],
			sexo: ["", Validators.required],
			fecha_nacimiento: ["", Validators.required],
			telefono: [""],
		},
	  {
		validators: [this.validators.ValidarPassword("pass", "password")],
	  });
	}

	recargarComponente() {
		let rutaActual = this.router.url
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.router.onSameUrlNavigation = 'reload';
		this.router.navigate([rutaActual]);
	}

  //  ---------- VALIDADORES ---------- //
	/* Validar los control name */
	controlNoValid(form: FormGroup, controlName: string): boolean {
		return (
			form.controls[controlName].errors && form.controls[controlName].touched
		);
	}

	/* Validar formulario */
	formularioNoValido(form: FormGroup): boolean {
		if (form.invalid) {
			form.markAllAsTouched();
			return true;
		}
		return false;
	}

	/* Validar password (Sean iguales) */
	validarPassword(form: FormGroup): boolean {
		return (
			form.hasError("noSonIguales") && this.controlNoValid(form, "password")
		);
	}

  registerAdministrator(form: FormGroup) {
    const datos = form.value;
		const tipo = {
			tipo_usuario: this.tipo_usuario,
			email_validado: 1
		};
    const data = {
			...datos,
			...tipo,
		};
    if (this.formularioNoValido(data)) {
			return this.errorMassage("Revisa el Formulario", "Formulario No valido");
		}
    this.newAdministratorService.register(data).subscribe((resp: AuthResponseI) => {
      if (!resp.status) {
        return this.errorMassage(
          "Ocurrio un error",
          resp.data.errors[0].message
        );
      }
      form.reset();
      this.doneMassage('Se registró al administrador correctamente');
	  this.recargarComponente();
    });
  }

	/*updateUser() {
		this.formSubmitted = true;
		if (this.userForm.valid) {
			this.perfilAdministratorService
				.updateUsuario(this.userForm.value)
				.subscribe(
					(resp: AuthResponseI) => {
						if (resp.status) {
							this.doneMassage("Información actualizada");
							//this.notifierService.showNotification('Información Actualizada', 'done', 'success-snack');
							this.formSubmitted = false;
						} else {
							this.errorPeticion(resp.data);
						}
					},
					(error) => this.errorServer(error)
				);
		} else {
			this.errorMassage();
		}
	}*/

	resetForm() {
		this.userForm.reset(this.usuario);
	}

	campoNoValido(campo: string): boolean {
		if (this.userForm.get(campo).invalid) {
			return true;
		} else {
			return false;
		}
	}

	//  ---------- MENSAJES ---------- //
	errorServer(error: any): void {
		// Lo sentimos su petición no puede ser procesada, favor de ponerse en contacto con soporte técnico
		Swal.fire({
			icon: "error",
			title: "Petición no procesada",
			text: `Vuelve a intentar de nuevo.
      Si el error persiste, comuníquese con el soporte técnico.`,
		});
		console.log(error);
	}

	errorMassage(title, message): void {
		Swal.fire({
			icon: "error",
			title: title,
			text: message,
		});
	}

	doneMassage(message: string): void {
		Swal.fire({
			icon: "success",
			title: "Operación exitosa",
			text: message,
			showConfirmButton: false,
			timer: 2700,
		});
	}

	errorPeticion(error: string): void {
		Swal.fire({
			icon: "error",
			title: "Error",
			text: error,
			showConfirmButton: false,
			timer: 2700,
		});
	}

}
