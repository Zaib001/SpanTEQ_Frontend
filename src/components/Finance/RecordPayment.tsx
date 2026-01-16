import { useState } from 'react';
import {
  X, Check, DollarSign, Calendar, CreditCard, FileText,
  AlertCircle, CheckCircle, Building2
} from 'lucide-react';
import FinanceService from '../../services/finance.service';

interface RecordPaymentProps {
  invoiceId: string;
  invoiceNumber: string;
  client: string;
  totalAmount: number;
  alreadyReceived: number;
  outstanding: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function RecordPayment({
  invoiceId,
  invoiceNumber,
  client,
  totalAmount,
  alreadyReceived,
  outstanding,
  onClose,
  onSuccess
}: RecordPaymentProps) {
  const [amountReceived, setAmountReceived] = useState('');
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState('ACH');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!amountReceived || parseFloat(amountReceived) <= 0) {
      newErrors.amountReceived = 'Amount must be greater than 0';
    }

    if (parseFloat(amountReceived) > outstanding) {
      newErrors.amountReceived = `Amount cannot exceed outstanding balance of ${formatCurrency(outstanding)}`;
    }

    if (!receivedDate) {
      newErrors.receivedDate = 'Received date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      await FinanceService.recordInvoicePayment(invoiceId, {
        amountReceived: parseFloat(amountReceived),
        receivedDate,
        method,
        referenceNumber,
        notes
      });
      setSaving(false);
      onSuccess();
    } catch (err) {
      console.error('Error recording payment:', err);
      setSaving(false);
      alert('Failed to record payment');
    }
  };

  const amount = parseFloat(amountReceived) || 0;
  const newTotal = alreadyReceived + amount;
  const newOutstanding = totalAmount - newTotal;
  const newStatus = newOutstanding === 0 ? 'PAID' : 'PARTIALLY_PAID';

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 animate-fade-in" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8 animate-slide-in">
          { }
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Record Payment</h2>
              <p className="text-sm font-semibold text-slate-600 mt-1">Apply client payment to invoice</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" strokeWidth={2.5} />
            </button>
          </div>

          { }
          <div className="p-6 space-y-6">
            { }
            <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Invoice Summary</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Invoice Number</div>
                  <div className="font-black text-slate-900">{invoiceNumber}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Client</div>
                  <div className="font-black text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                    {client}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Total Amount</div>
                  <div className="text-xl font-black text-slate-900">{formatCurrency(totalAmount)}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Already Received</div>
                  <div className="text-xl font-black text-emerald-600">{formatCurrency(alreadyReceived)}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Outstanding Balance</div>
                  <div className="text-2xl font-black text-orange-600">{formatCurrency(outstanding)}</div>
                </div>
              </div>
            </div>

            { }
            <div className="space-y-4">
              { }
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Amount Received <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2.5} />
                  <input
                    type="number"
                    step="0.01"
                    value={amountReceived}
                    onChange={(e) => {
                      setAmountReceived(e.target.value);
                      if (errors.amountReceived) {
                        setErrors({ ...errors, amountReceived: '' });
                      }
                    }}
                    placeholder="0.00"
                    className={`w-full pl-12 pr-4 py-3 bg-slate-50 border-2 ${errors.amountReceived ? 'border-red-300' : 'border-slate-200'
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-slate-900 font-bold text-lg`}
                  />
                </div>
                {errors.amountReceived && (
                  <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-red-600">
                    <AlertCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
                    {errors.amountReceived}
                  </div>
                )}
              </div>

              { }
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Received Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2.5} />
                  <input
                    type="date"
                    value={receivedDate}
                    onChange={(e) => {
                      setReceivedDate(e.target.value);
                      if (errors.receivedDate) {
                        setErrors({ ...errors, receivedDate: '' });
                      }
                    }}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-50 border-2 ${errors.receivedDate ? 'border-red-300' : 'border-slate-200'
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-slate-900 font-semibold`}
                  />
                </div>
                {errors.receivedDate && (
                  <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-red-600">
                    <AlertCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
                    {errors.receivedDate}
                  </div>
                )}
              </div>

              { }
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Payment Method
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2.5} />
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-slate-900 font-semibold"
                  >
                    <option value="ACH">ACH Transfer</option>
                    <option value="Check">Check</option>
                    <option value="Wire">Wire Transfer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              { }
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="Transaction ID, check number, etc."
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-slate-900 font-semibold"
                />
              </div>

              { }
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Additional notes about this payment..."
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-slate-900 font-semibold resize-none"
                />
              </div>
            </div>

            { }
            {amount > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <div>
                    <div className="text-sm font-black text-blue-900 mb-2">Automatic Status Update</div>
                    <div className="text-xs font-semibold text-blue-700 space-y-1">
                      <div>• New Total Received: {formatCurrency(newTotal)}</div>
                      <div>• New Outstanding: {formatCurrency(newOutstanding)}</div>
                      <div>• New Status: <span className="font-black uppercase">{newStatus}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          { }
          <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-6 py-3 bg-slate-100 text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !amountReceived || parseFloat(amountReceived) <= 0}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-slate-900/30 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" strokeWidth={2.5} />
                  Save Payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
