import React from 'react';
import KpiCard from './KpiCard';

// Función auxiliar para formatear números de moneda en COP
export function formatCurrency(amount) {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}M`;
  }
  return `$${amount.toLocaleString('es-CO')}`;
}

export default function KpiGrid({ reservas, vuelos }) {
  // 1. Ingresos por Tickets: Suma del campo monto donde estado_pago === 'aprobado'
  const ingresosTickets = reservas.reduce((total, r) => {
    return r.estado_pago === 'aprobado' ? total + Number(r.monto || 0) : total;
  }, 0);

  // 2. Ingresos por Ancillaries (Equipaje): Suma del campo monto_equipaje donde equipaje_adicional_pagado === true
  const ingresosAncillaries = reservas.reduce((total, r) => {
    return r.equipaje_adicional_pagado === true
      ? total + Number(r.monto_equipaje || 0)
      : total;
  }, 0);

  // 3. Tasa de Check-in: Porcentaje de reservas con check_in_confirmado === true respecto al total de reservas emitidas (stage s4 y s5 o aprobadas)
  const reservasEmitidas = reservas.filter(
    (r) => r.estado_pago === 'aprobado' && (r.stage_id === 's4' || r.stage_id === 's5')
  );
  const totalEmitidasCount = reservasEmitidas.length || 1;
  const confirmadosCount = reservas.filter((r) => r.check_in_confirmado === true).length;
  const tasaCheckIn = Math.min(
    100,
    Math.round((confirmadosCount / totalEmitidasCount) * 100)
  );

  // 4. Vuelos Críticos: Conteo de vuelos donde asientos_disponibles === 0
  const vuelosCriticos = vuelos.filter(
    (v) => Number(v.asientos_disponibles) === 0
  ).length;

  return (
    <div className="kpi-cards-grid">
      {/* KPI 1: Ingresos por Tickets */}
      <KpiCard
        title="Ingresos por Tickets"
        value={formatCurrency(ingresosTickets)}
        percentageText="↑ 12.4%"
        isPositive={true}
        badgeType="green"
        sparklineColor="#10B981"
        sparklineData={[6.2, 6.8, 7.1, 7.5, 8.2, 8.0, 9.1, 9.4]}
        linkText="Ver desglose de pagos"
      />

      {/* KPI 2: Ingresos por Ancillaries (Equipaje) */}
      <KpiCard
        title="Ingresos por Ancillaries"
        value={formatCurrency(ingresosAncillaries)}
        percentageText="↑ 18.2%"
        isPositive={true}
        badgeType="blue"
        sparklineColor="#2563EB"
        sparklineData={[420, 510, 480, 620, 710, 690, 830, 895]}
        linkText="Ver ventas de equipaje"
      />

      {/* KPI 3: Tasa de Check-in */}
      <KpiCard
        title="Tasa de Check-in"
        value={`${tasaCheckIn}%`}
        percentageText="↑ 6.1%"
        isPositive={true}
        badgeType="green"
        sparklineColor="#10B981"
        sparklineData={[52, 58, 61, 64, 62, 67, 70, 72]}
        linkText="Ver pases de abordar"
      />

      {/* KPI 4: Vuelos Críticos (Capacidad agotada) */}
      <KpiCard
        title="Vuelos Críticos"
        value={`${vuelosCriticos} ${vuelosCriticos === 1 ? 'vuelo' : 'vuelos'}`}
        percentageText={vuelosCriticos > 0 ? "Alerta 0 sillas" : "Disponibilidad OK"}
        isPositive={vuelosCriticos === 0}
        badgeType={vuelosCriticos > 0 ? "red" : "green"}
        sparklineColor={vuelosCriticos > 0 ? "#EF4444" : "#10B981"}
        sparklineData={vuelosCriticos > 0 ? [1, 2, 2, 3, 3, 4, 4, vuelosCriticos] : [2, 1, 1, 0, 0, 0, 0, 0]}
        linkText="Monitorear inventario"
      />
    </div>
  );
}
