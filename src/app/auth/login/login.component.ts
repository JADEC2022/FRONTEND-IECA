import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import Swal from "sweetalert2";

import { AuthUserService } from "../auth-user.service";
import { AuthResponseI } from "../../models/auth-response";
import { UsuarioI } from "../../models/usuario";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["../auth.component.css", "./login.component.css"],
})
export class LoginComponent implements OnInit {
	//  ---------- VARIABLES ---------- //
	part = true; // True - Muestra la 1ra parte del formulario. False - Muestra la 2da parte del formulario
	type = ""; // Dejarlo vacío ''
	loginForm: FormGroup;

	constructor(
		private formB: FormBuilder,
		private router: Router,
		private authUserService: AuthUserService
	) {
		this.loginCreateForm();
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

	/* Validar Email para recuperar la contraseña */
	validateEmail(email: string): void {
		this.authUserService
			.sendEmail({
				email: email,
				ruta: "forgetPassword",
			})
			.subscribe(
				(resp: AuthResponseI) => {
					Swal.close();
					/* Si la respuesta es correcta */
					if (!resp.status) {
						/* Mensaje de error, preguntar si quiere intentarlo de nuevo */
						Swal.fire({
							title: "No encontramos tu correo electrónico.",
							text: "¿Quieres volver a intentarlo?",
							icon: "question",
							showCancelButton: true,
							cancelButtonText: "No, gracias",
							confirmButtonColor: "#3085d6",
							cancelButtonColor: "#d33",
							confirmButtonText: "Sí, por favor",
						}).then((result) => {
							if (result.isConfirmed) {
								this.recoverPassword();
							}
						});
						return;
					}
					this.emailEnviado();
					return;
				},
				(error) => {
					/* Mensaje de error si el servidor no recibe las peticiones */
					console.log(error);
					this.errorServer();
				}
			);
	}

	//  ---------- MENSAJES ---------- //
	errorServer(): void {
		// Lo sentimos su petición no puede ser procesada, favor de ponerse en contacto con soporte técnico
		Swal.fire({
			icon: "error",
			title: "Petición no procesada",
			text: `Vuelve a intentar de nuevo.
      Si el error persiste, comuníquese con soporte técnico.`,
		});
	}

	errorMassage(): void {
		Swal.fire({
			icon: "error",
			title: "Datos incorrectos",
			text: "Vuelve a intentar de nuevo.",
			showCancelButton: true,
			confirmButtonText: "¿Olvidaste tu contraseña?",
			cancelButtonText: "Intentarlo de nuevo",
			reverseButtons: true,
		}).then((result) => {
			if (result.isConfirmed) {
				this.recoverPassword();
			}
		});
	}

	errorMassageLogin(message): void {
		Swal.fire({
			icon: "error",
			title: "Datos incorrectos",
			text: message,
			showCancelButton: true,
			confirmButtonText: "¿Olvidaste tu contraseña?",
			cancelButtonText: "Intentarlo de nuevo",
			reverseButtons: true,
		}).then((result) => {
			if (result.isConfirmed) {
				this.recoverPassword();
			}
		});
	}

	emailNoValidado(): void {
		Swal.fire({
			icon: "error",
			title: "Email no validado",
			text: "Revisa tu bandeja de entrada y valida tu correo antes de iniciar sesión",
			showConfirmButton: false,
			timer: 3500,
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
	/* Formulario LOGIN */
	loginCreateForm(): void {
		this.loginForm = this.formB.group({
			email: [
				localStorage.getItem("email") || "",
				[
					Validators.required,
					Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$"),
				],
			],
			pass: [, [Validators.required, Validators.minLength(6)]],
			rememberMe: false,
		});
	}

	// <---------- MÉTODOS ----------> //
	// Ingresar
	login(loginForm: FormGroup): void {
		/* Validar formulario */
		/* if (this.formularioNoValido(loginForm)) {
      Mensaje de error en Sweetalert2
      return this.errorMassage();
    } */

		/* Asigna los valores del formualrio en una variable llamada data */
		const data = loginForm.value;

		// Manda la data al service correspondiente
		this.authUserService.login(data).subscribe(
			(resp: AuthResponseI) => {
				if (!resp.status) {
					return this.errorMassageLogin(resp.data);
				}

				const emailValidado: boolean = resp.data.email_validado;
				if (emailValidado) {
					if (loginForm.value.rememberMe) {
						localStorage.setItem("email", data.email);
						localStorage.setItem("type", data.type);
					} else {
						localStorage.removeItem("email");
						localStorage.removeItem("type");
					}

					let ruta = "";
					if (resp.data.tipo_usuario == "Postulante") {
						ruta = "/vacancies";
					}
					if (resp.data.tipo_usuario == "Empresa") {
						ruta = "/my-vacancies";
					}
					if (resp.data.tipo_usuario == "Administrador" || resp.data.tipo_usuario == "Superadministrador") {
						ruta = "/dashboard-administrator";
					}
					loginForm.reset();
					return this.router.navigateByUrl(ruta);
				} else {
					this.emailNoValidado();
				}
			},
			(error) => {
				/* Mensaje de error si el servidor no recibe la petición */
				this.errorServer();
			}
		);
	}

	// Recuperar contraseña
	recoverPassword(): void {
		Swal.fire({
			title: "¿Olvidaste tu contraseña?",
			text: "Escribe tu correo electrónico",
			input: "email",
			inputPlaceholder: "ejemplo@swal.com",
			inputAttributes: {
				autocapitalize: "off",
			},
			showCancelButton: true,
			cancelButtonText: "Cancelar",
			confirmButtonText: "Validar",
			showLoaderOnConfirm: true,
			preConfirm: (email) => {
				/* Validamos el correo ingresado */
				this.validateEmail(email);

				Swal.showLoading();
			},
		});
	}
}
