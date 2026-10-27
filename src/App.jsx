import React, { useState, useMemo } from 'react';
import { vuelos, etapas, pasajeros, reservas } from '../mockData';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import KpiGrid from './components/KpiGrid';
import ConversionFunnelChart from './components/ConversionFunnelChart';
import CheckInDistributionChart from './components/CheckInDistributionChart';
import SalesSummaryChart from './components/SalesSummaryChart';
import RecentPassengers from './components/RecentPassengers';
import OperationalTasks from './components/OperationalTasks';
import ReservationsTable from './components/ReservationsTable';
import ChatWidget from './components/ChatWidget';

// Vistas dedicadas de la sección Operaciones
import ReservasView from './views/ReservasView';
import PasajerosView from './views/PasajerosView';
import VuelosView from './views/VuelosView';
import AncillariesView from './views/AncillariesView';
import TasksView from './views/TasksView';
import CalendarView from './views/CalendarView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRoute, setSelectedRoute] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Generar lista de rutas únicas a partir de los vuelos
  const rutasDisponibles = useMemo(() => {
    return vuelos.map((v) => ({
      key: v.id,
      origen: v.origen,
      destino: v.destino,
      vueloId: v.id,
    }));
  }, []);

  // Filtrado reactivo de Vuelos según la ruta seleccionada
  const vuelosFiltrados = useMemo(() => {
    if (selectedRoute === 'ALL') return vuelos;
    return vuelos.filter((v) => v.id === selectedRoute);
  }, [selectedRoute]);

  // Filtrado reactivo de Reservas según la ruta seleccionada
  const reservasFiltradas = useMemo(() => {
    if (selectedRoute === 'ALL') return reservas;
    return reservas.filter((r) => r.vuelo_id === selectedRoute);
  }, [selectedRoute]);

  return (
    <div className="app-container">
      {/* 1. Sidebar Oscuro con Navegación Interactiva */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* 2. Área Principal de Contenido Dinámico */}
      <main className="main-content">
        {/* Renderizado condicional según la pestaña activa */}
        {activeTab === 'dashboard' && (
          <>
            {/* Topbar con Título, Buscador, Filtro Interactivo de Rutas y Botones */}
            <Topbar
              selectedRoute={selectedRoute}
              onSelectRoute={setSelectedRoute}
              rutasDisponibles={rutasDisponibles}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              currentDateText="25 Octubre 2026"
            />

            {/* Fila Superior de Tarjetas KPI Dinámicas */}
            <KpiGrid reservas={reservasFiltradas} vuelos={vuelosFiltrados} />

            {/* Layout Dividido: Columna Izquierda + Columna Derecha */}
            <div className="dashboard-content-split">
              <div className="dashboard-left-column">
                {/* Gráfico Principal: Embudo de Conversión de Reservas */}
                <ConversionFunnelChart etapas={etapas} reservas={reservasFiltradas} />

                {/* Fila Inferior Dual: Distribución de Check-in + Ventas Diarias */}
                <div className="dual-charts-row">
                  <CheckInDistributionChart reservas={reservasFiltradas} />
                  <SalesSummaryChart reservas={reservasFiltradas} />
                </div>

                {/* Tabla Detallada Operativa de Reservas y Pasajeros */}
                <ReservationsTable
                  reservas={reservasFiltradas}
                  vuelos={vuelos}
                  pasajeros={pasajeros}
                  etapas={etapas}
                  searchQuery={searchQuery}
                />
              </div>

              {/* Columna Lateral Derecha */}
              <div className="dashboard-right-column">
                <RecentPassengers
                  pasajeros={pasajeros}
                  onSelectPassenger={() => setActiveTab('pasajeros')}
                />
                <OperationalTasks />
              </div>
            </div>
          </>
        )}

        {/* 2. Vista de Operaciones: Reservas & Flujos */}
        {activeTab === 'reservas' && (
          <ReservasView
            reservas={reservas}
            vuelos={vuelos}
            pasajeros={pasajeros}
            etapas={etapas}
            selectedRoute={selectedRoute}
          />
        )}

        {/* 3. Vista de Operaciones: Pasajeros */}
        {activeTab === 'pasajeros' && (
          <PasajerosView
            pasajeros={pasajeros}
            reservas={reservas}
            vuelos={vuelos}
          />
        )}

        {/* 4. Vista de Operaciones: Vuelos & Rutas */}
        {activeTab === 'vuelos' && (
          <VuelosView
            vuelos={vuelos}
            reservas={reservas}
            onSelectFlight={(vueloId) => {
              setSelectedRoute(vueloId);
              setActiveTab('dashboard');
            }}
          />
        )}

        {/* 5. Vista de Operaciones: Ancillaries (Equipaje) */}
        {activeTab === 'ancillaries' && (
          <AncillariesView
            reservas={reservas}
            vuelos={vuelos}
            pasajeros={pasajeros}
          />
        )}

        {/* 6. Vista de Tareas Operativas */}
        {activeTab === 'tasks' && <TasksView />}

        {/* 7. Vista de Calendario / Itinerario */}
        {activeTab === 'calendar' && <CalendarView vuelos={vuelos} />}
      </main>

      {/* 3. Ventana Flotante de Chat con Agente IA de N8N */}
      <ChatWidget reservas={reservasFiltradas} vuelos={vuelosFiltrados} />
    </div>
  );
}
