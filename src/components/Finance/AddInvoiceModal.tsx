import { useState, useEffect } from 'react';
import { X, Check, FileText, Calendar, Building2, User, DollarSign, Clock, AlertCircle, Loader2, ChevronRight, Briefcase } from 'lucide-react';
import FinanceService from '../../services/finance.service';
import type { BillingProfile } from '../../services/finance.service';
import TimesheetService from '../../services/timesheet.service';
import type { Timesheet } from '../../services/timesheet.service';
import apiClient from '../../config/api.config';

interface AddInvoiceModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export function AddInvoiceModal({ onClose, onSuccess }: AddInvoiceModalProps) {
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [profiles, setProfiles] = useState<BillingProfile[]>([]);
    const [availableTimesheets, setAvailableTimesheets] = useState<Timesheet[]>([]);
    const [selectedProfileId, setSelectedProfileId] = useState('');
    const [selectedTimesheetIds, setSelectedTimesheetIds] = useState<string[]>([]);
    const [invoicePeriod, setInvoicePeriod] = useState({
        type: 'MONTH' as const,
        month: new Date().toISOString().slice(0, 7),
    });
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setFetchingData(true);
            const [profilesData, tsResponse] = await Promise.all([
                FinanceService.getClientBillingProfiles(),
                TimesheetService.getAllTimesheets({ status: 'approved' })
            ]);
            setProfiles(profilesData);

            // Filter uninvoiced timesheets
            const uninvoiced = tsResponse.timesheets.filter((ts: any) => !ts.invoiceId);
            setAvailableTimesheets(uninvoiced);
        } catch (err) {
            console.error('Error loading data for invoice:', err);
            setErrors({ load: 'Failed to load billing profiles or timesheets' });
        } finally {
            setFetchingData(false);
        }
    };

    const selectedProfile = profiles.find(p => p._id === selectedProfileId);

    // Filter timesheets based on client name (if available in timesheet) or by matching candidates from submissions
    const getFilteredTimesheets = () => {
        if (!selectedProfile) return [];

        // Some timesheets might have the 'client' field populated
        return availableTimesheets.filter(ts => {
            // Direct match if client field exists
            if (ts.client && ts.client.toUpperCase() === selectedProfile.clientName.toUpperCase()) return true;

            // If we had submissions, we'd further filter by candidate IDs. 
            // For now, let's assume we show all candidate timesheets and rely on the user or the 'client' field if present.
            // In a more robust system, we'd fetch candidates linked to this client via submissions.
            return true;
        });
    };

    const filteredTimesheets = getFilteredTimesheets();

    const handleToggleTimesheet = (id: string) => {
        setSelectedTimesheetIds(prev =>
            prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
        );
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!selectedProfileId) newErrors.client = 'Please select a client';
        if (selectedTimesheetIds.length === 0) newErrors.timesheets = 'Please select at least one timesheet';
        if (invoicePeriod.type === 'MONTH' && !invoicePeriod.month) newErrors.month = 'Month is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);
            await FinanceService.createInvoice({
                clientName: selectedProfile!.clientName,
                invoicePeriod,
                timesheetIds: selectedTimesheetIds,
                currency: selectedProfile!.currency,
                notes
            });
            onSuccess();
        } catch (err: any) {
            console.error('Error creating invoice:', err);
            setErrors({ submit: err.response?.data?.message || 'Failed to create invoice' });
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: selectedProfile?.currency || 'USD',
        }).format(value);
    };

    const calculateTotal = () => {
        return filteredTimesheets
            .filter(ts => selectedTimesheetIds.includes(ts._id))
            .reduce((sum, ts) => sum + (ts.clientBillAmount || 0), 0);
    };

    if (fetchingData) {
        return (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white p-12 rounded-3xl flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                    <p className="text-slate-600 font-bold">Loading billing data...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 animate-fade-in" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-y-auto">
                <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-8 animate-slide-in overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">Create New Invoice</h2>
                            <p className="text-sm font-semibold text-slate-600 mt-1">Generate invoice from approved timesheets</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-200 transition-colors">
                            <X className="w-5 h-5 text-slate-600" strokeWidth={2.5} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Left Column: Client & Period */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Select Client</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2.5} />
                                        <select
                                            value={selectedProfileId}
                                            onChange={(e) => setSelectedProfileId(e.target.value)}
                                            className={`w-full pl-12 pr-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none ${errors.client ? 'border-red-300 ring-red-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                                                } text-slate-900 font-semibold`}
                                        >
                                            <option value="">Choose a client...</option>
                                            {profiles.map(p => (
                                                <option key={p._id} value={p._id}>{p.clientName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Billing Period (Month)</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2.5} />
                                        <input
                                            type="month"
                                            value={invoicePeriod.month}
                                            onChange={(e) => setInvoicePeriod({ ...invoicePeriod, month: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 font-semibold transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Internal Notes</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={4}
                                        placeholder="Optional notes for this invoice..."
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 font-semibold resize-none transition-all"
                                    />
                                </div>

                                {selectedProfile && (
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                                        <div className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">Summary</div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-blue-700 font-semibold">Selected Count</span>
                                                <span className="text-blue-900 font-black">{selectedTimesheetIds.length} items</span>
                                            </div>
                                            <div className="flex justify-between text-lg pt-2 border-t border-blue-200">
                                                <span className="text-blue-900 font-black">Total to Bill</span>
                                                <span className="text-blue-900 font-black">{formatCurrency(calculateTotal())}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Timesheet Selection */}
                            <div className="md:col-span-2 space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Select Available Timesheets ({filteredTimesheets.length})
                                    </label>
                                    {errors.timesheets && <span className="text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">{errors.timesheets}</span>}
                                </div>

                                <div className="border-2 border-slate-100 rounded-2xl overflow-hidden max-h-[400px] overflow-y-auto">
                                    {!selectedProfileId ? (
                                        <div className="p-12 text-center bg-slate-50">
                                            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-500 font-bold italic">Select a client to see available timesheets</p>
                                        </div>
                                    ) : filteredTimesheets.length === 0 ? (
                                        <div className="p-12 text-center bg-slate-50">
                                            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                                            <p className="text-slate-600 font-bold">No uninvoiced timesheets found for this client</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-100">
                                            {filteredTimesheets.map(ts => (
                                                <div
                                                    key={ts._id}
                                                    onClick={() => handleToggleTimesheet(ts._id)}
                                                    className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${selectedTimesheetIds.includes(ts._id) ? 'bg-blue-50/50' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${selectedTimesheetIds.includes(ts._id)
                                                            ? 'bg-blue-600 border-blue-600'
                                                            : 'border-slate-300 bg-white'
                                                            }`}>
                                                            {selectedTimesheetIds.includes(ts._id) && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-slate-900 text-sm">{ts.user?.name || 'Unknown Candidate'}</div>
                                                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(ts.from).toLocaleDateString()} - {new Date(ts.to).toLocaleDateString()}</span>
                                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ts.hours} hrs</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-black text-blue-600">{formatCurrency(ts.clientBillAmount || 0)}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {errors.submit && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" strokeWidth={2.5} />
                                <p className="text-red-700 text-sm font-bold">{errors.submit}</p>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 bg-slate-100 text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !selectedProfileId || selectedTimesheetIds.length === 0}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-black hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="w-5 h-5" strokeWidth={2.5} />
                                        Generate Invoice
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
