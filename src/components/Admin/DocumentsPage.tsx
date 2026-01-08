import { useState, useEffect } from 'react';
import { FolderOpen, Trash2, Download, Upload, File, FileText, Image, Video, Music, Archive, Sparkles, Eye, Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import DocumentService, { type DocumentRequest } from '../../services/document.service';

const typeColors = {
  'ID_PROOF': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  'W2': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  'OFFER': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  'TIMESHEET': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  'OTHER': { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' },
};

const statusColors = {
  UPLOADED: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  REVIEWED: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
};

const getFileIcon = (fileName: string = '') => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return FileText;
    case 'doc':
    case 'docx':
      return FileText;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return Image;
    case 'mp4':
    case 'mov':
      return Video;
    case 'mp3':
    case 'wav':
      return Music;
    case 'zip':
    case 'rar':
      return Archive;
    default:
      return File;
  }
};

export function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await DocumentService.getDocumentRequests();
      const uploadedDocs = data.filter(d =>
        d.status === 'UPLOADED' || d.status === 'REVIEWED'
      );
      setDocuments(uploadedDocs);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: documents.length,
    reviewed: documents.filter(d => d.status === 'REVIEWED').length,
    uploaded: documents.filter(d => d.status === 'UPLOADED').length,
  };

  const filteredDocuments = documents.filter(doc => {
    const fileName = doc.fileRef?.split(/[\\/]/).pop() || 'document';
    const matchesSearch =
      fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.requestedFrom.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this document reference?')) {

      setDocuments(documents.filter(d => d._id !== id));
    }
  };

  const handleDownload = async (requestId: string) => {
    try {
      await DocumentService.downloadFile(requestId);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to initiate download.');
    }
  };

  if (loading && documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 m-8">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <p className="text-purple-200 font-bold">Loading document vault...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {}
      <div className="relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />

        <div className="relative flex items-center justify-between animate-slide-in">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl shadow-glow-purple animate-pulse-glow">
                <FolderOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-5xl text-gradient-premium">Document Vault</h1>
                <p className="text-slate-400 mt-1 text-sm">Central repository for all verified candidate documents</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {}
      <div className="grid grid-cols-3 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
        {[
          { label: 'Total Files', value: stats.total, gradient: 'from-purple-500 to-pink-500', icon: FolderOpen },
          { label: 'Recently Uploaded', value: stats.uploaded, gradient: 'from-blue-500 to-cyan-500', icon: Upload },
          { label: 'Reviewed & Verified', value: stats.reviewed, gradient: 'from-green-500 to-emerald-500', icon: Sparkles },
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

      {}
      <div className="glass rounded-3xl p-6 space-y-4 animate-slide-in shadow-premium" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-all duration-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by file name or candidate..."
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
              <option value="ID_PROOF">ID Proof</option>
              <option value="W2">W2</option>
              <option value="OFFER">Offer</option>
              <option value="TIMESHEET">Timesheet</option>
              <option value="OTHER">Other</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-6 py-4 glass rounded-2xl text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all hover:bg-white/10 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="UPLOADED">Uploaded</option>
              <option value="REVIEWED">Reviewed</option>
            </select>
          </div>
        </div>
      </div>

      {}
      <div className="glass rounded-3xl overflow-hidden shadow-premium animate-slide-in" style={{ animationDelay: '300ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="glass-dark border-b border-white/10">
              <tr>
                <th className="px-8 py-5 text-left"><span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">File</span></th>
                <th className="px-8 py-5 text-left"><span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Candidate</span></th>
                <th className="px-8 py-5 text-left"><span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Type</span></th>
                <th className="px-8 py-5 text-left"><span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Upload Date</span></th>
                <th className="px-8 py-5 text-left"><span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Status</span></th>
                <th className="px-8 py-5 text-right"><span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDocuments.map((doc, index) => {
                const fileName = doc.fileRef?.split(/[\\/]/).pop() || 'document.pdf';
                const FileIcon = getFileIcon(fileName);
                return (
                  <tr
                    key={doc._id}
                    className="group hover:bg-gradient-to-r hover:from-purple-500/5 hover:via-pink-500/5 hover:to-purple-500/5 transition-all duration-300 animate-slide-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-lg flex items-center justify-center text-white shadow-glow-purple">
                          <FileIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-slate-200 font-medium">{fileName}</p>
                          <p className="text-xs text-slate-500">Document Reference</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-slate-300 font-medium">{doc.requestedFrom.name}</span>
                        <span className="text-xs text-slate-500">{doc.requestedFrom.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider badge-glow ${(typeColors as any)[doc.type].bg} ${(typeColors as any)[doc.type].text} border ${(typeColors as any)[doc.type].border}`}>
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-slate-400 text-sm">
                      {new Date(doc.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider badge-glow ${(statusColors as any)[doc.status].bg} ${(statusColors as any)[doc.status].text} border ${(statusColors as any)[doc.status].border}`}>
                        <div className={`w-2 h-2 rounded-full ${doc.status === 'REVIEWED' ? 'bg-green-400 animate-pulse-glow' : (statusColors as any)[doc.status].text.replace('text-', 'bg-')}`} />
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="p-3 glass rounded-xl hover:bg-purple-500/20 hover:text-purple-400 hover:shadow-glow-purple transition-all duration-300 transform hover:scale-110">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(doc._id)}
                          className="p-3 glass rounded-xl hover:bg-blue-500/20 hover:text-blue-400 hover:shadow-glow-blue transition-all duration-300 transform hover:scale-110"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc._id)}
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
