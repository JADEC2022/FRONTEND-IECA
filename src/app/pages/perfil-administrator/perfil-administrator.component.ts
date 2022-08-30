import { Component, Input, OnInit } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { UsuarioI } from "../../models/usuario";
import { PerfilAdministratorService } from "./perfil-administrator.service";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthResponseI } from "../../models/auth-response";
import Swal from "sweetalert2";

interface Sexo {
	value: string;
	viewValue: string;
}
@Component({
	selector: "app-perfil-administrator",
	templateUrl: "./perfil-administrator.component.html",
	styleUrls: ["./perfil-administrator.component.css"],
})
export class PerfilAdministratorComponent implements OnInit {
	@Input() usuarioInput: UsuarioI;
	public selected;
	public formSubmitted = false;

	public imageForm = this.formBuilder.group({
		foto_perfil: [""],
	});

	usuario: UsuarioI = null;

	changeFoto = false;
	extensionValid = false;
	tamnioValid = false;

	nombreCompleto = "";
	email = "";
	telefono = "";
	foto_perfil = "";

	readonly separatorKeysCodes: number[] = [ENTER, COMMA];

	public userForm = this.formBuilder.group({
		nombre: ["", Validators.required],
		apellido_paterno: ["", Validators.required],
		apellido_materno: ["", Validators.required],
		sexo: ["", Validators.required],
		fecha_nacimiento: ["", Validators.required],
		telefono: [""],
	});

	sexo: Sexo[] = [
		{ value: "H", viewValue: "Hombre" },
		{ value: "M", viewValue: "Mujer" },
		{ value: "X", viewValue: "Prefiero no decirlo" },
	];

	constructor(
		private formBuilder: FormBuilder,
		private perfilAdministratorService: PerfilAdministratorService
	) {}

	ngOnInit(): void {
		this.perfilAdministratorService
			.getUsuario()
			.subscribe((resp: AuthResponseI) => {
				if (resp.status) {
					this.usuario = resp.data;
					this.foto_perfil = this.usuario.foto_perfil;
					this.loadData();
					this.userForm.reset(this.usuario);
				}
			});
	}

	loadData() {
		this.nombreCompleto =
			this.usuario.nombre +
			" " +
			this.usuario.apellido_paterno +
			" " +
			this.usuario.apellido_materno;
		this.email = this.usuario.email;
		this.telefono = this.usuario.telefono;
	}

	compararArregos(arreglo: any[], arreglo2: any[]) {
		if (arreglo.length !== arreglo2.length) {
			return false;
		}
		for (let i = 0; i < arreglo.length; i++) {
			if (arreglo[i].descripcion !== arreglo2[i].descripcion) {
				return false;
			}
		}
		return true;
	}

	capturarImage(event) {
		const imageCapturada = event.target.files[0];
		if (this.validarFile(imageCapturada)) {
			this.extraerBase64(imageCapturada).then((image: any) => {
				this.foto_perfil = image.base;
				this.changeFoto = true;
			});
		}
	}

	extraerBase64 = async ($event: any) =>
		new Promise((resolve, reject) => {
			try {
				const reader = new FileReader();
				reader.readAsDataURL($event);
				reader.onload = () => {
					resolve({
						base: reader.result,
					});
				};
				reader.onerror = (error) => {
					resolve({
						base: null,
					});
				};
			} catch (error) {
				return null;
			}
		});

	guardarFoto() {
		try {
			this.imageForm.get("foto_perfil").setValue(this.foto_perfil);
			this.perfilAdministratorService
				.updateFoto(this.imageForm.value)
				.subscribe(
					(resp: AuthResponseI) => {
						if (resp.status) {
							this.doneMassage(resp.data);
							this.changeFoto = false;
						} else {
							this.errorPeticion(resp.data);
						}
					},
					(error) => {
						this.errorServer(error);
					}
				);
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	validarFile(event) {
		this.changeFoto = false;
		const extensionesPermitidas = [".png", ".jpg", ".jpeg"];
		const tamanio = 0.75;
		const rutaArchivo = event.name;
		const ultimoPunto = event.name.lastIndexOf(".");
		const extension = rutaArchivo.slice(ultimoPunto, rutaArchivo.length);
		if (extensionesPermitidas.indexOf(extension) === -1) {
			this.extensionValid = true;
			return false;
		}

		if (event.size / 100000 > tamanio) {
			this.tamnioValid = true;
			return false;
		}

		this.extensionValid = false;
		this.tamnioValid = false;
		return true;
	}

	updateUser() {
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
	}

	resetForm() {
		this.userForm.reset(this.usuario);
		this.formSubmitted = false;
	}

	campoNoValido(campo: string): boolean {
		if (this.userForm.get(campo).invalid && this.formSubmitted) {
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

	errorMassage(): void {
		Swal.fire({
			icon: "error",
			title: "Verifica el formulario",
			text: "Para actualizar, completa el formulario",
			showConfirmButton: false,
			timer: 2700,
		});
	}

	doneMassage(message: string): void {
		Swal.fire({
			icon: "success",
			title: "Cambios Actualizados",
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
