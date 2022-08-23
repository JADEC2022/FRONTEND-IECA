import { Component, OnInit } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { AuthResponseI } from "app/models/auth-response";
import { UsuarioI } from "app/models/usuario";
import { ExperienciaLaboralI } from "../../models/experiencia-laboral";
import { ExperienciaAcademicaI } from "app/models/experiencia-academica";
import { CursoCertificacionI } from "../../models/cursos-certificaciones";
import { FormBuilder } from "@angular/forms";
import Swal from "sweetalert2";
import { UserProfileService } from "./user-profile.service";
import { PerfilI } from "../../models/perfil";
import { HabilidadI } from '../../models/habilidad';
import { IdiomaI } from '../../models/idioma';
import { ValorI } from '../../models/valor';

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["../pages.component.css"],
})
export class UserProfileComponent implements OnInit {
  public imageForm = this.formBuilder.group({
    foto_perfil: [""],
  });

  usuario: UsuarioI;
  perfiles: PerfilI[];
  habilidades: HabilidadI[];
  idiomas: IdiomaI[];
  valores: ValorI[];

  idUsuario: number;

  experienciasLaborales: ExperienciaLaboralI[];
  experienciasAcademicas: ExperienciaAcademicaI[];
  cursosCertificaciones: CursoCertificacionI[];

  panelOpenState = false;
  panelExpL = false;
  panelExpA = false;
  panelCurC = false;
  changeFoto = false;
  extensionValid = false;
  tamnioValid = false;

  nombreCompleto = "";
  email = "";
  telefono = "";
  foto_perfil = "";

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private formBuilder: FormBuilder,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit() {
    this.userProfileService.getUsuario().subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.usuario = resp.data;
        this.idUsuario = this.usuario.id_usuario;
        this.foto_perfil = this.usuario.foto_perfil;
        this.loadData();
      }
    });

    this.userProfileService.getPerfilesUsuario().subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.perfiles = resp.data;
      }
    });

    this.userProfileService.getHabilidadesUsuario().subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.habilidades = resp.data;
      }
    });

    this.userProfileService.getIdiomasUsuario().subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.idiomas = resp.data;
      }
    });

    this.userProfileService.getValoresUsuario().subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.valores = resp.data;
      }
    });

    this.getExperienciasLaborales();

    this.getExperienciasAcademicas();

    this.getCursosCertificaciones();
  }

  getExperienciasLaborales() {
    this.userProfileService.getExpLaborales().subscribe((resp: AuthResponseI) => {
      if(resp.status) {
        this.experienciasLaborales = resp.data;
      }
    });
  }

  getExperienciasAcademicas() {
    this.userProfileService.getExpAcademica().subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.experienciasAcademicas = resp.data;
      }
    });
  }

  getCursosCertificaciones() {
    this.userProfileService.getCursoCertificado().subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.cursosCertificaciones = resp.data;
      }
    });
  }

  loadData() {
    this.nombreCompleto = 
      this.usuario.nombre + " " +
      this.usuario.apellido_paterno + " " +
      this.usuario.apellido_materno;
    this.email = this.usuario.email;
    this.telefono = this.usuario.telefono;
    // this.experienciasLaborales = this.usuario.experiencias_laborales;
    // this.experienciasAcademicas = this.usuario.experiencias_academicas;
    // this.cursosCertificaciones = this.usuario.cursos_certificaciones;
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
      this.userProfileService.updateFoto(this.imageForm.value).subscribe(
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
