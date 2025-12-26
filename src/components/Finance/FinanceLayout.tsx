import { Outlet } from 'react-router-dom';

export function FinanceLayout() {
  return (
    <div className="p-8">
      <Outlet />
    </div>
  );
}
