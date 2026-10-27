import React, { useState } from 'react';
import { CheckSquare, Check, Calendar, Plus, AlertCircle, Clock } from 'lucide-react';

const initialTasks = [
  {
    id: 1,
    title: 'Cierre de Check-in Vuelo FL-101 (BOG ➔ MDE)',
    category: 'Despacho',
    priority: 'Normal',
    isDone: true,
    time: '06:45',
    assignee: 'Cap. John Marpaung',
  },
  {
    id: 2,
    title: 'Validación de Sobredemanda y Asientos FL-102 (BOG ➔ CTG)',
    category: 'Vuelo Crítico',
    priority: 'Alta',
    isDone: false,
    time: '08:00',
    assignee: 'Ops Control Center',
  },
  {
    id: 3,
    title: 'Auditoría de Pagos Rechazados con Pasarela de Pagos',
    category: 'Finanzas',
    priority: 'Media',
    isDone: true,
    time: '09:30',
    assignee: 'Soporte Comercial',
  },
  {
    id: 4,
    title: 'Reasignación de Equipaje Extra FL-108 (BOG ➔ ADZ)',
    category: 'Ancillaries',
    priority: 'Alta',
    isDone: false,
    time: '17:15',
    assignee: 'Rampa & Bodega',
  },
  {
    id: 5,
    title: 'Confirmación de Tripulación de Vuelo FL-106 (CTG ➔ MDE)',
    category: 'Operaciones',
    priority: 'Normal',
    isDone: false,
    time: '14:20',
    assignee: 'Jefe de Cabina',
  },
];

export default function TasksView() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState('ALL');

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t))
    );
  };

  const filtered = tasks.filter((t) => {
    if (filter === 'PENDING') return !t.isDone;
    if (filter === 'DONE') return t.isDone;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="panel-header-row">
        <div>
          <h2 className="topbar-page-title" style={{ fontSize: '1.6rem' }}>
            Control de Tareas Operativas
          </h2>
          <p className="panel-subtitle-text" style={{ fontSize: '0.85rem' }}>
            Seguimiento de checklists de despacho, autorizaciones y alertas de vuelo
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'PENDING', 'DONE'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              style={{
                background: filter === st ? '#181A20' : '#F4F2EE',
                color: filter === st ? '#FFFFFF' : '#646A83',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {st === 'ALL' ? 'Todas' : st === 'PENDING' ? 'Pendientes' : 'Completadas'}
            </button>
          ))}
        </div>
      </div>

      <div className="white-panel-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map((t) => (
            <div
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 18px',
                background: t.isDone ? '#F9FAFB' : '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '12px',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                className={`task-checkbox-indicator ${
                  t.isDone ? 'checkbox-done' : 'checkbox-pending'
                }`}
                style={{ width: 24, height: 24, cursor: 'pointer' }}
                onClick={() => toggleTask(t.id)}
              >
                {t.isDone && <Check size={14} strokeWidth={3} />}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '0.94rem',
                    fontWeight: 600,
                    color: t.isDone ? '#9CA3AF' : '#181A20',
                    textDecoration: t.isDone ? 'line-through' : 'none',
                  }}
                >
                  {t.title}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.76rem',
                    color: '#7A808C',
                    marginTop: '4px',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {t.time} hrs
                  </span>
                  <span>•</span>
                  <span>Asignado: {t.assignee}</span>
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background:
                    t.priority === 'Alta'
                      ? '#FEF2F2'
                      : t.priority === 'Media'
                      ? '#FFFBEB'
                      : '#EFF6FF',
                  color:
                    t.priority === 'Alta'
                      ? '#DC2626'
                      : t.priority === 'Media'
                      ? '#D97706'
                      : '#2563EB',
                }}
              >
                {t.category} ({t.priority})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
