import { Component, OnInit, Output } from '@angular/core';
import { MatChipInputEvent } from "@angular/material/chips";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { UsuarioService } from '../../services/usuario.service';
import { AuthResponseI } from 'app/models/auth-response';
import { UsuarioI } from 'app/models/usuario';
import { ExperienciaLaboralI } from '../../models/experiencia_laboral';
import { ExperienciaAcademicaI } from 'app/models/experiencia_academica';
import { CursoCertificacionI } from '../../models/cursos_certificaciones';
import { PerfilPostulanteI } from 'app/models/perfil_postulante';
import { HabilidadPostulanteI } from '../../models/habilidades_postulante';
import { ValorPostulanteI } from '../../models/valor_postulante';
import { IdiomaPostulanteI } from '../../models/idioma_postulante';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
 

  usuario: UsuarioI;
  experienciasLaborales: ExperienciaLaboralI[];
  experienciasAcademicas: ExperienciaAcademicaI[];
  cursosCertificaciones: CursoCertificacionI[];
  
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  panelOpenState = false;

  nombreCompleto = '';
  email = '';
  telefono_celular = '';


  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private usuarioService: UsuarioService) {
   }

  ngOnInit() {
    this.usuarioService.readUsuario().subscribe((resp: AuthResponseI ) => {
      if(resp.status) {
        this.usuario = resp.data;
        this.loadData();
      }
    });

    // this.usuarioService.readPerfiles().subscribe((resp: AuthResponseI) => {
    //   if(resp.status) {
    //     this.perfiles = resp.data;
    //   }
    //   console.log(resp.message);
    // })
  }
 
  loadData() {
    this.nombreCompleto = this.usuario.nombre + ' ' + this.usuario.apellido_paterno + ' ' + this.usuario.apellido_materno;
    this.email = this.usuario.email;
    this.telefono_celular = this.usuario.telefono_celular;
    this.experienciasLaborales = this.usuario.experiencias_laborales;
    this.experienciasAcademicas = this.usuario.experiencias_academicas;
    this.cursosCertificaciones = this.usuario.cursos_certificaciones;
    /* this.perfiles = this.usuario.perfiles_postulante; */
    /* this.habilidades = this.usuario.habilidades_postulante; */
    /* this.valores = this.usuario.valores_postulante; */
    /* this.idiomas = this.usuario.idiomas_postulante; */
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
}
