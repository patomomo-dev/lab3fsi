import React, { useState, useMemo } from 'react';
import {
  Luggage,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  Plane,
  Download,
} from 'lucide-react';
import { formatCurrency } from '../components/KpiGrid';

export default function AncillariesView({ reservas, vuelos, pasajeros }) {
  const [search, setSearch] = useState('');
  const [filterRoute, setFilterRoute] = useState('ALL');

  const vuelosMap = useMemo(() => new Map(vuelos.map((v) => [v.id, v])), [vuelos]);
  const pasajerosMap = useMemo(() => new Map(pasajeros.map((p) => [p.id, p])), [pasajeros]);

  // Reservas con equipaje adicional
  const reservasConEquipaje = useMemo(() => {
    return reservas.filter((r) => r.equipaje_adicional_pagado === true);
  }, [reservas]);

  // Filtrado reactivo
  const filtered = useMemo(() => {
    return reservasConEquipaje.filter((res) => {
      const vue = vuelosMap.get(res.vuelo_id);
      if (filterRoute !== 'ALL' && vue?.id !== filterRoute) return false;

      if (search.trim() !== '') {
        const q = search.toLowerCase();
        const pas = pasajerosMap.get(res.pasajero_id);
        const matchId = res.id.toLowerCase().includes(q);
        const matchName = pas?.full_name?.toLowerCase().includes(q);
        const matchFlight = vue?.id?.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchFlight) return false;
      }
      return true;
    });
  }, [reservasConEquipaje, filterRoute, search, vuelosMap, pasajerosMap]);

  // Cálculos de KPIs de Ancillaries
  const totalIngresosEquipaje = useMemo(() => {
    return reservasConEquipaje.reduce((sum, r) => sum + Number(r.monto_equipaje), 0);
  }, [reservasConEquipaje]);

  const totalMaletas = reservasConEquipaje.length;
  const tasaPenetracion = Math.round((totalMaletas / (reservas.length || 1)) * 100);
  const ticketPromedio = totalMaletas > 0 ? Math.round(totalIngresosEquipaje / totalMaletas) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Encabezado */}
      <div className="panel-header-row">
        <div>
          <h2 className="topbar-page-title" style={{ fontSize: '1.6rem' }}>
            Operaciones de Ancillaries (Equipaje Adicional)
          </h2>
          <p className="panel-subtitle-text" style={{ fontSize: '0.85rem' }}>
            Monitoreo de ingresos suplementarios, cobro por maleta extra y despacho en bodega
          </p>
        </div>

        <button
          className="btn-export-green"
          onClick={() => alert('Exportando manifiesto de equipaje en CSV...')}
        >
          <Download size={16} />
          <span>Descargar Manifiesto</span>
        </button>
      </div>

      {/* Mini KPIs de Ancillaries */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
        }}
      >
        <div className="white-panel-card" style={{ padding: '18px 20px' }}>
          <div className="kpi-title-label">Ingresos Totales Ancillaries</div>
          <div
            className="kpi-main-number"
            style={{ fontSize: '1.8rem', marginTop: '6px', color: '#2563EB' }}
          >
            {formatCurrency(totalIngresosEquipaje)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600 }}>
            Facturado exclusivamente por equipaje extra
          </div>
        </div>

        <div className="white-panel-card" style={{ padding: '18px 20px' }}>
          <div className="kpi-title-label">Maletas Registradas</div>
          <div
            className="kpi-main-number"
            style={{ fontSize: '1.8rem', marginTop: '6px', color: '#10B981' }}
          >
            {totalMaletas} piezas
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
            Etiquetadas con código de barras
          </div>
        </div>

        <div className="white-panel-card" style={{ padding: '18px 20px' }}>
          <div className="kpi-title-label">Tasa de Adquisición (Attach Rate)</div>
          <div
            className="kpi-main-number"
            style={{ fontSize: '1.8rem', marginTop: '6px', color: '#8B5CF6' }}
          >
            {tasaPenetracion}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#7C3AED', fontWeight: 600 }}>
            De cada 100 pasajeros, {tasaPenetracion} agregan maleta
          </div>
        </div>

        <div className="white-panel-card" style={{ padding: '18px 20px' }}>
          <div className="kpi-title-label">Tarifa Promedio por Maleta</div>
          <div
            className="kpi-main-number"
            style={{ fontSize: '1.8rem', marginTop: '6px', color: '#181A20' }}
          >
            {formatCurrency(ticketPromedio)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#7A808C' }}>COP por unidad adicional</div>
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
            placeholder="Buscar por pasajero, ID o vuelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="route-filter-wrapper">
          <Plane size={14} color="#2563EB" />
          <select
            className="route-filter-select"
            value={filterRoute}
            onChange={(e) => setFilterRoute(e.target.value)}
          >
            <option value="ALL">Todos los Vuelos con Equipaje</option>
            {vuelos.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id} ({v.origen} ➔ {v.destino})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla Operativa de Equipaje Extra */}
      <div className="white-panel-card" style={{ padding: '20px' }}>
        <div className="table-responsive-container">
          <table className="data-table-modern">
            <thead>
              <tr>
                <th>Etiqueta / ID</th>
                <th>Pasajero Responsable</th>
                <th>Vuelo Asignado</th>
                <th>Ruta</th>
                <th>Monto Ancillary</th>
                <th>Estado del Pago</th>
                <th>Pase de Abordar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#7A808C' }}>
                    No se encontraron registros de equipaje con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filtered.map((res) => {
                  const pas = pasajerosMap.get(res.pasajero_id);
                  const vue = vuelosMap.get(res.vuelo_id);

                  return (
                    <tr key={res.id}>
                      <td style={{ fontWeight: 700, color: '#8B5CF6' }}>
                        BAG-{res.id.replace('RES-', '')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img
                            src={pas?.avatar}
                            alt=""
                            style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                pas?.full_name || 'User'
                              )}&background=6366F1&color=fff`;
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>
                              {pas?.full_name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#7A808C' }}>
                              {pas?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>{vue?.id}</td>
                      <td>
                        <span style={{ fontWeight: 600 }}>
                          {vue?.origen} ➔ {vue?.destino}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: '#059669' }}>
                        +{formatCurrency(Number(res.monto_equipaje))} COP
                      </td>
                      <td>
                        <span className={`status-chip ${res.estado_pago}`}>
                          {res.estado_pago}
                        </span>
                      </td>
                      <td>
                        {res.check_in_confirmado ? (
                          <span className="checkin-chip-active">
                            <CheckCircle2 size={12} />
                            <span>Asignado</span>
                          </span>
                        ) : (
                          <span className="checkin-chip-inactive">
                            <span>Pendiente Pesaje</span>
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
    </div>
  );
}
