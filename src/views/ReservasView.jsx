import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Luggage,
  Plane,
  Download,
  Plus,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency } from '../components/KpiGrid';

export default function ReservasView({
  reservas,
  vuelos,
  pasajeros,
  etapas,
  selectedRoute,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [selectedReserva, setSelectedReserva] = useState(null);

  const vuelosMap = useMemo(() => new Map(vuelos.map((v) => [v.id, v])), [vuelos]);
  const pasajerosMap = useMemo(() => new Map(pasajeros.map((p) => [p.id, p])), [pasajeros]);
  const etapasMap = useMemo(() => new Map(etapas.map((e) => [e.id, e])), [etapas]);

  // Filtrado reactivo de reservas
  const filtered = useMemo(() => {
    return reservas.filter((res) => {
      if (statusFilter !== 'ALL' && res.estado_pago !== statusFilter) return false;
      if (stageFilter !== 'ALL' && res.stage_id !== stageFilter) return false;

      if (search.trim() !== '') {
        const q = search.toLowerCase();
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
  }, [reservas, statusFilter, stageFilter, search, pasajerosMap, vuelosMap]);

  // Métricas de la vista
  const totalMonto = useMemo(() => {
    return filtered
      .filter((r) => r.estado_pago === 'aprobado')
      .reduce((sum, r) => sum + Number(r.monto), 0);
  }, [filtered]);

  const aprobadasCount = filtered.filter((r) => r.estado_pago === 'aprobado').length;
  const pendientesCount = filtered.filter((r) => r.estado_pago === 'pendiente').length;
  const rechazadasCount = filtered.filter((r) => r.estado_pago === 'rechazado').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Encabezado de la Vista */}
      <div className="panel-header-row" style={{ alignItems: 'flex-start' }}>
        <div>
          <h2 className="topbar-page-title" style={{ fontSize: '1.6rem' }}>
            Operaciones de Reservas & Flujos
          </h2>
          <p className="panel-subtitle-text" style={{ fontSize: '0.85rem' }}>
            Control exhaustivo de transacciones, emisión de tiquetes y avance en el embudo
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn-export-green"
            onClick={() => alert('Exportando listado de reservas en CSV...')}
          >
            <Download size={16} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Mini KPIs de la Sección de Reservas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
        }}
      >
        <div className="white-panel-card" style={{ padding: '18px 20px' }}>
          <div className="kpi-title-label">Total en Vista</div>
          <div className="kpi-main-number" style={{ fontSize: '1.8rem', marginTop: '6px' }}>
            {filtered.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#7A808C' }}>
            De {reservas.length} reservas registradas
          </div>
        </div>

        <div className="white-panel-card" style={{ padding: '18px 20px' }}>
          <div className="kpi-title-label">Ingresos Aprobados</div>
          <div
            className="kpi-main-number"
            style={{ fontSize: '1.8rem', marginTop: '6px', color: '#10B981' }}
          >
            {formatCurrency(totalMonto)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
            {aprobadasCount} transacciones validadas
          </div>
        </div>

        <div className="white-panel-card" style={{ padding: '18px 20px' }}>
          <div className="kpi-title-label">En Validación (Pendiente)</div>
          <div
            className="kpi-main-number"
            style={{ fontSize: '1.8rem', marginTop: '6px', color: '#F59E0B' }}
          >
            {pendientesCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#D97706' }}>
            Esperando pasarela o confirmación
          </div>
        </div>

        <div className="white-panel-card" style={{ padding: '18px 20px' }}>
          <div className="kpi-title-label">Alertas de Rechazo</div>
          <div
            className="kpi-main-number"
            style={{ fontSize: '1.8rem', marginTop: '6px', color: '#EF4444' }}
          >
            {rechazadasCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#DC2626' }}>
            Riesgo de abandono de reserva
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div
        className="white-panel-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          gap: '14px',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, minWidth: 260 }}>
          <div className="topbar-search-box" style={{ width: '100%', maxWidth: 360 }}>
            <Search size={16} color="#A0A5B1" />
            <input
              type="text"
              className="topbar-search-input"
              placeholder="Buscar por ID, pasajero, correo o vuelo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Filtro por Etapa */}
          <div className="route-filter-wrapper">
            <Filter size={14} color="#6366F1" />
            <select
              className="route-filter-select"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
            >
              <option value="ALL">Todas las Etapas</option>
              {etapas.map((et) => (
                <option key={et.id} value={et.id}>
                  {et.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Estado de Pago */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { key: 'ALL', label: 'Todos' },
              { key: 'aprobado', label: 'Aprobados' },
              { key: 'pendiente', label: 'Pendientes' },
              { key: 'rechazado', label: 'Rechazados' },
            ].map((st) => (
              <button
                key={st.key}
                onClick={() => setStatusFilter(st.key)}
                style={{
                  background: statusFilter === st.key ? '#181A20' : '#F4F2EE',
                  color: statusFilter === st.key ? '#FFFFFF' : '#646A83',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla Completa de Reservas */}
      <div className="white-panel-card" style={{ padding: '20px' }}>
        <div className="table-responsive-container">
          <table className="data-table-modern">
            <thead>
              <tr>
                <th>ID Reserva</th>
                <th>Fecha Creación</th>
                <th>Pasajero</th>
                <th>Contacto</th>
                <th>Vuelo & Ruta</th>
                <th>Etapa Embudo</th>
                <th>Valor Tiquete</th>
                <th>Equipaje Ancillary</th>
                <th>Estado Pago</th>
                <th>Check-in</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: 'center', padding: '40px', color: '#7A808C' }}>
                    No se encontraron reservas con los criterios aplicados.
                  </td>
                </tr>
              ) : (
                filtered.map((res) => {
                  const pas = pasajerosMap.get(res.pasajero_id);
                  const vue = vuelosMap.get(res.vuelo_id);
                  const eta = etapasMap.get(res.stage_id);

                  return (
                    <tr key={res.id}>
                      <td style={{ fontWeight: 700, color: '#2563EB' }}>{res.id}</td>
                      <td style={{ fontSize: '0.78rem', color: '#7A808C' }}>
                        {new Date(res.created_at).toLocaleTimeString('es-CO', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img
                            src={pas?.avatar}
                            alt=""
                            style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                pas?.full_name || 'User'
                              )}&background=6366F1&color=fff`;
                            }}
                          />
                          <span style={{ fontWeight: 600, fontSize: '0.84rem' }}>
                            {pas?.full_name}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.76rem', color: '#7A808C' }}>{pas?.email}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Plane size={13} color="#6366F1" />
                          <span style={{ fontWeight: 600 }}>{vue?.id}</span>
                          <span style={{ color: '#7A808C', fontSize: '0.76rem' }}>
                            ({vue?.origen}➔{vue?.destino})
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.74rem',
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
                      <td style={{ fontWeight: 700 }}>{formatCurrency(Number(res.monto))}</td>
                      <td>
                        {res.equipaje_adicional_pagado ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#059669',
                              fontWeight: 600,
                              fontSize: '0.8rem',
                            }}
                          >
                            <Luggage size={14} />
                            <span>+{formatCurrency(Number(res.monto_equipaje))}</span>
                          </div>
                        ) : (
                          <span style={{ color: '#9CA3AF', fontSize: '0.76rem' }}>Estándar (0)</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-chip ${res.estado_pago}`}>
                          {res.estado_pago === 'aprobado' && <CheckCircle2 size={12} />}
                          {res.estado_pago === 'pendiente' && <Clock size={12} />}
                          {res.estado_pago === 'rechazado' && <AlertCircle size={12} />}
                          <span>{res.estado_pago}</span>
                        </span>
                      </td>
                      <td>
                        {res.check_in_confirmado ? (
                          <span className="checkin-chip-active">
                            <CheckCircle2 size={12} />
                            <span>Confirmado</span>
                          </span>
                        ) : (
                          <span className="checkin-chip-inactive">
                            <Clock size={12} style={{ marginRight: 4 }} />
                            <span>Pendiente</span>
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          style={{
                            background: 'none',
                            border: '1px solid rgba(0,0,0,0.08)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#6366F1',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.76rem',
                            fontWeight: 600,
                          }}
                          onClick={() => setSelectedReserva(res)}
                        >
                          <Eye size={12} />
                          <span>Ver</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle de Reserva */}
      {selectedReserva && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '16px',
          }}
          onClick={() => setSelectedReserva(null)}
        >
          <div
            className="white-panel-card"
            style={{ maxWidth: 520, width: '100%', padding: '28px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '18px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Detalle de Reserva {selectedReserva.id}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#7A808C' }}>
                  Creada el {new Date(selectedReserva.created_at).toLocaleString('es-CO')}
                </span>
              </div>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: '#7A808C',
                }}
                onClick={() => setSelectedReserva(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.86rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: '#F9FAFB',
                  borderRadius: '8px',
                }}
              >
                <span style={{ color: '#6B7280' }}>Pasajero:</span>
                <strong>{pasajerosMap.get(selectedReserva.pasajero_id)?.full_name}</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: '#F9FAFB',
                  borderRadius: '8px',
                }}
              >
                <span style={{ color: '#6B7280' }}>Vuelo:</span>
                <strong>
                  {vuelosMap.get(selectedReserva.vuelo_id)?.id} (
                  {vuelosMap.get(selectedReserva.vuelo_id)?.origen} ➔{' '}
                  {vuelosMap.get(selectedReserva.vuelo_id)?.destino})
                </strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: '#F9FAFB',
                  borderRadius: '8px',
                }}
              >
                <span style={{ color: '#6B7280' }}>Etapa actual:</span>
                <strong>{etapasMap.get(selectedReserva.stage_id)?.name}</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: '#F9FAFB',
                  borderRadius: '8px',
                }}
              >
                <span style={{ color: '#6B7280' }}>Valor Base:</span>
                <strong>{formatCurrency(Number(selectedReserva.monto))} COP</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: '#F9FAFB',
                  borderRadius: '8px',
                }}
              >
                <span style={{ color: '#6B7280' }}>Equipaje Adicional:</span>
                <strong>
                  {selectedReserva.equipaje_adicional_pagado
                    ? `Sí (+${formatCurrency(Number(selectedReserva.monto_equipaje))} COP)`
                    : 'No'}
                </strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: '#F9FAFB',
                  borderRadius: '8px',
                }}
              >
                <span style={{ color: '#6B7280' }}>Estado del Pago:</span>
                <span className={`status-chip ${selectedReserva.estado_pago}`}>
                  {selectedReserva.estado_pago}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: '#F9FAFB',
                  borderRadius: '8px',
                }}
              >
                <span style={{ color: '#6B7280' }}>Check-in:</span>
                <strong>
                  {selectedReserva.check_in_confirmado ? 'Confirmado' : 'Pendiente'}
                </strong>
              </div>
            </div>

            <button
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '10px',
                background: '#181A20',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={() => setSelectedReserva(null)}
            >
              Cerrar Detalle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
