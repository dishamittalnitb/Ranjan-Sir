import { Link, useLocation } from 'react-router-dom'
import { cx } from '../lib/cx'
import { Icon } from './Icon'
import { Monogram, Avatar } from './Monogram'
import { navLinks, student } from '../data/mockData'

interface AppSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function AppSidebar({ isCollapsed, onToggleCollapse }: AppSidebarProps) {
  const location = useLocation()

  return (
    <aside
      className={cx(
        'h-screen border-r border-outline-variant/60 bg-surface-container-lowest flex flex-col justify-between p-3 select-none shrink-0 transition-all duration-300 z-40',
        isCollapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1 py-1.5 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <Monogram className="h-8 w-8" />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-slate-900 text-sm tracking-tight leading-tight">Ranjan Sir</span>
                <span className="text-[10px] text-slate-400 font-medium">Mentorship &amp; Planning</span>
              </div>
            )}
          </Link>
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon name={isCollapsed ? 'menu_open' : 'dock_to_right'} className="text-[20px]" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-190px)] custom-scroll pr-1">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.label}
                className={cx(
                  'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all',
                  isActive ? 'bg-slate-900 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )}
              >
                <Icon name={item.icon} className={cx('text-[18px] shrink-0', isActive ? 'text-emerald-400' : 'text-slate-500')} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="pt-2 border-t border-slate-200">
        <Link
          to="/profile"
          className={cx(
            'flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition group',
            location.pathname === '/profile' && 'bg-slate-100 ring-1 ring-slate-300',
          )}
        >
          <Avatar label="AS" className="w-8 h-8" />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 overflow-hidden text-left">
              <span className="text-xs font-semibold text-slate-900 truncate">{student.fullName}</span>
              <span className="text-[10px] text-slate-500 truncate">Class 10 CBSE • Active</span>
            </div>
          )}
        </Link>
      </div>
    </aside>
  )
}
