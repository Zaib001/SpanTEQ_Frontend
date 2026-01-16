import { useState, useEffect } from 'react';
import { Filter, PartyPopper, Loader2, AlertCircle } from 'lucide-react';
import HolidayService, { type Holiday } from '../../services/holiday.service';

export function RecruiterHolidays() {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        country: '',
        fromDate: '',
        toDate: '',
        upcomingOnly: false,
    });

    useEffect(() => {
        fetchHolidays();
    }, []);

    const fetchHolidays = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await HolidayService.getAllHolidays();
            const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setHolidays(sorted);
        } catch (err: any) {
            console.error('Error fetching holidays:', err);
            setError('Failed to load holidays. Please try again.');
        } finally {
            setLoading(false);
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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-glow-purple">
                        <PartyPopper className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Company Holidays</h2>
                        <p className="text-slate-400 text-sm">View company holidays and events</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="font-semibold">{error}</span>
                </div>
            )}

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

            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Holiday Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Country</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Holiday Type</th>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
