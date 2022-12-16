import { UsuarioI } from './usuario';
import { VacantesI } from './vacante';

export class AdministradorAccionI {
    id_administrador_accion?: number;
    estado_anterior?: string;
    estado_actual?: string;
    fecha_modificacion?: string;
    cantidadResultados?: number;
    id_vacante_fk?: number;
    id_usuario_administrador_fk?: number;
    id_usuario_empresa_fk?: number;
    Vacante?: VacantesI;
    UsuarioAdmnistrador?: UsuarioI;
    UsuarioEmpresa?: UsuarioI;
}