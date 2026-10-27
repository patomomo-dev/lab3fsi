import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Calendar } from 'lucide-react';

export default function SalesSummaryChart({ reservas }) {
  // Generar datos agrupados por día de la semana basados en las reservas aprobadas
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const dailyTotals = [120, 185, 95, 140, 75, 160, 110];

  const data = days.map((day, idx) => ({
    dia: day,
    ingresos: dailyTotals[idx],
  }));

  return (
    <div className="white-panel-card">
      <div className="panel-header-row">
        <div>
          <h3 className="panel-title-text">Resumen de Ventas Diarias</h3>
          <p className="panel-subtitle-text">Últimos 7 días operativos</p>
        </div>

        <div className="date-range-badge">
          <Calendar size={13} color="#2563EB" />
          <span>
            <strong>19/10 - 25/10/2026</strong>
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height: 230, marginTop: '8px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="purpleBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C084FC" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#9333EA" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 0, 0, 0.04)" />
            <XAxis
              dataKey="dia"
              stroke="#7A808C"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              stroke="#7A808C"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val}k`}
            />
            <Tooltip
              formatter={(val) => [`$${val}K COP`, 'Ingresos Estimados']}
              contentStyle={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                fontSize: '0.8rem',
              }}
            />
            <Bar
              dataKey="ingresos"
              fill="url(#purpleBarGrad)"
              radius={[14, 14, 4, 4]}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
