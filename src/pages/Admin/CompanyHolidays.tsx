import { useState, useEffect } from 'react';
import { Plus, Filter, Edit2, Trash2, X, PartyPopper, Loader2, AlertCircle } from 'lucide-react';
import HolidayService, { type Holiday } from '../../services/holiday.service';

export function CompanyHolidays() {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
        holidayType: 'PUBLIC' as 'COMPANY' | 'PUBLIC',
    });

    useEffect(() => {
        fetchHolidays();
    }, []);

    const fetchHolidays = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await HolidayService.getAllHolidays();
            setHolidays(data);
        } catch (err: any) {
            console.error('Error fetching holidays:', err);
            setError('Failed to load holidays. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (holiday?: Holiday) => {
        if (holiday) {
            setEditingHoliday(holiday);
            setFormData({
                name: holiday.name,
                date: new Date(holiday.date).toISOString().split('T')[0],
                country: holiday.country,
                holidayType: holiday.holidayType,
            });
        } else {
            setEditingHoliday(null);
            setFormData({ name: '', date: '', country: 'US', holidayType: 'PUBLIC' });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            setError(null);
            if (editingHoliday?._id) {
                const updated = await HolidayService.updateHoliday(editingHoliday._id, formData);
                setHolidays(holidays.map(h => h._id === editingHoliday._id ? updated : h));
            } else {
                const created = await HolidayService.createHoliday(formData);
                setHolidays([...holidays, created]);
            }
            setShowModal(false);
        } catch (err: any) {
            console.error('Error saving holiday:', err);
            setError(err.message || 'Failed to save holiday.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this holiday?')) return;
        try {
            setError(null);
            await HolidayService.deleteHoliday(id);
            setHolidays(holidays.filter(h => h._id !== id));
        } catch (err: any) {
            console.error('Error deleting holiday:', err);
            setError('Failed to delete holiday.');
        }
    };

    const filteredHolidays = holidays.filter(holiday => {
        if (filters.country && holiday.country !== filters.country) return false;
        if (filters.fromDate && holiday.date < filters.fromDate) return false;
        if (filters.toDate && holiday.date > filters.toDate) return false;
        if (filters.upcomingOnly && new Date(holiday.date) < new Date()) return false;
        return true;
    });

    if (loading && holidays.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 m-8">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                <p className="text-purple-200 font-bold">Synchronizing Holidays...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {}
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

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="font-semibold">{error}</span>
                </div>
            )}

            {}
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

            {}
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
                                <tr key={holiday._id} className="hover:bg-white/5 transition-colors">
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
                                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${holiday.holidayType === 'PUBLIC'
                                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                            : 'bg-green-500/20 text-green-300 border border-green-500/30'
                                            }`}>
                                            {holiday.holidayType}
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
                                                onClick={() => holiday._id && handleDelete(holiday._id)}
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

            {}
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
                                    value={formData.holidayType}
                                    onChange={(e) => setFormData({ ...formData, holidayType: e.target.value as 'COMPANY' | 'PUBLIC' })}
                                    className="w-full px-4 py-3 bg-slate-800/90 border border-white/10 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    style={{ colorScheme: 'dark' }}
                                >
                                    <option value="PUBLIC" className="bg-slate-800 text-slate-100">Public</option>
                                    <option value="COMPANY" className="bg-slate-800 text-slate-100">Company</option>
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