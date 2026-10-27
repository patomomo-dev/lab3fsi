Estructura de DATOS:1. Tabla de Vuelos (Inventario y Rutas)Esta entidad es necesaria para los filtros del dashboard (ver el rendimiento, disponibilidad y rutas específicas).JSON{
  "id": "string (UUID - identificador único del vuelo)",
  "origen": "string (Código IATA del aeropuerto de origen, ej: 'BOG')",
  "destino": "string (Código IATA del aeropuerto de destino, ej: 'MDE')",
  "fecha": "datetime (Fecha y hora de salida programada)",
  "asientos_disponibles": "integer (Cantidad de sillas libres actuales para evaluar cuellos de botella)",
  "estado": "string (Estado de la operación: 'activo', 'lleno', 'cancelado')"
}
2. Tabla de Etapas (Embudo de Conversión)Define las columnas del gráfico de barras del flujo de reservas. Es vital que sea una tabla separada para poder reordenar los pasos del diagrama (Búsqueda, Pago, Check-in) sin romper los datos.   JSON{
  "id": "string (UUID - identificador de la etapa)",
  "name": "string (Nombre visible: 'Búsqueda de Vuelo', 'Ingreso de Datos', 'Pago Procesado', 'Reserva Emitida')",
  "display_order": "integer (1, 2, 3... para ordenar el gráfico de izquierda a derecha)",
  "conversion_rate_expected": "integer (Porcentaje esperado de usuarios que completan esta fase, ej: 70%)"
}
3. Tabla de Pasajeros (Customers/Clients)La entidad que consume el servicio. Esencial para rastrear quién realiza la reserva y completar sus datos de contacto.JSON{
  "id": "string (UUID - identificador único del pasajero)",
  "full_name": "string (Nombre completo del pasajero)",
  "email": "string (Correo electrónico para confirmaciones y pases de abordar)",
  "phone": "string (Teléfono de contacto)",
  "tipo_viajero": "string (Segmentación: 'frecuente', 'ocasional', 'corporativo')"
}
4. Tabla de Reservas y Check-in (Hechos/Operaciones)Esta es la tabla más importante. De aquí salen todos los KPIs (Ingresos Totales, Tasa de Check-in, Ingresos por Equipaje, Tasas de Rechazo).   JSON{
  "id": "string (UUID - identificador único de la reserva)",
  "vuelo_id": "string (Foreign Key -> Tabla Vuelos. Hacia dónde y cuándo vuela)",
  "pasajero_id": "string (Foreign Key -> Tabla Pasajeros. Quién vuela)",
  "stage_id": "string (Foreign Key -> Tabla Etapas. En qué punto del diagrama se encuentra el usuario)",
  
  "monto": "decimal (El valor monetario del tiquete base. Alimenta el 'Total Revenue')",
  "currency": "string (ISO code, ej: 'USD', 'COP')",
  
  "estado_pago": "string (Estado transaccional: 'pendiente', 'aprobado', 'rechazado'. Vital para confirmar ingresos)",
  
  "equipaje_adicional_pagado": "boolean (True si el usuario adquirió maletas extra durante la validación)",
  "monto_equipaje": "decimal (El valor monetario cobrado exclusivamente por ancillary/maletas extra)",
  "check_in_confirmado": "boolean (True si completó exitosamente la selección de asiento y pase de abordar)",
  
  "created_at": "datetime (Fecha de inicio del proceso de reserva)"
}
Resumen de Relaciones para el Desarrollador1 Vuelo contiene N Reservas (Para visualizar vuelos críticos o llenos).
1 Pasajero puede tener N Reservas (Histórico de viajes y confirmaciones).
1 Etapa contiene N Reservas (Para agrupar el volumen de usuarios en el gráfico del embudo de conversión).