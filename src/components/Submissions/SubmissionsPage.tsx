import { useState } from 'react';
import { Search, Filter, Download, Upload, ArrowLeft, FileText, Eye, Edit, Trash2 } from 'lucide-react';

const submissionsData = [
  {
    id: 1,
    candidate: 'John Doe',
    recruiter: 'Sarah Johnson',
    client: 'TechCorp Inc',
    vendor: 'StaffingSolutions',
    technology: 'React, Node.js',
    date: '2025-12-08',
    status: 'Submitted',
    notes: 'Strong technical background'
  },
  {
    id: 2,
    candidate: 'Jane Smith',
    recruiter: 'Michael Chen',
    client: 'FinanceHub',
    vendor: 'TalentBridge',
    technology: 'Python, Django',
    date: '2025-12-07',
    status: 'Interview Scheduled',
    notes: 'Client very interested'
  },
  {
    id: 3,
    candidate: 'Robert Johnson',
    recruiter: 'Sarah Johnson',
    client: 'HealthPlus',
    vendor: 'MediStaff',
    technology: 'Java, Spring',
    date: '2025-12-06',
    status: 'Accepted',
    notes: 'Start date confirmed'
  },
  {
    id: 4,
    candidate: 'Maria Garcia',
    recruiter: 'Jennifer Taylor',
    client: 'RetailPro',
    vendor: 'StaffingSolutions',
    technology: 'Angular, TypeScript',
    date: '2025-12-05',
    status: 'Rejected',
    notes: 'Experience mismatch'
  },
  {
    id: 5,
    candidate: 'David Lee',
    recruiter: 'Michael Chen',
    client: 'DataSync',
    vendor: 'TechRecruit',
    technology: 'AWS, DevOps',
    date: '2025-12-04',
    status: 'Submitted',
    notes: 'Awaiting client feedback'
  },
  {
    id: 6,
    candidate: 'Amanda White',
    recruiter: 'Sarah Johnson',
    client: 'CloudNet',
    vendor: 'TalentBridge',
    technology: 'Azure, .NET',
    date: '2025-12-03',
    status: 'Interview Scheduled',
    notes: 'Technical round next week'
  },
];

export function SubmissionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredSubmissions = submissionsData.filter(submission =>
    submission.candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.technology.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-100 text-blue-700';
      case 'Interview Scheduled': return 'bg-purple-100 text-purple-700';
      case 'Accepted': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Submissions Management</h1>
          <p className="text-gray-600">Track and manage all candidate submissions</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back to Recruiters
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Excel
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Submissions</p>
              <p className="text-2xl mt-1">{submissionsData.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Submitted</p>
              <p className="text-2xl mt-1">{submissionsData.filter(s => s.status === 'Submitted').length}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm">
              S
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Interviews</p>
              <p className="text-2xl mt-1">{submissionsData.filter(s => s.status === 'Interview Scheduled').length}</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-sm">
              I
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accepted</p>
              <p className="text-2xl mt-1">{submissionsData.filter(s => s.status === 'Accepted').length}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-sm">
              A
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by candidate, client, or technology..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Show Filters
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
            Clear Filters
          </button>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-5 h-5" />
              CSV
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-5 h-5" />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-4 text-left text-xs text-gray-600">Candidate</th>
                <th className="px-4 py-4 text-left text-xs text-gray-600">Recruiter</th>
                <th className="px-4 py-4 text-left text-xs text-gray-600">Client</th>
                <th className="px-4 py-4 text-left text-xs text-gray-600">Vendor</th>
                <th className="px-4 py-4 text-left text-xs text-gray-600">Technology</th>
                <th className="px-4 py-4 text-left text-xs text-gray-600">Date</th>
                <th className="px-4 py-4 text-left text-xs text-gray-600">Status</th>
                <th className="px-4 py-4 text-left text-xs text-gray-600">Notes</th>
                <th className="px-4 py-4 text-right text-xs text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs">
                        {submission.candidate.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm">{submission.candidate}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{submission.recruiter}</td>
                  <td className="px-4 py-4 text-sm">{submission.client}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{submission.vendor}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {submission.technology.split(', ').map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{submission.date}</td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(submission.status)}`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">{submission.notes}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing {filteredSubmissions.length} of {submissionsData.length} submissions</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">Previous</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">1</button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">2</button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
