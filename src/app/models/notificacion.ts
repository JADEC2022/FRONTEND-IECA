import { VacantesI } from "./vacante";
import { UsuarioI } from "./usuario";

export class NotificationI {
	id_notificacion?: number;
	url?: string;
	titulo?: string;
	mensaje?: string;
	visto?: boolean;
	fecha_creacion?: Date;
	Vacante?: VacantesI;
	Empresa?: UsuarioI;
}
