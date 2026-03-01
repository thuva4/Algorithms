import { Link, NavLink, Outlet } from 'react-router-dom'
import { primaryNavigation, routePaths } from '../routes'

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `transition-colors ${
    isActive ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-400'
  }`

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to={routePaths.home} className="text-xl font-bold tracking-tight">
            Algorithms
          </Link>
          <div className="flex gap-6 text-sm font-medium">
            {primaryNavigation.map(({ label, to, end }) => (
              <NavLink key={to} to={to} end={end} className={navLinkClassName}>
                {label}
              </NavLink>
            ))}
            <a
              href="https://github.com/thuva4/Algorithms"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              GitHub
            </a>
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
