import React, { useState, useMemo } from 'react';
import {
  Plane,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  Users,
  TrendingUp,
} from 'lucide-react';

export default function VuelosView({ vuelos, reservas, onSelectFlight }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [originFilter, setOriginFilter] = useState('ALL');

  // Capacidad de referencia por tipo de avión estándar (ej: 30 sillas para el modelo del mock)
  const CAPACIDAD_VUELO = 30;

  // Aeropuertos de origen únicos
  const origenes = useMemo(() => {
    return Array.from(new Set(vuelos.map((v) => v.origen)));
  }, [vuelos]);

  // Filtrado de vuelos
  const filtered = useMemo(() => {
    return vuelos.filter((v) => {
      if (statusFilter !== 'ALL' && v.estado !== statusFilter) return false;
      if (originFilter !== 'ALL' && v.origen !== originFilter) return false;
      if (search.trim() !== '') {
        const q = search.toLowerCase();
        const matchId = v.id.toLowerCase().includes(q);
        const matchRoute = `${v.origen} ${v.destino}`.toLowerCase().includes(q);
        if (!matchId && !matchRoute) return false;
      }
      return true;
    });
  }, [vuelos, statusFilter, originFilter, search]);

  // KPIs de Vuelos
  const totalVuelos = vuelos.length;
  const vuelosCriticos = vuelos.filter((v) => Number(v.asientos_disponibles) === 0).length;
  const vuelosActivos = vuelos.filter((v) => v.estado === 'activo').length;
  const totalSillasLibres = vuelos.reduce((sum, v) => sum + Number(v.asientos_disponibles), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Encabezado */}
      <div className="panel-header-row">
        <div>
          <h2 className="topbar-page-title" style={{ fontSize: '1.6rem' }}>
            Operaciones de Vuelos & Disponibilidad
          </h2>
          <p className="panel-subtitle-text" style={{ fontSize: '0.85rem' }}>
            Monitoreo en tiempo real de inventario, rutas críticas y factores de ocupación
          </p>
        </div>
      </div>

      {/* Mini KPIs de Vuelos */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
        }}
      >
        <div className="white-panel-card" style={{ padding: '18px 20px' }}>
          <div className="kpi-title-label">Itinerario Programado</div>
          <div className="kpi-main-number" style={{ fontSize: '1.8rem', marginTop: '6px' }}>
            {totalVuelos} Vuelos
          </div>
          <div style={{ fontSize: '0.75rem', color: '#7A808C' }}>Red Troncal & Regional</div>
        </div>

        <div className="white-panel-card" style={{ padding: '18px 20px' }}>
          <div className="kpi-title-label">Vuelos Críticos (Agotados)</div>
          <div
            className="kpi-main-number"
            style={{ fontSize: '1.8rem', marginTop: '6px', color: '#EF4444' }}
          >
            {vuelosCriticos}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 600 }}>
            0 sillas libres (Sobredemanda)
          </div>
        </div>

        <div className="white-panel-card" style={{ padding: '18px 20px' }}>
          <div className="kpi-title-label">Operación Activa</div>
          <div
            className="kpi-main-number"
            style={{ fontSize: '1.8rem', marginTop: '6px', color: '#10B981' }}
          >
            {vuelosActivos}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
            En tiempo y con cupos abiertos
          </div>
        </div>

        <div className="white-panel-card" style={{ padding: '18px 20px' }}>
          <div className="kpi-title-label">Inventario Remanente</div>
          <div
            className="kpi-main-number"
            style={{ fontSize: '1.8rem', marginTop: '6px', color: '#2563EB' }}
          >
            {totalSillasLibres} Sillas
          </div>
          <div style={{ fontSize: '0.75rem', color: '#2563EB' }}>Disponibles para venta web</div>
        </div>
      </div>

      {/* Barra de Filtros */}
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
        <div className="topbar-search-box" style={{ width: '100%', maxWidth: 360 }}>
          <Search size={16} color="#A0A5B1" />
          <input
            type="text"
            className="topbar-search-input"
            placeholder="Buscar por código (ej: FL-102) o ruta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Origen Selector */}
          <div className="route-filter-wrapper">
            <Plane size={14} color="#6366F1" />
            <select
              className="route-filter-select"
              value={originFilter}
              onChange={(e) => setOriginFilter(e.target.value)}
            >
              <option value="ALL">Todos los Orígenes</option>
              {origenes.map((orig) => (
                <option key={orig} value={orig}>
                  Origen: {orig}
                </option>
              ))}
            </select>
          </div>

          {/* Estado Selector */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { key: 'ALL', label: 'Todos' },
              { key: 'activo', label: 'Activos' },
              { key: 'lleno', label: 'Críticos (Llenos)' },
              { key: 'cancelado', label: 'Cancelados' },
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

      {/* Grid de Tarjetas de Vuelos */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
          gap: '20px',
        }}
      >
        {filtered.map((vuelo) => {
          const isCritical = Number(vuelo.asientos_disponibles) === 0;
          const asientosOcupados = Math.max(0, CAPACIDAD_VUELO - Number(vuelo.asientos_disponibles));
          const factorOcupacion = Math.min(
            100,
            Math.round((asientosOcupados / CAPACIDAD_VUELO) * 100)
          );

          return (
            <div
              key={vuelo.id}
              className="white-panel-card"
              style={{
                padding: '24px',
                borderLeft: isCritical ? '4px solid #EF4444' : '4px solid #10B981',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#181A20' }}>
                      {vuelo.id}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: isCritical ? '#FEF2F2' : '#ECFDF5',
                        color: isCritical ? '#EF4444' : '#059669',
                      }}
                    >
                      {vuelo.estado.toUpperCase()}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      color: '#7A808C',
                      marginTop: '4px',
                    }}
                  >
                    <Clock size={13} />
                    <span>
                      Salida:{' '}
                      {new Date(vuelo.fecha).toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {isCritical && (
                  <div
                    title="Vuelo con 0 asientos disponibles"
                    style={{
                      background: '#FEF2F2',
                      color: '#EF4444',
                      padding: '6px',
                      borderRadius: '8px',
                      display: 'flex',
                    }}
                  >
                    <AlertTriangle size={18} />
                  </div>
                )}
              </div>

              {/* Ruta Destacada */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  background: '#F9FAFB',
                  borderRadius: '12px',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#181A20' }}>
                    {vuelo.origen}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#7A808C' }}>Origen</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <Plane size={18} color="#6366F1" />
                  <div style={{ width: 60, height: 2, background: '#E5E7EB', position: 'relative' }}></div>
                  <span style={{ fontSize: '0.68rem', color: '#7A808C' }}>Directo</span>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#181A20' }}>
                    {vuelo.destino}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#7A808C' }}>Destino</div>
                </div>
              </div>

              {/* Barra de Factor de Ocupación */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    marginBottom: '6px',
                  }}
                >
                  <span style={{ color: '#7A808C' }}>Factor de Ocupación:</span>
                  <strong style={{ color: isCritical ? '#EF4444' : '#10B981' }}>
                    {factorOcupacion}% ({asientosOcupados}/{CAPACIDAD_VUELO} pax)
                  </strong>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: 8,
                    background: '#E5E7EB',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${factorOcupacion}%`,
                      height: '100%',
                      background: isCritical
                        ? 'linear-gradient(90deg, #F87171, #EF4444)'
                        : 'linear-gradient(90deg, #34D399, #10B981)',
                      borderRadius: 4,
                    }}
                  />
                </div>
              </div>

              {/* Sillas Disponibles */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.82rem',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(0,0,0,0.04)',
                }}
              >
                <span style={{ color: '#7A808C' }}>Disponibilidad:</span>
                <span
                  style={{
                    fontWeight: 700,
                    color: isCritical ? '#EF4444' : '#2563EB',
                  }}
                >
                  {isCritical ? 'AGOTADO (0 sillas)' : `${vuelo.asientos_disponibles} sillas libres`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
