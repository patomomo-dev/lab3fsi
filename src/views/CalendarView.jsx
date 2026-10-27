import React from 'react';
import { Calendar as CalendarIcon, Clock, Plane, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarView({ vuelos }) {
  const horas = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="panel-header-row">
        <div>
          <h2 className="topbar-page-title" style={{ fontSize: '1.6rem' }}>
            Itinerario & Cronograma Operativo
          </h2>
          <p className="panel-subtitle-text" style={{ fontSize: '0.85rem' }}>
            Programación de slots de salida y arribo para vuelos comerciales de la jornada
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="icon-action-btn">
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Domingo, 25 Octubre 2026</span>
          <button className="icon-action-btn">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="white-panel-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {vuelos.map((v) => {
            const hora = new Date(v.fecha).toLocaleTimeString('es-CO', {
              hour: '2-digit',
              minute: '2-digit',
            });
            const isCritical = Number(v.asientos_disponibles) === 0;

            return (
              <div
                key={v.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '16px 20px',
                  background: '#F9FAFB',
                  borderRadius: '14px',
                  border: isCritical ? '1px solid #FECACA' : '1px solid rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ minWidth: 70, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#181A20' }}>
                    {hora}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#7A808C' }}>Hora Local</div>
                </div>

                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    background: isCritical ? '#FEF2F2' : '#EFF6FF',
                    color: isCritical ? '#DC2626' : '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Plane size={22} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>{v.id}</span>
                    <span style={{ fontWeight: 700, color: '#6366F1' }}>
                      {v.origen} ➔ {v.destino}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: isCritical ? '#FEF2F2' : '#ECFDF5',
                        color: isCritical ? '#DC2626' : '#059669',
                        fontWeight: 700,
                      }}
                    >
                      {v.estado.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#7A808C', marginTop: '4px' }}>
                    Puerta de embarque asignada: Gate {v.id.replace('FL-', 'B-')} • Tiempo estimado de vuelo: 55 min
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: isCritical ? '#DC2626' : '#10B981' }}>
                    {isCritical ? '0 Sillas Libres' : `${v.asientos_disponibles} Sillas Libres`}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#7A808C', marginTop: '2px' }}>
                    {isCritical ? 'Lista de Espera Activa' : 'Embarque Abierto'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
