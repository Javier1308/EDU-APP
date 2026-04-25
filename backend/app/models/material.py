from enum import Enum


class MaterialType(str, Enum):
    PLANIFICACION_ANUAL = "planificacion_anual"
    UNIDAD_APRENDIZAJE = "unidad_aprendizaje"
    SESION_APRENDIZAJE = "sesion_aprendizaje"
    RECURSOS_EDUCATIVOS = "recursos_educativos"
    MATRIZ_COMPETENCIAS = "matriz_competencias"
    FICHA_TRABAJO = "ficha_trabajo"
    FICHA_LABORATORIO = "ficha_laboratorio"


class EducationLevel(str, Enum):
    PRIMARIA = "primaria"


class Grade(str, Enum):
    PRIMERO = "1ro"
    SEGUNDO = "2do"
    TERCERO = "3ro"
    CUARTO = "4to"
    QUINTO = "5to"
    SEXTO = "6to"


STEM_SUBJECTS = [
    "Matemática",
    "Ciencias y Tecnología",
    "Ciencias Sociales",
    "Comunicación",
    "Personal Social",
    "Arte y Cultura",
    "Educación Física",
    "Educación Religiosa",
]
