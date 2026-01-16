import { useState } from 'react';
import { X, Check, Building2, Mail, Phone, MapPin, CreditCard, DollarSign, AlertCircle, Loader2 } from 'lucide-react';
import FinanceService from '../../services/finance.service';

interface AddBillingProfileModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export function AddBillingProfileModal({ onClose, onSuccess }: AddBillingProfileModalProps) {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        clientName: '',
        billingEmails: {
            to: '',
            cc: '',
        },
        paymentTerms: 30,
        currency: 'USD',
        billingAddress: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            zip: '',
            country: 'US',
        },
    });

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.clientName) newErrors.clientName = 'Client name is required';
        if (!formData.billingEmails.to) newErrors.emailsTo = 'Primary billing email is required';
        if (!formData.billingAddress.line1) newErrors.addressLine1 = 'Address is required';
        if (!formData.billingAddress.city) newErrors.city = 'City is required';
        if (!formData.billingAddress.state) newErrors.state = 'State is required';
        if (!formData.billingAddress.zip) newErrors.zip = 'ZIP code is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);
            const payload = {
                ...formData,
                billingEmails: {
                    to: formData.billingEmails.to.split(',').map(e => e.trim()),
                    cc: formData.billingEmails.cc ? formData.billingEmails.cc.split(',').map(e => e.trim()) : [],
                }
            };
            await FinanceService.createBillingProfile(payload);
            onSuccess();
        } catch (err: any) {
            console.error('Error creating billing profile:', err);
            setErrors({ submit: err.response?.data?.message || 'Failed to create billing profile' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 animate-fade-in" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-y-auto">
                <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8 animate-slide-in overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">Add Client Profile</h2>
                            <p className="text-sm font-semibold text-slate-600 mt-1">Create a new billing master record</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-200 transition-colors">
                            <X className="w-5 h-5 text-slate-600" strokeWidth={2.5} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Info */}
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Client Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2.5} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.clientName}
                                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                        className={`w-full pl-12 pr-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.clientName ? 'border-red-300 ring-red-500/20' : 'border-slate-200 focus:ring-purple-500/20 focus:border-purple-500'
                                            } text-slate-900 font-semibold`}
                                        placeholder="e.g. TechCorp Solutions"
                                    />
                                </div>
                                {errors.clientName && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.clientName}</p>}
                            </div>

                            {/* Emails */}
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Billing Emails (To)</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2.5} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.billingEmails.to}
                                        onChange={(e) => setFormData({ ...formData, billingEmails: { ...formData.billingEmails, to: e.target.value } })}
                                        className={`w-full pl-12 pr-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.emailsTo ? 'border-red-300 ring-red-500/20' : 'border-slate-200 focus:ring-purple-500/20 focus:border-purple-500'
                                            } text-slate-900 font-semibold`}
                                        placeholder="email1@example.com, email2@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">CC Emails</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2.5} />
                                    <input
                                        type="text"
                                        value={formData.billingEmails.cc}
                                        onChange={(e) => setFormData({ ...formData, billingEmails: { ...formData.billingEmails, cc: e.target.value } })}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 font-semibold transition-all"
                                        placeholder="finance@example.com"
                                    />
                                </div>
                            </div>

                            {/* Payment & Currency */}
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Payment Terms (Days)</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2.5} />
                                    <input
                                        type="number"
                                        value={formData.paymentTerms}
                                        onChange={(e) => setFormData({ ...formData, paymentTerms: parseInt(e.target.value) })}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 font-semibold transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Default Currency</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2.5} />
                                    <select
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 font-semibold transition-all appearance-none"
                                    >
                                        <option value="USD">USD - US Dollar</option>
                                        <option value="INR">INR - Indian Rupee</option>
                                    </select>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="col-span-2">
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Billing Address</h3>
                                </div>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        required
                                        placeholder="Address Line 1"
                                        value={formData.billingAddress.line1}
                                        onChange={(e) => setFormData({ ...formData, billingAddress: { ...formData.billingAddress, line1: e.target.value } })}
                                        className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.addressLine1 ? 'border-red-300 ring-red-500/20' : 'border-slate-200 focus:ring-purple-500/20 focus:border-purple-500'
                                            } text-slate-900 font-semibold`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Address Line 2 (Optional)"
                                        value={formData.billingAddress.line2}
                                        onChange={(e) => setFormData({ ...formData, billingAddress: { ...formData.billingAddress, line2: e.target.value } })}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 font-semibold transition-all"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            required
                                            placeholder="City"
                                            value={formData.billingAddress.city}
                                            onChange={(e) => setFormData({ ...formData, billingAddress: { ...formData.billingAddress, city: e.target.value } })}
                                            className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 font-semibold"
                                        />
                                        <input
                                            type="text"
                                            required
                                            placeholder="State / Province"
                                            value={formData.billingAddress.state}
                                            onChange={(e) => setFormData({ ...formData, billingAddress: { ...formData.billingAddress, state: e.target.value } })}
                                            className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 font-semibold"
                                        />
                                        <input
                                            type="text"
                                            required
                                            placeholder="ZIP / Postal Code"
                                            value={formData.billingAddress.zip}
                                            onChange={(e) => setFormData({ ...formData, billingAddress: { ...formData.billingAddress, zip: e.target.value } })}
                                            className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 font-semibold"
                                        />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Country"
                                            value={formData.billingAddress.country}
                                            onChange={(e) => setFormData({ ...formData, billingAddress: { ...formData.billingAddress, country: e.target.value } })}
                                            className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 font-semibold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {errors.submit && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" strokeWidth={2.5} />
                                <p className="text-red-700 text-sm font-bold">{errors.submit}</p>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
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
                                disabled={loading}
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-black hover:shadow-xl hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" strokeWidth={2.5} />
                                        Save Profile
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
