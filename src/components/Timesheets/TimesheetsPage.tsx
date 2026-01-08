import { useState } from 'react';
import { Clock, Check, X, Eye, Calendar } from 'lucide-react';

const timesheetsData = [
  {
    id: 1,
    user: 'Michael Chen',
    role: 'Senior Consultant',
    period: 'Week of Dec 4, 2025',
    totalHours: 40,
    status: 'Pending',
    submitted: '2025-12-08',
    notes: 'Regular hours, no overtime'
  },
  {
    id: 2,
    user: 'Sarah Johnson',
    role: 'Lead Recruiter',
    period: 'Week of Dec 4, 2025',
    totalHours: 42,
    status: 'Approved',
    submitted: '2025-12-08',
    notes: '2 hours overtime on Thursday'
  },
  {
    id: 3,
    user: 'James Wilson',
    role: 'Consultant',
    period: 'Week of Dec 4, 2025',
    totalHours: 38,
    status: 'Pending',
    submitted: '2025-12-09',
    notes: 'Took 2 hours PTO on Friday'
  },
  {
    id: 4,
    user: 'Emily Davis',
    role: 'Admin',
    period: 'Week of Nov 27, 2025',
    totalHours: 40,
    status: 'Approved',
    submitted: '2025-12-01',
    notes: 'Regular week'
  },
  {
    id: 5,
    user: 'Lisa Anderson',
    role: 'Recruiter',
    period: 'Week of Dec 4, 2025',
    totalHours: 35,
    status: 'Rejected',
    submitted: '2025-12-08',
    notes: 'Hours mismatch with project logs'
  },
  {
    id: 6,
    user: 'David Brown',
    role: 'Consultant',
    period: 'Week of Dec 4, 2025',
    totalHours: 40,
    status: 'Pending',
    submitted: '2025-12-09',
    notes: 'Standard week, all billable'
  },
];

export function TimesheetsPage() {
  const [timesheets, setTimesheets] = useState(timesheetsData);
  const [selectedTimesheet, setSelectedTimesheet] = useState<number | null>(null);

  const handleApprove = (id: number) => {
    setTimesheets(timesheets.map(t => t.id === id ? { ...t, status: 'Approved' } : t));
  };

  const handleReject = (id: number) => {
    setTimesheets(timesheets.map(t => t.id === id ? { ...t, status: 'Rejected' } : t));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-orange-100 text-orange-700';
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const pendingCount = timesheets.filter(t => t.status === 'Pending').length;
  const approvedCount = timesheets.filter(t => t.status === 'Approved').length;
  const totalHours = timesheets.reduce((sum, t) => sum + t.totalHours, 0);

  return (
    <div className="p-8 space-y-6">
      {}
      <div>
        <h1 className="text-3xl mb-2">Timesheet Management</h1>
        <p className="text-gray-600">Review and approve consultant timesheets</p>
      </div>

      {}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Timesheets</p>
              <p className="text-2xl mt-1">{timesheets.length}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl mt-1">{pendingCount}</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl mt-1">{approvedCount}</p>
            </div>
            <Check className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Hours</p>
              <p className="text-2xl mt-1">{totalHours}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm">
              hrs
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs text-gray-600">Employee</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600">Period</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600">Total Hours</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600">Submitted</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600">Notes</th>
                <th className="px-6 py-4 text-right text-xs text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {timesheets.map((timesheet) => (
                <tr key={timesheet.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
                        {timesheet.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div>{timesheet.user}</div>
                        <div className="text-xs text-gray-500">{timesheet.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{timesheet.period}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {timesheet.totalHours} hrs
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{timesheet.submitted}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(timesheet.status)}`}>
                      {timesheet.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{timesheet.notes}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {timesheet.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(timesheet.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(timesheet.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {}
      {selectedTimesheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
            <h2 className="text-2xl mb-6">Timesheet Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Employee</p>
                  <p className="text-lg">Name Here</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Period</p>
                  <p className="text-lg">Week of Dec 4, 2025</p>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Approve
                </button>
                <button className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Reject
                </button>
                <button 
                  onClick={() => setSelectedTimesheet(null)}
                  className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
