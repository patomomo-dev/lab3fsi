import React, { useState } from 'react';
import { MoreHorizontal, Check, Clock, Calendar } from 'lucide-react';

const initialTasks = [
  {
    id: 1,
    title: 'Cierre de Check-in Vuelo FL-101',
    route: 'BOG ➔ MDE',
    date: '25 Oct',
    category: 'Despacho',
    isDone: true,
    isCritical: false,
    avatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop',
    ],
  },
  {
    id: 2,
    title: 'Validación de Sobredemanda FL-102',
    route: 'BOG ➔ CTG',
    date: '25 Oct',
    category: 'Vuelo Crítico',
    isDone: false,
    isCritical: true,
    avatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop',
    ],
  },
  {
    id: 3,
    title: 'Revisión de Pagos Rechazados (3 pax)',
    route: 'Pasarela Pagos',
    date: '25 Oct',
    category: 'Finanzas',
    isDone: true,
    isCritical: false,
    avatars: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop',
    ],
  },
  {
    id: 4,
    title: 'Asignación de Asientos Ancillary FL-108',
    route: 'BOG ➔ ADZ',
    date: '25 Oct',
    category: 'Equipaje Extra',
    isDone: false,
    isCritical: true,
    avatars: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&h=60&fit=crop',
    ],
  },
];

export default function OperationalTasks() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t))
    );
  };

  return (
    <div className="white-panel-card">
      <div className="panel-header-row" style={{ marginBottom: '14px' }}>
        <div>
          <h3 className="panel-title-text">Operaciones & Tareas</h3>
          <p className="panel-subtitle-text">Control de despacho y alertas</p>
        </div>
        <button className="topbar-more-btn" title="Opciones">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="operational-tasks-list">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-item-card ${task.isCritical ? 'is-critical' : ''}`}
          >
            <div className="task-header-line">
              <div
                className={`task-checkbox-indicator ${
                  task.isDone ? 'checkbox-done' : 'checkbox-pending'
                }`}
                onClick={() => toggleTask(task.id)}
                style={{ cursor: 'pointer' }}
                title={task.isDone ? 'Marcar como pendiente' : 'Marcar como completada'}
              >
                {task.isDone && <Check size={12} strokeWidth={3} />}
              </div>
              <span
                className="task-title-text"
                style={{
                  textDecoration: task.isDone ? 'line-through' : 'none',
                  color: task.isDone ? '#9CA3AF' : '#181A20',
                }}
              >
                {task.title}
              </span>
            </div>

            <div className="task-footer-tags">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={12} />
                <span>{task.date}</span>
                <span
                  className="task-category-badge"
                  style={{
                    backgroundColor: task.isCritical
                      ? '#FEF2F2'
                      : task.isDone
                      ? '#ECFDF5'
                      : '#EFF6FF',
                    color: task.isCritical
                      ? '#DC2626'
                      : task.isDone
                      ? '#059669'
                      : '#2563EB',
                  }}
                >
                  {task.category}
                </span>
              </div>

              {/* Avatares agrupados como en la imagen */}
              <div style={{ display: 'flex', marginLeft: 'auto' }}>
                {task.avatars.map((av, idx) => (
                  <img
                    key={idx}
                    src={av}
                    alt="Crew"
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      marginLeft: idx > 0 ? -6 : 0,
                      border: '1.5px solid #FFFFFF',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
