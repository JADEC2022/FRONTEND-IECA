export class ExperienciaLaboralI {
    id_experiencia_laboral?: number;
    puesto?: string;
    empresa?: string;
    actividades?: string;
    fecha_entrada?: Date;
    fecha_salida?: Date;
    trabajando?: boolean;
    id_usuario_fk?: number;
}