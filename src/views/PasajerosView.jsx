import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  Briefcase,
  Plane,
  Award,
  ChevronRight,
  TrendingUp,
  CreditCard,
} from 'lucide-react';
import { formatCurrency } from '../components/KpiGrid';

export default function PasajerosView({ pasajeros, reservas, vuelos }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [selectedPasajero, setSelectedPasajero] = useState(null);

  // Mapear reservas por pasajero
  const reservasPorPasajero = useMemo(() => {
    const map = new Map();
    pasajeros.forEach((p) => {
      map.set(
        p.id,
        reservas.filter((r) => r.pasajero_id === p.id)
      );
    });
    return map;
  }, [pasajeros, reservas]);

  // Filtrado de pasajeros
  const filtered = useMemo(() => {
    return pasajeros.filter((p) => {
      if (filterType !== 'ALL' && p.tipo_viajero !== filterType) return false;
      if (search.trim() !== '') {
        const q = search.toLowerCase();
        const matchName = p.full_name.toLowerCase().includes(q);
        const matchEmail = p.email.toLowerCase().includes(q);
        const matchPhone = p.phone.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone) return false;
      }
      return true;
    });
  }, [pasajeros, filterType, search]);

  // KPIs de Pasajeros
  const totalPasajeros = pasajeros.length;
  const corporativosCount = pasajeros.filter((p) => p.tipo_viajero === 'corporativo').length;
  const frecuentesCount = pasajeros.filter((p) => p.tipo_viajero === 'frecuente').length;
  const ocasionalesCount = pasajeros.filter((p) => p.tipo_viajero === 'ocasional').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Encabezado */}
      <div className="panel-header-row">
        <div>
          <h2 className="topbar-page-title" style={{ fontSize: '1.6rem' }}>
            Directorio de Pasajeros & Clientes
          </h2>
          <p className="panel-subtitle-text" style={{ fontSize: '0.85rem' }}>
            Segmentación de viajeros frecuentes, corporativos y comportamiento de compra
          </p>
        </div>
      </div>

      {/* Mini KPIs de Segmentación */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
        }}
      >
        <div className="white-panel-card" style={{ padding: '18px 20px' }}>
          <div className="kpi-title-label">Total Clientes Activos</div>
          <div className="kpi-main-number" style={{ fontSize: '1.8rem', marginTop: '6px' }}>
            {totalPasajeros}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#7A808C' }}>100% perfiles verificados</div>
        </div>

        <div className="white-panel-card" style={{ padding: '18px 20px' }}>
          <div className="kpi-title-label">Corporativos</div>
          <div
            className="kpi-main-number"
            style={{ fontSize: '1.8rem', marginTop: '6px', color: '#2563EB' }}
          >
            {corporativosCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600 }}>
            {Math.round((corporativosCount / totalPasajeros) * 100)}% de la base comercial
          </div>
        </div>

        <div className="white-panel-card" style={{ padding: '18px 20px' }}>
          <div className="kpi-title-label">Viajeros Frecuentes</div>
          <div
            className="kpi-main-number"
            style={{ fontSize: '1.8rem', marginTop: '6px', color: '#10B981' }}
          >
            {frecuentesCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
            {Math.round((frecuentesCount / totalPasajeros) * 100)}% clientes leales
          </div>
        </div>

        <div className="white-panel-card" style={{ padding: '18px 20px' }}>
          <div className="kpi-title-label">Ocasionales / Turismo</div>
          <div
            className="kpi-main-number"
            style={{ fontSize: '1.8rem', marginTop: '6px', color: '#7A808C' }}
          >
            {ocasionalesCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#7A808C' }}>
            {Math.round((ocasionalesCount / totalPasajeros) * 100)}% potencial de fidelización
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
        <div className="topbar-search-box" style={{ width: '100%', maxWidth: 360 }}>
          <Search size={16} color="#A0A5B1" />
          <input
            type="text"
            className="topbar-search-input"
            placeholder="Buscar por nombre, correo o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { key: 'ALL', label: 'Todos' },
            { key: 'corporativo', label: 'Corporativos' },
            { key: 'frecuente', label: 'Frecuentes' },
            { key: 'ocasional', label: 'Ocasionales' },
          ].map((tb) => (
            <button
              key={tb.key}
              onClick={() => setFilterType(tb.key)}
              style={{
                background: filterType === tb.key ? '#181A20' : '#F4F2EE',
                color: filterType === tb.key ? '#FFFFFF' : '#646A83',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tb.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Tarjetas de Pasajeros */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {filtered.map((pas) => {
          const userReservas = reservasPorPasajero.get(pas.id) || [];
          const totalSpent = userReservas
            .filter((r) => r.estado_pago === 'aprobado')
            .reduce((sum, r) => sum + Number(r.monto) + (r.equipaje_adicional_pagado ? Number(r.monto_equipaje) : 0), 0);

          const pillClass =
            pas.tipo_viajero === 'corporativo'
              ? 'pill-corporativo'
              : pas.tipo_viajero === 'frecuente'
              ? 'pill-frecuente'
              : 'pill-ocasional';

          return (
            <div
              key={pas.id}
              className="white-panel-card"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onClick={() => setSelectedPasajero(pas)}
              title="Click para ver detalle e historial"
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <img
                  src={pas.avatar}
                  alt={pas.full_name}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid rgba(0,0,0,0.06)',
                  }}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      pas.full_name
                    )}&background=6366F1&color=fff`;
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4
                      style={{
                        fontSize: '0.98rem',
                        fontWeight: 700,
                        color: '#181A20',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {pas.full_name}
                    </h4>
                    <span className={`passenger-type-pill ${pillClass}`}>{pas.tipo_viajero}</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.78rem',
                      color: '#7A808C',
                      marginTop: '4px',
                    }}
                  >
                    <Mail size={13} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{pas.email}</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.78rem',
                      color: '#7A808C',
                      marginTop: '2px',
                    }}
                  >
                    <Phone size={13} />
                    <span>{pas.phone}</span>
                  </div>
                </div>
              </div>

              {/* Estadísticas de Compras del Pasajero */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  padding: '12px',
                  background: '#F9FAFB',
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.04)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#7A808C', fontWeight: 600 }}>RESERVAS</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#181A20', marginTop: '2px' }}>
                    {userReservas.length} viajes
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#7A808C', fontWeight: 600 }}>TOTAL GASTADO</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#10B981', marginTop: '2px' }}>
                    {formatCurrency(totalSpent)}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(0,0,0,0.04)',
                  fontSize: '0.78rem',
                  color: '#6366F1',
                  fontWeight: 600,
                }}
              >
                <span>Ver historial de vuelos</span>
                <ChevronRight size={15} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Historial de Viajes del Pasajero */}
      {selectedPasajero && (
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
          onClick={() => setSelectedPasajero(null)}
        >
          <div
            className="white-panel-card"
            style={{ maxWidth: 580, width: '100%', padding: '28px', maxHeight: '85vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={selectedPasajero.avatar}
                  alt=""
                  style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    {selectedPasajero.full_name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#7A808C' }}>
                    {selectedPasajero.email} • {selectedPasajero.phone}
                  </div>
                </div>
              </div>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: '#7A808C',
                }}
                onClick={() => setSelectedPasajero(null)}
              >
                ✕
              </button>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>
              Historial de Reservas ({reservasPorPasajero.get(selectedPasajero.id)?.length || 0})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(reservasPorPasajero.get(selectedPasajero.id) || []).map((res) => {
                const vue = vuelos.find((v) => v.id === res.vuelo_id);
                return (
                  <div
                    key={res.id}
                    style={{
                      padding: '12px 14px',
                      background: '#F9FAFB',
                      borderRadius: '10px',
                      border: '1px solid rgba(0,0,0,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#181A20' }}>
                        {res.id} • {vue?.id} ({vue?.origen} ➔ {vue?.destino})
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#7A808C', marginTop: '2px' }}>
                        Fecha: {new Date(res.created_at).toLocaleDateString('es-CO')} • Monto:{' '}
                        {formatCurrency(Number(res.monto))} COP
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`status-chip ${res.estado_pago}`}>{res.estado_pago}</span>
                      <div style={{ fontSize: '0.72rem', color: '#6366F1', marginTop: '4px' }}>
                        {res.check_in_confirmado ? 'Check-in OK' : 'Check-in pendiente'}
                      </div>
                    </div>
                  </div>
                );
              })}
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
              onClick={() => setSelectedPasajero(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
