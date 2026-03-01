import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { appRoutes, routePaths } from './routes'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {appRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path="*" element={<Navigate to={routePaths.home} replace />} />
      </Route>
    </Routes>
  )
}
