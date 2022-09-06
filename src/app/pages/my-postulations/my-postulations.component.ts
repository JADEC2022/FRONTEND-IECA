import { Component, OnInit } from '@angular/core';
import { MyPostulationsService } from './my-postulations.service';
import { AuthResponseI } from '../../models/auth-response';
import { PostulacionI } from '../../models/postulacion';
import { UsuarioI } from '../../models/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-postulations',
  templateUrl: './my-postulations.component.html',
  styleUrls: ['../pages.component.css']
})
export class MyPostulationsComponent implements OnInit {

  postulaciones: PostulacionI[];
  nAceptadas: number = 0;
  nRechazadas: number = 0;
  nPendientes: number = 0;

  constructor(private mypostulationService: MyPostulationsService) { }

  ngOnInit(): void {
   this.getPostulaciones();
  }

  getPostulaciones() {
    this.mypostulationService.getMisPostulaciones().subscribe((resp: AuthResponseI) => {
      if(resp.status) {
        this.postulaciones = resp.data;     
        this.postulaciones.forEach(postulacion => {
          if(postulacion.rechazada == false && postulacion.aceptada == false ){
            this.nPendientes = this.nPendientes + 1;
          } else if (postulacion.rechazada == true) {
            this.nRechazadas = this.nRechazadas + 1;
          } else if (postulacion.aceptada == true) {
            this.nAceptadas = this.nAceptadas + 1;
          }
        });
      }
    });
  }

  statusVacante(status) {
    if (status == 1) return true;
    return false;
  }

  cancelarPostulacion(idPostulacion) {
    this.mypostulationService.cancelarPostulacion(idPostulacion).subscribe((resp: AuthResponseI) => {
      if (resp.status) {
        this.nPendientes = 0;
        this.nRechazadas = 0;
        this.nAceptadas = 0;
        this.doneMassage('Se cancelo tu postulación');
        this.getPostulaciones();
      }
    });
  }

  confirmarCancelarPostulacion(idPostulacion) {
    Swal.fire({
      icon: 'info',
      title: "¿Está seguro que desea cancelar su postulación?",
      showCancelButton: true,
      confirmButtonText: 'Sí, estoy seguro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelarPostulacion(idPostulacion);
      }
    })
  }

  verComentario(titulo, comentario) {
    Swal.fire({
      icon: 'info',
      title: titulo,
      text: comentario,
      timer: 3600
    })
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
