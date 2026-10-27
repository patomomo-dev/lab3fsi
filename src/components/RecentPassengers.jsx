import React from 'react';
import { MoreHorizontal, ChevronRight } from 'lucide-react';

export default function RecentPassengers({ pasajeros, onSelectPassenger }) {
  // Mostrar los primeros 6 pasajeros más recientes
  const displayPasajeros = pasajeros.slice(0, 6);

  return (
    <div className="white-panel-card">
      <div className="panel-header-row" style={{ marginBottom: '14px' }}>
        <div>
          <h3 className="panel-title-text">Pasajeros Recientes</h3>
          <p className="panel-subtitle-text">Últimos usuarios en interactuar</p>
        </div>
        <button className="topbar-more-btn" title="Opciones">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="recent-passengers-list">
        {displayPasajeros.map((p) => {
          const pillClass =
            p.tipo_viajero === 'corporativo'
              ? 'pill-corporativo'
              : p.tipo_viajero === 'frecuente'
              ? 'pill-frecuente'
              : 'pill-ocasional';

          return (
            <div
              key={p.id}
              className="passenger-item-row"
              onClick={() => onSelectPassenger && onSelectPassenger(p)}
              title={`Ver historial de ${p.full_name}`}
            >
              <img
                src={p.avatar}
                alt={p.full_name}
                className="passenger-avatar"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    p.full_name
                  )}&background=6366F1&color=fff`;
                }}
              />
              <div className="passenger-details">
                <div className="passenger-fullname">{p.full_name}</div>
                <div className="passenger-sub-meta">
                  <span>{p.email}</span>
                  <span>•</span>
                  <span className={`passenger-type-pill ${pillClass}`}>
                    {p.tipo_viajero}
                  </span>
                </div>
              </div>
              <ChevronRight size={16} color="#A0A5B1" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
