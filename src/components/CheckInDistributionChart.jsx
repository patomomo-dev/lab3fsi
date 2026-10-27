import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

export default function CheckInDistributionChart({ reservas }) {
  // 1. Pasajeros con Equipaje Adicional (Ancillary Baggage)
  const conEquipaje = reservas.filter(
    (r) => r.equipaje_adicional_pagado === true
  ).length;

  // 2. Pasajeros con Check-in estándar (sin equipaje adicional)
  const estandar = reservas.filter(
    (r) => r.equipaje_adicional_pagado === false && r.check_in_confirmado === true
  ).length;

  // 3. Pasajeros con Check-in Pendiente
  const pendiente = reservas.filter(
    (r) => r.check_in_confirmado === false && r.estado_pago === 'aprobado'
  ).length;

  // 4. Reservas con Pago Rechazado / Alerta
  const rechazado = reservas.filter(
    (r) => r.estado_pago === 'rechazado'
  ).length;

  const total = conEquipaje + estandar + pendiente + rechazado || 1;

  const data = [
    {
      name: 'Con Equipaje Adicional',
      value: conEquipaje,
      color: '#8B5CF6', // Púrpura intenso
    },
    {
      name: 'Check-in Estándar',
      value: estandar,
      color: '#A78BFA', // Lila suave
    },
    {
      name: 'Check-in Pendiente',
      value: pendiente,
      color: '#93C5FD', // Azul cielo
    },
    {
      name: 'Pago Rechazado',
      value: rechazado,
      color: '#FCA5A5', // Rojo suave alerta
    },
  ];

  // Porcentaje principal en el centro (Ancillary Baggage Ratio)
  const ancillaryRatio = Math.round((conEquipaje / total) * 100);

  return (
    <div className="white-panel-card">
      <div className="panel-header-row">
        <div>
          <h3 className="panel-title-text">Distribución de Check-in</h3>
          <p className="panel-subtitle-text">Proporción de equipaje adicional vs. estándar</p>
        </div>
      </div>

      <div className="semicircle-donut-wrapper" style={{ height: 210 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(value, name) => [`${value} pasajeros`, name]}
              contentStyle={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                fontSize: '0.8rem',
              }}
            />
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius={78}
              outerRadius={108}
              paddingAngle={4}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Métrica Central idéntica al diseño de la imagen (48% Contacted) */}
        <div className="donut-center-metric">
          <div className="donut-center-number">{ancillaryRatio}%</div>
          <div className="donut-center-label">Con Equipaje Extra</div>
        </div>
      </div>

      {/* Leyendas con puntos de color idénticos a la imagen */}
      <div className="donut-legends-row">
        {data.map((item) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: item.color,
                display: 'inline-block',
              }}
            />
            <span>
              {item.name}: <strong>{item.value}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
