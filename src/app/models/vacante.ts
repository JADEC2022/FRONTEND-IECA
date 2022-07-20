import { UsuarioI } from './usuario';
import { SucursalesI } from './sucursal';

export class VacantesI {
    id_vacante?: number;
    puesto?: string;
    fecha_publicacion?: Date;
    imagen?: string;
    sueldo?: string;
    descripcion?: string;
    disponible?: boolean;
    modalidad?: string;
    nivel?: string;
    vistas?: number;
    publicada?: number;
    activo?: number;
    id_usuario_fk?: number;
    id_sucursal_fk?: number;
    estado?: string;
    Vacantes_Favoritas?: any;
    Usuario?: UsuarioI;
    SucursalesI?: SucursalesI;
}
