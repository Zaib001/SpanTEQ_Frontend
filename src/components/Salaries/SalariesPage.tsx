import { useState } from 'react';
import { DollarSign, TrendingUp, Edit, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const salariesData = [
  {
    id: 1,
    name: 'Michael Chen',
    role: 'Senior Consultant',
    payModel: 'Fixed',
    baseSalary: '$120,000',
    bonus: '$15,000',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'Lead Recruiter',
    payModel: '% Billing',
    baseSalary: '18%',
    bonus: '2% bonus',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Emily Davis',
    role: 'Admin',
    payModel: 'Fixed',
    baseSalary: '$95,000',
    bonus: '$10,000',
    status: 'Active'
  },
  {
    id: 4,
    name: 'James Wilson',
    role: 'Consultant',
    payModel: 'Fixed',
    baseSalary: '$105,000',
    bonus: '$12,000',
    status: 'Active'
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    role: 'Recruiter',
    payModel: '% Billing',
    baseSalary: '15%',
    bonus: '3% bonus',
    status: 'Active'
  },
  {
    id: 6,
    name: 'Robert Martinez',
    role: 'Consultant',
    payModel: 'Fixed',
    baseSalary: '$98,000',
    bonus: '$8,000',
    status: 'Inactive'
  },
];

const projectionData = [
  { month: 'Jan', payout: 425000 },
  { month: 'Feb', payout: 445000 },
  { month: 'Mar', payout: 460000 },
  { month: 'Apr', payout: 455000 },
  { month: 'May', payout: 480000 },
  { month: 'Jun', payout: 495000 },
];

export function SalariesPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [filterModel, setFilterModel] = useState<string>('all');

  const filteredSalaries = filterModel === 'all' 
    ? salariesData 
    : salariesData.filter(s => s.payModel === filterModel);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Salary Management</h1>
        <p className="text-gray-600">Manage compensation, bonuses, and payout projections</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl mt-1">{salariesData.length}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fixed Salary</p>
              <p className="text-2xl mt-1">{salariesData.filter(s => s.payModel === 'Fixed').length}</p>
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">Fixed</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">% Billing</p>
              <p className="text-2xl mt-1">{salariesData.filter(s => s.payModel === '% Billing').length}</p>
            </div>
            <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm">%</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Avg</p>
              <p className="text-2xl mt-1">$467K</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Payout Projections Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="mb-6">
          <h2 className="text-xl mb-1">Future Payout Projections</h2>
          <p className="text-sm text-gray-600">Expected monthly payouts for the next 6 months</p>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${(value as number).toLocaleString()}`} />
            <Line 
              type="monotone" 
              dataKey="payout" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilterModel('all')}
          className={`px-4 py-2 rounded-lg transition-all ${
            filterModel === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border border-gray-200 hover:bg-gray-50'
          }`}
        >
          All Models
        </button>
        <button
          onClick={() => setFilterModel('Fixed')}
          className={`px-4 py-2 rounded-lg transition-all ${
            filterModel === 'Fixed' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Fixed Salary
        </button>
        <button
          onClick={() => setFilterModel('% Billing')}
          className={`px-4 py-2 rounded-lg transition-all ${
            filterModel === '% Billing' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border border-gray-200 hover:bg-gray-50'
          }`}
        >
          % Billing
        </button>
      </div>

      {/* Salaries Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredSalaries.map((employee) => (
          <div key={employee.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-lg">{employee.name}</div>
                  <div className="text-sm text-gray-600">{employee.role}</div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${
                employee.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {employee.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Pay Model</p>
                <span className={`px-3 py-1 rounded-lg text-sm ${
                  employee.payModel === 'Fixed' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {employee.payModel}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Base</p>
                <p className="text-lg">{employee.baseSalary}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Bonus</p>
                <p className="text-sm text-gray-700">{employee.bonus}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
