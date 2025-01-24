export function esFechaFinValida(fechaInicio: any, fechaFin: any): boolean {
  const fechaInicioValida = new Date(fechaInicio);
  const fechaFinValida = new Date(fechaFin);

  if (isNaN(fechaInicioValida.getTime()) || isNaN(fechaFinValida.getTime())) {
    console.error('Una o ambas fechas no son válidas');
    return false;
  }

  if (fechaFinValida <= fechaInicioValida) {
    return false;
  }

  return true;
}
