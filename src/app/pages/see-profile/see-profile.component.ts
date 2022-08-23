import { Component, OnInit } from '@angular/core';
import { SeeProfileService } from './see-profile.service';
import { UsuarioI } from '../../models/usuario';
import { AuthResponseI } from '../../models/auth-response';
import { ActivatedRoute } from '@angular/router';
import { ExperienciaLaboralI } from '../../models/experiencia-laboral';
import { ExperienciaAcademicaI } from 'app/models/experiencia-academica';
import { HabilidadI } from '../../models/habilidad';
import { IdiomaI } from 'app/models/idioma';
import { ValorI } from '../../models/valor';
import { PerfilI } from '../../models/perfil';
import { CursoCertificacionI } from '../../models/cursos-certificaciones';
import Swal from 'sweetalert2';
import { PostulacionI } from 'app/models/postulacion';

@Component({
  selector: 'app-see-profile',
  templateUrl: './see-profile.component.html',
  styleUrls: ['./see-profile.component.css']
})
export class SeeProfileComponent implements OnInit {


  idPostulacion: number;
  idUsuario: number;
  idVacante: number;
  nombre: string;
  puesto: string;
  usuario: UsuarioI;
  postulante: PostulacionI;
  habilidades: HabilidadI[];
  idiomas: IdiomaI[];
  valores: ValorI[];
  perfiles: PerfilI[];
  expLaborales: ExperienciaLaboralI[];
  expAcademicas: ExperienciaAcademicaI[];
  cursoCertificados: CursoCertificacionI[];


  constructor(
    private seeProfileService: SeeProfileService,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.idPostulacion = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
 
    
    this.seeProfileService.getPostulante(this.idPostulacion).subscribe((resp: AuthResponseI) => {
      if(resp.status) {
        this.usuario = resp.data.Usuario;
        this.postulante = resp.data;
        this.idUsuario = this.usuario.id_usuario;
        this.idVacante = resp.data.Vacante.id_vacante;
        this.puesto = resp.data.Vacante.puesto;
        this.nombre = resp.data.Vacante.Usuario.nombre;
        this.loadData();
      }
    });
  }

  loadData() {
    this.seeProfileService.getExpLaboral(this.idUsuario).subscribe((resp: AuthResponseI) => {
      if(resp.status) {
        this.expLaborales = resp.data;
      }
    });

    this.seeProfileService.getExpAcademica(this.idUsuario).subscribe((resp: AuthResponseI) => {
      if(resp.status) {
        this.expAcademicas = resp.data;
      }
    });

    this.seeProfileService.getHabilidad(this.idUsuario).subscribe((resp: AuthResponseI) => {
      if(resp.status) {
        this.habilidades = resp.data;
      }
    });

    this.seeProfileService.getValor(this.idUsuario).subscribe((resp: AuthResponseI) => {
      if(resp.status) {
        this.valores = resp.data;
      }
    });

    this.seeProfileService.getIdioma(this.idUsuario).subscribe((resp: AuthResponseI) => {
      if(resp.status) {
        this.idiomas = resp.data;
      }
    });

    this.seeProfileService.getPerfil(this.idUsuario).subscribe((resp: AuthResponseI) => {
      if(resp.status) {
        this.perfiles = resp.data;
      }
    });

    this.seeProfileService.getCursoCertificado(this.idUsuario).subscribe((resp: AuthResponseI) => {
      if(resp.status) {
        this.cursoCertificados = resp.data;
      }
    });
  }

  updatePostulante() {
    this.seeProfileService.getPostulante(this.idPostulacion).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.postulante = resp.data;
      }
    })
  }

  aceptarPostulacion() {
    this.seeProfileService.aceptarPostulacion(this.idPostulacion).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.doneMassage("Aceptó al postulante");
        this.updatePostulante();
        this.addNotificacion('aceptó', 'Felicidades, ');
      }
    })
  }

  rechazarPostulacion(comentario) {
    this.seeProfileService.rechazarPostulacion(this.idPostulacion, comentario).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.doneMassage("Rechazó al postulante");
        this.updatePostulante();
        this.addNotificacion('rechazó', 'Lo sentimos, ');
      }
    })
  }

  addNotificacion(status, inicio) {
    let url = '/postulate-vacancy/' + this.idVacante; 
    let titulo = inicio + this.nombre + ' ' + status + ' tu postulacion!';
    let mensaje = 'La empresa ' + this.nombre + ' ' + status + ' tu postulacion de su vacante para ' + this.puesto;
    this.seeProfileService.addNotificacion(url, titulo, mensaje, this.idVacante, this.idUsuario).subscribe((resp: AuthResponseI) => {
      if (!resp.status) {
        console.log(resp);
      }
    });
  }

  confirmarAceptarPostulacion() {
    Swal.fire({
      icon: 'info',
      title: "¿Está seguro que desea aceptar al postulante?",
      showCancelButton: true,
      confirmButtonText: 'Sí, estoy seguro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.aceptarPostulacion();
      }
    })
  }

  confirmarRechazarPostulacion() {
    Swal.fire({
      icon: 'info',
      title: "¿Está seguro que desea rechazar al postulante?",
      input: 'textarea',
      inputPlaceholder: 'Deja un comentario',
      showCancelButton: true,
      confirmButtonText: 'Sí, estoy seguro',
      cancelButtonText: 'Cancelar',
      preConfirm: (comentario) => {
        this.rechazarPostulacion(comentario);
      }
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
}
