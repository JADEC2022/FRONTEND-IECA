import { Component, Host, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import Swal from "sweetalert2";

import { Address } from "ngx-google-places-autocomplete/objects/address";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";

import { ValidatorsService } from "../../services/validators.service";
import { AuthUserService } from "../auth-user.service";
import { AuthResponseI } from "app/models/auth-response";
import { AuthComponent } from "../auth.component";

@Component({
	selector: "app-register",
	templateUrl: "./register.component.html",
	styleUrls: ["../auth.component.css"],
})
export class RegisterComponent implements OnInit {
	//  ---------- VARIABLES ---------- //
	part = true; // True - Muestra la 1ra parte del formulario. False - Muestra la 2da parte del formulario
	type = ""; // Dejarlo vacío ''
	registerUsuarioForm: FormGroup;
	registerEmpresaForm: FormGroup;
	tipo_usuario: "Postulante";

	// Expresión regular del CURP
	private expresionRegularCURP =
		"[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}" +
		"(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])" +
		"[HM]{1}" +
		"(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)" +
		"[B-DF-HJ-NP-TV-Z]{3}" +
		"[0-9A-Z]{1}[0-9]{1}$";

	@ViewChild("placesRef") placesRef: GooglePlaceDirective; // autocompletar dirección

	constructor(
		private formB: FormBuilder,
		private validators: ValidatorsService,
		private router: Router,
		private authUserService: AuthUserService,
		@Host() private authComponent: AuthComponent
	) {
		this.registerUsuarioCreateForm();
		this.registerEmpresaCreateForm();
	}

	ngOnInit(): void {}

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
			this.part = true;
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

	//  ---------- MENSAJES ---------- //
	errorServer(error: any): void {
		// Lo sentimos su petición no puede ser procesada, favor de ponerse en contacto con soporte técnico
		Swal.fire({
			icon: "error",
			title: "Petición no procesada",
			text: `Vuelve a intentar de nuevo.
      Si el error persiste, comuníquese con soporte técnico.`,
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

	emailEnviado(): void {
		Swal.fire({
			icon: "success",
			title: "Correo enviado",
			text: "Por favor revise su bandeja de entrada o spam",
			showConfirmButton: false,
			timer: 2700,
		});
	}

	//  ---------- FORMULARIOS ---------- //
	/* Formulario REGISTRO para USUARIO */
	registerUsuarioCreateForm(): void {
		this.registerUsuarioForm = this.formB.group(
			{
				nombre: ["", [Validators.required, Validators.minLength(3)]],
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
				fecha_nacimiento: ["", Validators.required],
				curp: [
					"",
					[Validators.required, Validators.pattern(this.expresionRegularCURP)],
				],
			},
			{
				validators: [this.validators.ValidarPassword("pass", "password")],
			}
		);
	}

	/* Formulario REGISTRO para EMPRESA */
	registerEmpresaCreateForm(): void {
		this.registerEmpresaForm = this.formB.group(
			{
				nombre: ["", [Validators.required, Validators.minLength(2)]],
				administrador: ["", [Validators.required, Validators.minLength(3)]],
				giro: ["", Validators.required],
				ubicacion: ["", [Validators.required, Validators.minLength(2)]],
				email: [
					"",
					[
						Validators.required,
						Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$"),
					],
				],
				pass: ["", [Validators.required, Validators.minLength(6)]],
				password: ["", [Validators.required]],
			},
			{
				validators: [this.validators.ValidarPassword("pass", "password")],
			}
		);
	}

	changeTipo(event) {
		this.tipo_usuario = event;
	}

	//  ---------- MÉTODOS ---------- //
	// Registrarse
	registro(form: FormGroup): void {
		//console.log(form);

		/* Asigna los valores del formulario y e tipo en una variable llamada data */
		const datos = form.value;
		const tipo = {
			tipo_usuario: this.tipo_usuario,
		};
		const data = {
			...datos,
			...tipo,
		};
		//console.log(data);
		/* Validar formulario */
		if (this.formularioNoValido(data)) {
			/* Mensaje de error en Sweetalert2 */
			return this.errorMassage("Revisa el Formulario", "Formulario No valido");
		}

		this.authUserService.register(data).subscribe(
			(resp: AuthResponseI) => {
				if (!resp.status) {
					return this.errorMassage(
						"Ocurrio un error",
						resp.data.errors[0].message
					);
				}
				form.reset();
				this.emailEnviado();
				this.authComponent.register = false;
				return;
			},
			(error) => {
				this.errorServer(error);
			}
		);
	}

	// Autocompletar la dirección en la ubicación
	public handleAddressChange(address: Address) {
		// Do some stuff
		// console.log(address);

		// Asignar el valor de google al formulario de registerEmpresaForm
		this.registerEmpresaForm.reset({
			nombre: this.registerEmpresaForm.value.nombre,
			administrador: this.registerEmpresaForm.value.administrador,
			giro: this.registerEmpresaForm.value.giro,
			ubicacion: `${address.formatted_address}`,
			email: this.registerEmpresaForm.value.email,
			pass: this.registerEmpresaForm.value.pass,
			password: this.registerEmpresaForm.value.password,
		});
	}
}
