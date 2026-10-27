import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Luggage, Plane } from 'lucide-react';
import { formatCurrency } from './KpiGrid';

export default function ReservationsTable({
  reservas,
  vuelos,
  pasajeros,
  etapas,
  searchQuery,
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Mapear mapas para búsquedas rápidas
  const vuelosMap = new Map(vuelos.map((v) => [v.id, v]));
  const pasajerosMap = new Map(pasajeros.map((p) => [p.id, p]));
  const etapasMap = new Map(etapas.map((e) => [e.id, e]));

  // Filtrado por estado de pago y búsqueda de texto
  const filteredReservas = reservas.filter((res) => {
    // Filtro por tab de estado
    if (filterStatus !== 'ALL' && res.estado_pago !== filterStatus) {
      return false;
    }

    // Filtro por texto de búsqueda
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const pas = pasajerosMap.get(res.pasajero_id);
      const vue = vuelosMap.get(res.vuelo_id);
      const matchId = res.id.toLowerCase().includes(q);
      const matchName = pas?.full_name?.toLowerCase().includes(q);
      const matchEmail = pas?.email?.toLowerCase().includes(q);
      const matchFlight = vue?.id?.toLowerCase().includes(q);
      const matchRoute = `${vue?.origen} ${vue?.destino}`.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchEmail && !matchFlight && !matchRoute) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="white-panel-card" style={{ marginTop: '24px' }}>
      <div className="panel-header-row">
        <div>
          <h3 className="panel-title-text">Operaciones de Reservas & Pasajeros</h3>
          <p className="panel-subtitle-text">
            Mostrando {filteredReservas.length} de {reservas.length} registros en tiempo real
          </p>
        </div>

        {/* Filtros de Estado */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { key: 'ALL', label: 'Todas' },
            { key: 'aprobado', label: 'Aprobadas' },
            { key: 'pendiente', label: 'Pendientes' },
            { key: 'rechazado', label: 'Rechazadas' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              style={{
                background: filterStatus === tab.key ? '#181A20' : '#F4F2EE',
                color: filterStatus === tab.key ? '#FFFFFF' : '#646A83',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="table-responsive-container">
        <table className="data-table-modern">
          <thead>
            <tr>
              <th>ID Reserva</th>
              <th>Pasajero</th>
              <th>Vuelo & Ruta</th>
              <th>Etapa Embudo</th>
              <th>Monto Tiquete</th>
              <th>Equipaje Extra</th>
              <th>Estado Pago</th>
              <th>Check-in</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservas.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#7A808C' }}>
                  No se encontraron reservas con los filtros aplicados.
                </td>
              </tr>
            ) : (
              filteredReservas.map((res) => {
                const pas = pasajerosMap.get(res.pasajero_id);
                const vue = vuelosMap.get(res.vuelo_id);
                const eta = etapasMap.get(res.stage_id);

                return (
                  <tr key={res.id}>
                    {/* ID */}
                    <td style={{ fontWeight: 700, color: '#2563EB' }}>{res.id}</td>

                    {/* Pasajero */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={pas?.avatar}
                          alt={pas?.full_name}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              pas?.full_name || 'User'
                            )}&background=6366F1&color=fff`;
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>
                            {pas?.full_name || 'Pasajero'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#7A808C' }}>
                            {pas?.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Vuelo & Ruta */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Plane size={14} color="#6366F1" />
                        <span style={{ fontWeight: 600 }}>{vue?.id}</span>
                        <span style={{ color: '#7A808C', fontSize: '0.78rem' }}>
                          ({vue?.origen} ➔ {vue?.destino})
                        </span>
                      </div>
                    </td>

                    {/* Etapa */}
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          background: '#F5F3FF',
                          color: '#6366F1',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontWeight: 600,
                        }}
                      >
                        {eta?.name || res.stage_id}
                      </span>
                    </td>

                    {/* Monto */}
                    <td style={{ fontWeight: 600 }}>
                      {formatCurrency(Number(res.monto))} COP
                    </td>

                    {/* Equipaje */}
                    <td>
                      {res.equipaje_adicional_pagado ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '0.8rem', fontWeight: 600 }}>
                          <Luggage size={14} />
                          <span>+{formatCurrency(Number(res.monto_equipaje))}</span>
                        </div>
                      ) : (
                        <span style={{ color: '#9CA3AF', fontSize: '0.78rem' }}>Estándar (0)</span>
                      )}
                    </td>

                    {/* Estado Pago */}
                    <td>
                      <span className={`status-chip ${res.estado_pago}`}>
                        {res.estado_pago === 'aprobado' && <CheckCircle2 size={12} />}
                        {res.estado_pago === 'pendiente' && <Clock size={12} />}
                        {res.estado_pago === 'rechazado' && <AlertCircle size={12} />}
                        <span>{res.estado_pago}</span>
                      </span>
                    </td>

                    {/* Check-in */}
                    <td>
                      {res.check_in_confirmado ? (
                        <span className="checkin-chip-active">
                          <CheckCircle2 size={12} />
                          <span>Confirmado</span>
                        </span>
                      ) : (
                        <span className="checkin-chip-inactive">
                          <Clock size={12} style={{ marginRight: '4px' }} />
                          <span>Pendiente</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
