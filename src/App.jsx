import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { PowerliftingPage } from './pages/PowerliftingPage';
import { ShoppingPage } from './pages/ShoppingPage';
import { TodoPage } from './pages/TodoPage';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="powerlifting" element={<PowerliftingPage />} />
        <Route path="shop" element={<ShoppingPage />} />
        <Route path="todo" element={<TodoPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
