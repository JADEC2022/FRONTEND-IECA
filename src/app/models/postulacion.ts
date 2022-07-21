import { UsuarioI } from './usuario';
import { VacantesI } from './vacante';

export class PostulacionI {
    id_postulacion?: number;
    fecha_postulacion?: Date;
    aceptada?: boolean;
    rechazada?: boolean;
    id_vacante_fk: number;
    id_usuario_fk: number;
    Usuario: UsuarioI;
    Vacante: VacantesI;
}