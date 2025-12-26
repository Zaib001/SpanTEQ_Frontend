import { useState } from 'react';
import { FolderOpen, Trash2, Download, Upload, File, FileText, Image, Video, Music, Archive, Sparkles, Eye, Search, Filter } from 'lucide-react';

interface Document {
  id: string;
  fileName: string;
  uploadedBy: string;
  linkedUser: string;
  uploadDate: string;
  type: 'ID' | 'W2' | 'Offer' | 'Contract' | 'Resume' | 'Other';
  status: 'pending' | 'uploaded' | 'reviewed';
  size: string;
  fileType: 'pdf' | 'doc' | 'image' | 'other';
}

const mockDocuments: Document[] = [
  { id: '1', fileName: 'john_doe_resume.pdf', uploadedBy: 'Sarah Johnson', linkedUser: 'John Doe', uploadDate: '2024-03-20', type: 'Resume', status: 'reviewed', size: '245 KB', fileType: 'pdf' },
  { id: '2', fileName: 'emily_w2_2023.pdf', uploadedBy: 'Admin', linkedUser: 'Emily Davis', uploadDate: '2024-03-18', type: 'W2', status: 'uploaded', size: '128 KB', fileType: 'pdf' },
  { id: '3', fileName: 'james_id_proof.jpg', uploadedBy: 'Michael Chen', linkedUser: 'James Wilson', uploadDate: '2024-03-15', type: 'ID', status: 'pending', size: '892 KB', fileType: 'image' },
  { id: '4', fileName: 'sarah_offer_letter.pdf', uploadedBy: 'Admin', linkedUser: 'Sarah Johnson', uploadDate: '2024-03-12', type: 'Offer', status: 'reviewed', size: '156 KB', fileType: 'pdf' },
  { id: '5', fileName: 'contract_techcorp.doc', uploadedBy: 'Emily Davis', linkedUser: 'TechCorp', uploadDate: '2024-03-10', type: 'Contract', status: 'uploaded', size: '324 KB', fileType: 'doc' },
];

const typeColors = {
  'ID': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  'W2': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  'Offer': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  'Contract': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  'Resume': { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  'Other': { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' },
};

const statusColors = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  uploaded: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  reviewed: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
};

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case 'pdf':
    case 'doc':
      return FileText;
    case 'image':
      return Image;
    case 'video':
      return Video;
    case 'audio':
      return Music;
    case 'archive':
      return Archive;
    default:
      return File;
  }
};

export function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending').length,
    uploaded: documents.filter(d => d.status === 'uploaded').length,
    reviewed: documents.filter(d => d.status === 'reviewed').length,
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.linkedUser.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(d => d.id !== id));
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
        
        <div className="relative flex items-center justify-between animate-slide-in">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl shadow-glow-purple animate-pulse-glow">
                <FolderOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-5xl text-gradient-premium">Documents</h1>
                <p className="text-slate-400 mt-1 text-sm">Manage all uploaded documents and requests</p>
              </div>
            </div>
          </div>
          
          <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-2xl overflow-hidden shadow-premium hover:shadow-glow-purple transition-all duration-500 transform hover:scale-105">
            <div className="relative flex items-center gap-3 text-white">
              <Upload className="w-6 h-6" />
              <span className="font-medium">Upload Document</span>
            </div>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
        {[
          { label: 'Total Documents', value: stats.total, gradient: 'from-purple-500 to-pink-500', icon: FolderOpen },
          { label: 'Pending Review', value: stats.pending, gradient: 'from-yellow-500 to-orange-500', icon: File },
          { label: 'Uploaded', value: stats.uploaded, gradient: 'from-blue-500 to-cyan-500', icon: Upload },
          { label: 'Reviewed', value: stats.reviewed, gradient: 'from-green-500 to-emerald-500', icon: Sparkles },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group relative glass rounded-2xl p-6 hover-lift card-shine overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">{stat.label}</p>
                  <p className="text-4xl premium-text mb-1">{stat.value}</p>
                </div>
                <div className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="glass rounded-3xl p-6 space-y-4 animate-slide-in shadow-premium" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-all duration-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by file name or user..."
              className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-slate-100 placeholder-slate-500 transition-all duration-300 hover:bg-white/10"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-6 py-4 glass rounded-2xl text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all hover:bg-white/10 appearance-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="ID">ID</option>
              <option value="W2">W2</option>
              <option value="Offer">Offer</option>
              <option value="Contract">Contract</option>
              <option value="Resume">Resume</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-6 py-4 glass rounded-2xl text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all hover:bg-white/10 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="uploaded">Uploaded</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid/Table */}
      <div className="glass rounded-3xl overflow-hidden shadow-premium animate-slide-in" style={{ animationDelay: '300ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="glass-dark border-b border-white/10">
              <tr>
                <th className="px-8 py-5 text-left"><span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">File</span></th>
                <th className="px-8 py-5 text-left"><span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Uploaded By</span></th>
                <th className="px-8 py-5 text-left"><span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Linked User</span></th>
                <th className="px-8 py-5 text-left"><span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Type</span></th>
                <th className="px-8 py-5 text-left"><span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Upload Date</span></th>
                <th className="px-8 py-5 text-left"><span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Status</span></th>
                <th className="px-8 py-5 text-right"><span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDocuments.map((doc, index) => {
                const FileIcon = getFileIcon(doc.fileType);
                return (
                  <tr 
                    key={doc.id}
                    className="group hover:bg-gradient-to-r hover:from-purple-500/5 hover:via-pink-500/5 hover:to-purple-500/5 transition-all duration-300 animate-slide-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-lg flex items-center justify-center text-white shadow-glow-purple">
                          <FileIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-slate-200 font-medium">{doc.fileName}</p>
                          <p className="text-xs text-slate-500">{doc.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-slate-400">{doc.uploadedBy}</td>
                    <td className="px-8 py-5 whitespace-nowrap text-slate-300">{doc.linkedUser}</td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider badge-glow ${typeColors[doc.type].bg} ${typeColors[doc.type].text} border ${typeColors[doc.type].border}`}>
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-slate-400 text-sm">
                      {new Date(doc.uploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider badge-glow ${statusColors[doc.status].bg} ${statusColors[doc.status].text} border ${statusColors[doc.status].border}`}>
                        <div className={`w-2 h-2 rounded-full ${doc.status === 'reviewed' ? 'bg-green-400 animate-pulse-glow' : statusColors[doc.status].text.replace('text-', 'bg-')}`} />
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="p-3 glass rounded-xl hover:bg-purple-500/20 hover:text-purple-400 hover:shadow-glow-purple transition-all duration-300 transform hover:scale-110">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-3 glass rounded-xl hover:bg-blue-500/20 hover:text-blue-400 hover:shadow-glow-blue transition-all duration-300 transform hover:scale-110">
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(doc.id)}
                          className="p-3 glass rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 transform hover:scale-110"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
