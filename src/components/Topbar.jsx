import React from 'react';
import {
  MoreHorizontal,
  Calendar,
  Search,
  Filter,
  Download,
  Bell,
  HelpCircle,
  Plus,
} from 'lucide-react';

export default function Topbar({
  selectedRoute,
  onSelectRoute,
  rutasDisponibles,
  searchQuery,
  onSearchChange,
  currentDateText = '25 Octubre 2026',
}) {
  return (
    <header className="topbar-container">
      {/* Lado Izquierdo: Título y Fecha de última actualización */}
      <div className="topbar-left">
        <div className="topbar-title-row">
          <h1 className="topbar-page-title">Dashboard</h1>
          <button className="topbar-more-btn" title="Opciones">
            <MoreHorizontal size={20} />
          </button>
        </div>
        <div className="topbar-updated-tag">
          <Calendar size={14} />
          <span>
            Última actualización: <span className="date-highlight">{currentDateText}</span>
          </span>
        </div>
      </div>

      {/* Lado Derecho: Acciones, Filtro y Búsqueda */}
      <div className="topbar-actions-row">
        {/* Barra de Búsqueda */}
        <div className="topbar-search-box">
          <Search size={16} color="#A0A5B1" />
          <input
            type="text"
            className="topbar-search-input"
            placeholder="Buscar por pasajero, vuelo o ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filtro Interactivo por Ruta de Vuelo */}
        <div className="route-filter-wrapper" title="Filtrar por ruta de vuelo">
          <Filter size={15} color="#2563EB" />
          <select
            className="route-filter-select"
            value={selectedRoute}
            onChange={(e) => onSelectRoute(e.target.value)}
          >
            <option value="ALL">Todas las rutas</option>
            {rutasDisponibles.map((r) => (
              <option key={r.key} value={r.key}>
                {r.origen} ➔ {r.destino} ({r.vueloId})
              </option>
            ))}
          </select>
        </div>

        {/* Botón de Exportación (Estilo verde de la imagen de referencia) */}
        <button
          className="btn-export-green"
          onClick={() => {
            alert('Generando exportación de reporte operativo en formato CSV / Excel...');
          }}
          title="Exportar métricas operativas"
        >
          <Download size={16} />
          <span>Exportar</span>
        </button>

        {/* Iconos de Ayuda, Notificación y Nuevo */}
        <button className="icon-action-btn" title="Notificaciones">
          <Bell size={18} />
        </button>

        <button className="icon-action-btn" title="Centro de Ayuda">
          <HelpCircle size={18} />
        </button>

        <button className="btn-plus-green" title="Nueva Reserva / Vuelo">
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
}
