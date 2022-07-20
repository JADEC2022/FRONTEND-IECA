import { CursoCertificacionI } from './cursos_certificaciones';
import { ExperienciaAcademicaI } from './experiencia_academica';
import { ExperienciaLaboralI } from './experiencia_laboral';

export class UsuarioI {
  // Atributos generales entre Empresa y Postulante
  id_usuario?: number;
  nombre?: string;
  telefono?: string;
  email: string;
  pass?: string;
  email_validado?: boolean;
  sups_notificacion?: string;
  tipo_usuario?: string; 
  activo?: number;
  foto_perfil?: string;
  calificacion?: number;

  // Atributos de Usuario
  apellido_paterno?: string;
  apellido_materno?: string;
  fecha_nacimiento?: Date;
  sexo?: string;
  cv?: string;
  pais?: string;
  codigo_postal?: string;
  ciudad?: string;
  domicilio?: string;
  telefono_casa?: string;
  curp?: string;

  // Atributos de Empresa
  administrador?: string;
  ubicacion?: string;
  giro?: string;
  pagina_web?: string;
  numero_sucursales?: number;

  // Por Eliminar
  cursos_certificaciones?: CursoCertificacionI[];
  experiencias_academicas?: ExperienciaAcademicaI[];
  experiencias_laborales?: ExperienciaLaboralI[];
  /*Preguntar como temina*/
}
