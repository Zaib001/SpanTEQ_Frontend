import { useState } from 'react';
import { Plus, Filter, Edit2, Trash2, X, PartyPopper } from 'lucide-react';

interface Holiday {
    id: string;
    name: string;
    date: string;
    country: 'IN' | 'US';
    type: 'Company' | 'Public';
}

const mockHolidays: Holiday[] = [
    { id: '1', name: 'New Year\'s Day', date: '2025-01-01', country: 'US', type: 'Public' },
    { id: '2', name: 'Republic Day', date: '2025-01-26', country: 'IN', type: 'Public' },
    { id: '3', name: 'Independence Day', date: '2025-07-04', country: 'US', type: 'Public' },
    { id: '4', name: 'Independence Day', date: '2025-08-15', country: 'IN', type: 'Public' },
    { id: '5', name: 'Company Foundation Day', date: '2025-09-15', country: 'US', type: 'Company' },
];

export function CompanyHolidays() {
    const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays);
    const [showModal, setShowModal] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
    const [filters, setFilters] = useState({
        country: '',
        fromDate: '',
        toDate: '',
        upcomingOnly: false,
    });

    const [formData, setFormData] = useState({
        name: '',
        date: '',
        country: 'US' as 'IN' | 'US',
        type: 'Public' as 'Company' | 'Public',
    });

    const handleOpenModal = (holiday?: Holiday) => {
        if (holiday) {
            setEditingHoliday(holiday);
            setFormData({
                name: holiday.name,
                date: holiday.date,
                country: holiday.country,
                type: holiday.type,
            });
        } else {
            setEditingHoliday(null);
            setFormData({ name: '', date: '', country: 'US', type: 'Public' });
        }
        setShowModal(true);
    };

    const handleSave = () => {
        if (editingHoliday) {
            setHolidays(holidays.map(h => h.id === editingHoliday.id
                ? { ...h, ...formData }
                : h
            ));
        } else {
            setHolidays([...holidays, { id: Date.now().toString(), ...formData }]);
        }
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        setHolidays(holidays.filter(h => h.id !== id));
    };

    const filteredHolidays = holidays.filter(holiday => {
        if (filters.country && holiday.country !== filters.country) return false;
        if (filters.fromDate && holiday.date < filters.fromDate) return false;
        if (filters.toDate && holiday.date > filters.toDate) return false;
        if (filters.upcomingOnly && holiday.date < new Date().toISOString().split('T')[0]) return false;
        return true;
    });

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-glow-purple">
                        <PartyPopper className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Company Holidays</h2>
                        <p className="text-slate-400 text-sm">Manage holidays across all locations</p>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-xl text-white font-medium hover-lift shadow-premium flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Holiday
                </button>
            </div>

            {/* Filters */}
            <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <Filter className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Filters</h3>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <select
                        value={filters.country}
                        onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                        <option value="">All Countries</option>
                        <option value="IN">India</option>
                        <option value="US">United States</option>
                    </select>
                    <input
                        type="date"
                        value={filters.fromDate}
                        onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="From Date"
                    />
                    <input
                        type="date"
                        value={filters.toDate}
                        onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="To Date"
                    />
                    <label className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                        <input
                            type="checkbox"
                            checked={filters.upcomingOnly}
                            onChange={(e) => setFilters({ ...filters, upcomingOnly: e.target.checked })}
                            className="w-5 h-5 rounded bg-white/10 border-white/20 text-purple-500 focus:ring-purple-500/50"
                        />
                        <span className="text-slate-200 text-sm">Upcoming Only</span>
                    </label>
                </div>
            </div>

            {/* Table */}
            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Holiday Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Country</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Holiday Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredHolidays.map((holiday) => (
                                <tr key={holiday.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-slate-200 font-medium">{holiday.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300">{new Date(holiday.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${holiday.country === 'US'
                                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                                : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                                            }`}>
                                            {holiday.country === 'US' ? 'United States' : 'India'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${holiday.type === 'Public'
                                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                                : 'bg-green-500/20 text-green-300 border border-green-500/30'
                                            }`}>
                                            {holiday.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleOpenModal(holiday)}
                                                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(holiday.id)}
                                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
                    <div className="glass rounded-2xl border border-white/10 max-w-lg w-full shadow-premium">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">
                                {editingHoliday ? 'Edit Holiday' : 'Add Holiday'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Holiday Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    placeholder="Enter holiday name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Holiday Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Country</label>
                                <select
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value as 'IN' | 'US' })}
                                    className="w-full px-4 py-3 bg-slate-800/90 border border-white/10 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    style={{ colorScheme: 'dark' }}
                                >
                                    <option value="US" className="bg-slate-800 text-slate-100">United States</option>
                                    <option value="IN" className="bg-slate-800 text-slate-100">India</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Holiday Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Company' | 'Public' })}
                                    className="w-full px-4 py-3 bg-slate-800/90 border border-white/10 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    style={{ colorScheme: 'dark' }}
                                >
                                    <option value="Public" className="bg-slate-800 text-slate-100">Public</option>
                                    <option value="Company" className="bg-slate-800 text-slate-100">Company</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/10 flex gap-3 justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-xl text-white font-medium hover-lift shadow-premium"
                            >
                                {editingHoliday ? 'Update' : 'Add'} Holiday
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}