import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Users,
  Briefcase,
  Plane,
  Luggage,
  HelpCircle,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
} from 'lucide-react';

export default function Sidebar({ activeTab = 'dashboard', onSelectTab }) {
  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div
          className="brand-wrapper"
          style={{ cursor: 'pointer' }}
          onClick={() => onSelectTab && onSelectTab('dashboard')}
        >
          <div className="brand-icon-box">
            <Plane size={22} strokeWidth={2.2} />
          </div>
          <div>
            <span className="brand-text">Nexus</span>
            <div
              style={{
                fontSize: '0.68rem',
                color: '#646A83',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              AERO OPS
            </div>
          </div>
        </div>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: '#646A83',
            cursor: 'pointer',
            display: 'flex',
          }}
          title="Menú Nexus"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <button
          type="button"
          onClick={() => onSelectTab('dashboard')}
          className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('tasks')}
          className={`nav-link ${activeTab === 'tasks' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
        >
          <CheckSquare size={18} />
          <span>Task</span>
          <span className="nav-badge">1</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('calendar')}
          className={`nav-link ${activeTab === 'calendar' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
        >
          <Calendar size={18} />
          <span>Calendar</span>
        </button>

        {/* Section: Operaciones */}
        <div className="sidebar-section-title">
          <span>OPERACIONES</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <Search size={13} style={{ cursor: 'pointer' }} />
            <Plus size={13} style={{ cursor: 'pointer' }} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectTab('reservas')}
          className={`nav-link ${activeTab === 'reservas' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
        >
          <Briefcase size={18} />
          <span>Reservas & Flujos</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('pasajeros')}
          className={`nav-link ${activeTab === 'pasajeros' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
        >
          <Users size={18} />
          <span>Pasajeros</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('vuelos')}
          className={`nav-link ${activeTab === 'vuelos' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
        >
          <Plane size={18} />
          <span>Vuelos & Rutas</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('ancillaries')}
          className={`nav-link ${activeTab === 'ancillaries' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
        >
          <Luggage size={18} />
          <span>Ancillaries (Equipaje)</span>
        </button>

        {/* Section: Soporte & Config */}
        <div className="sidebar-section-title">
          <span>SISTEMA</span>
        </div>

        <button
          type="button"
          onClick={() => alert('Centro de soporte de operaciones aeronáuticas disponible 24/7.')}
          className="nav-link"
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
        >
          <HelpCircle size={18} />
          <span>Help and Support</span>
        </button>

        <button
          type="button"
          onClick={() => alert('Panel de configuración del sistema de aerolínea.')}
          className="nav-link"
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </nav>

      {/* User Profile Footer */}
      <div className="sidebar-user-footer">
        <div className="user-profile-card">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
            alt="Cap. John Marpaung"
            className="user-avatar-img"
          />
          <div className="user-info-text">
            <div className="user-name-title">John Marpaung</div>
            <div className="user-email-subtitle">john@nexus-aero.com</div>
          </div>
          <ChevronRight size={16} color="#646A83" />
        </div>
      </div>
    </aside>
  );
}
