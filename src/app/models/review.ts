export interface ReviewI {
    id_usuario?: number;
    nombre: string;
    foto_perfil?: string;
    pagina_web: string;
    calificacion?: number;
    numero_calificaciones?: number;
    Resenia?: Resenia;
    Resenias?: Resenia[];
}

export interface Resenia {
    id_resenia: number;
    fecha_resenia?: Date;
    calificacion: number;
    comentario?: string;
    id_emisor?: number;
    id_receptor?: number;
    //nombre: string;
}
