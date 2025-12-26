import { useState } from 'react';
import { Upload, FileText, File, Image, Download, Trash2, Grid, List, Search, Filter } from 'lucide-react';

const documentsData = [
  {
    id: 1,
    name: 'Q4_Financial_Report.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploadedBy: 'Emily Davis',
    uploadedDate: '2025-12-08',
    category: 'Financial'
  },
  {
    id: 2,
    name: 'Employee_Handbook_2025.pdf',
    type: 'PDF',
    size: '5.1 MB',
    uploadedBy: 'Sarah Johnson',
    uploadedDate: '2025-12-05',
    category: 'HR'
  },
  {
    id: 3,
    name: 'Client_Contract_TechCorp.docx',
    type: 'DOCX',
    size: '156 KB',
    uploadedBy: 'Michael Chen',
    uploadedDate: '2025-12-03',
    category: 'Legal'
  },
  {
    id: 4,
    name: 'Team_Photo_2025.jpg',
    type: 'JPG',
    size: '3.2 MB',
    uploadedBy: 'Lisa Anderson',
    uploadedDate: '2025-12-01',
    category: 'Media'
  },
  {
    id: 5,
    name: 'Salary_Structure_Template.xlsx',
    type: 'XLSX',
    size: '89 KB',
    uploadedBy: 'Emily Davis',
    uploadedDate: '2025-11-28',
    category: 'HR'
  },
  {
    id: 6,
    name: 'Onboarding_Checklist.pdf',
    type: 'PDF',
    size: '245 KB',
    uploadedBy: 'Sarah Johnson',
    uploadedDate: '2025-11-25',
    category: 'HR'
  },
];

export function DocumentsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = documentsData.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="w-8 h-8 text-red-600" />;
      case 'DOCX': return <File className="w-8 h-8 text-blue-600" />;
      case 'XLSX': return <File className="w-8 h-8 text-green-600" />;
      case 'JPG': return <Image className="w-8 h-8 text-purple-600" />;
      default: return <File className="w-8 h-8 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Financial': return 'bg-green-100 text-green-700';
      case 'HR': return 'bg-blue-100 text-blue-700';
      case 'Legal': return 'bg-purple-100 text-purple-700';
      case 'Media': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Documents</h1>
          <p className="text-gray-600">Manage and organize all your files</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Files</p>
              <p className="text-2xl mt-1">{documentsData.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Size</p>
              <p className="text-2xl mt-1">11.3 MB</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-xs">
              MB
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl mt-1">4</p>
            </div>
            <Filter className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Uploaded Today</p>
              <p className="text-2xl mt-1">1</p>
            </div>
            <Upload className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-xl p-12">
        <div className="text-center">
          <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl mb-2">Drag and Drop Files Here</h3>
          <p className="text-gray-600 mb-4">or click to browse from your computer</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Choose Files
          </button>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filter
        </button>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Documents Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-4 gap-4">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{getFileIcon(doc.type)}</div>
                <h3 className="mb-2 text-sm truncate w-full" title={doc.name}>{doc.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs mb-3 ${getCategoryColor(doc.category)}`}>
                  {doc.category}
                </span>
                <p className="text-xs text-gray-500 mb-1">{doc.size}</p>
                <p className="text-xs text-gray-400 mb-4">{doc.uploadedDate}</p>
                <div className="flex gap-2 w-full">
                  <button className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs text-gray-600">Name</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600">Type</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600">Category</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600">Size</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600">Uploaded By</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600">Date</th>
                <th className="px-6 py-4 text-right text-xs text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.type)}
                      <span>{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doc.type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getCategoryColor(doc.category)}`}>
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doc.size}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doc.uploadedBy}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doc.uploadedDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
