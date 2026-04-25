RUBRIC_CRITERIA = [
    "Alineación curricular",
    "Claridad del propósito de aprendizaje",
    "Coherencia entre competencia, actividades y evaluación",
    "Pertinencia de los recursos",
    "Calidad de los criterios de evaluación",
    "Inclusión de competencias transversales",
    "Claridad de redacción",
    "Aplicabilidad en aula",
]

LEVEL_THRESHOLDS = {
    "Excelente": 90,
    "Bueno": 75,
    "Regular": 60,
    "Por mejorar": 0,
}


def get_level(score: int) -> str:
    for level, threshold in LEVEL_THRESHOLDS.items():
        if score >= threshold:
            return level
    return "Por mejorar"
