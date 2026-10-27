import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { Calendar } from 'lucide-react';

// Tooltip personalizado con estilo idéntico al de la imagen
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: '14px',
          padding: '12px 16px',
          boxShadow: '0 8px 24px rgba(18, 22, 33, 0.12)',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#181A20', marginBottom: '6px' }}>
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', marginBottom: '4px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366F1' }}></span>
          <span style={{ color: '#7A808C' }}>Usuarios actuales:</span>
          <strong style={{ color: '#6366F1', fontWeight: 700 }}>{data.usuarios} pax</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }}></span>
          <span style={{ color: '#7A808C' }}>Conversión esperada:</span>
          <strong style={{ color: '#059669', fontWeight: 700 }}>{data.esperado}%</strong>
        </div>
      </div>
    );
  }
  return null;
};

export default function ConversionFunnelChart({ etapas, reservas }) {
  // Ordenar etapas según display_order
  const etapasOrdenadas = [...etapas].sort((a, b) => a.display_order - b.display_order);

  // Calcular la cantidad de usuarios en cada etapa según las reservas filtradas
  const data = etapasOrdenadas.map((etapa) => {
    const count = reservas.filter((r) => r.stage_id === etapa.id).length;
    return {
      id: etapa.id,
      name: etapa.name,
      usuarios: count,
      esperado: etapa.conversion_rate_expected,
    };
  });

  // Colores degradados en lila/azul/índigo como en la referencia visual
  const barColors = ['#818CF8', '#6366F1', '#4F46E5', '#4338CA', '#3730A3'];

  return (
    <div className="white-panel-card">
      <div className="panel-header-row">
        <div>
          <h2 className="panel-title-text">Embudo de Conversión de Reservas</h2>
          <p className="panel-subtitle-text">
            Monitoreo en tiempo real del flujo de usuarios a través de las etapas del embudo
          </p>
        </div>

        <div className="panel-header-controls">
          <div className="chart-legend-indicator">
            <span className="legend-dot" style={{ background: '#6366F1' }}></span>
            <span>Volumen de Pasajeros</span>
          </div>

          <div className="date-range-badge">
            <Calendar size={13} color="#2563EB" />
            <span>
              Rango: <strong>Tiempo Real Hoy</strong>
            </span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: 290, marginTop: '12px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 20, left: -10, bottom: 25 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818CF8" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 0, 0, 0.05)" />
            <XAxis
              dataKey="name"
              stroke="#7A808C"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              dy={10}
            />
            <YAxis
              stroke="#7A808C"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.06)' }} />
            <Bar dataKey="usuarios" radius={[12, 12, 4, 4]} barSize={48}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
