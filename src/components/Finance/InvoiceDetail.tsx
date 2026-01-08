import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Download, Send, FileText, Calendar, Building2, 
  MapPin, Mail, DollarSign, Clock, Check, X, Paperclip,
  User, CheckCircle, AlertCircle
} from 'lucide-react';

interface LineItem {
  candidate: string;
  approvedHours: number;
  billRate: number;
  amount: number;
}

interface Attachment {
  type: 'invoice' | 'timesheet';
  name: string;
  candidate?: string;
  size: string;
}

const mockLineItems: LineItem[] = [
  { candidate: 'John Smith', approvedHours: 160, billRate: 125, amount: 20000 },
  { candidate: 'Sarah Johnson', approvedHours: 160, billRate: 135, amount: 21600 },
  { candidate: 'Michael Brown', approvedHours: 152, billRate: 115, amount: 17480 },
  { candidate: 'Emily Davis', approvedHours: 160, billRate: 145, amount: 23200 },
  { candidate: 'David Wilson', approvedHours: 148, billRate: 125, amount: 18500 },
];

const mockAttachments: Attachment[] = [
  { type: 'invoice', name: 'INV-2024-001.pdf', size: '245 KB' },
  { type: 'timesheet', name: 'Timesheet - John Smith.pdf', candidate: 'John Smith', size: '89 KB' },
  { type: 'timesheet', name: 'Timesheet - Sarah Johnson.pdf', candidate: 'Sarah Johnson', size: '92 KB' },
  { type: 'timesheet', name: 'Timesheet - Michael Brown.pdf', candidate: 'Michael Brown', size: '86 KB' },
  { type: 'timesheet', name: 'Timesheet - Emily Davis.pdf', candidate: 'Emily Davis', size: '91 KB' },
  { type: 'timesheet', name: 'Timesheet - David Wilson.pdf', candidate: 'David Wilson', size: '88 KB' },
];

export function InvoiceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState<'DRAFT' | 'SENT'>('DRAFT');
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [sending, setSending] = useState(false);
  const [sentAt, setSentAt] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const subtotal = mockLineItems.reduce((sum, item) => sum + item.amount, 0);
  const tax = 0;
  const total = subtotal + tax;

  const handleSend = async () => {
    setSending(true);

    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('SENT');
    setSentAt(new Date().toISOString());
    setSending(false);
    setShowSendDialog(false);
  };

  return (
    <div className="space-y-6">
      {}
      <button
        onClick={() => navigate('/admin/finance/invoices')}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-700"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
        Back to Invoices
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <div className="lg:col-span-2 space-y-6">
          {}
          <div className="bg-white border border-slate-200 rounded-2xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Invoice #INV-2024-001</h1>
                <p className="text-slate-600 font-semibold">TechCorp Solutions</p>
              </div>
              <div className={`px-4 py-2 rounded-xl text-sm font-black uppercase flex items-center gap-2 ${
                status === 'DRAFT' 
                  ? 'bg-slate-100 text-slate-700 border border-slate-200' 
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}>
                {status === 'DRAFT' ? (
                  <FileText className="w-4 h-4" strokeWidth={2.5} />
                ) : (
                  <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
                )}
                {status}
              </div>
            </div>

            {}
            {status === 'SENT' && sentAt && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <div>
                  <div className="text-sm font-black text-emerald-900">Invoice Sent Successfully</div>
                  <div className="text-xs text-emerald-700 font-semibold mt-1">
                    Sent on {new Date(sentAt).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Billing Period</div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                  <span className="font-bold text-slate-900">December 2024</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Due Date</div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" strokeWidth={2.5} />
                  <span className="font-bold text-slate-900">January 15, 2025</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Currency</div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                  <span className="font-bold text-slate-900">USD</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Created By</div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                  <span className="font-bold text-slate-900">Admin User</span>
                </div>
              </div>
            </div>

            {}
            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Billing Address</h3>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="font-bold text-slate-900 mb-2">TechCorp Solutions</div>
                <div className="text-sm font-semibold text-slate-600 space-y-1">
                  <div>123 Tech Street, Suite 400</div>
                  <div>San Francisco, CA 94105</div>
                  <div>United States</div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
                  billing@techcorp.com, finance@techcorp.com
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-black text-slate-900">Line Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-4 text-right text-xs font-black text-slate-600 uppercase tracking-wider">Approved Hours</th>
                    <th className="px-6 py-4 text-right text-xs font-black text-slate-600 uppercase tracking-wider">Bill Rate</th>
                    <th className="px-6 py-4 text-right text-xs font-black text-slate-600 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockLineItems.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900">{item.candidate}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-slate-700">{item.approvedHours} hrs</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-slate-900">{formatCurrency(item.billRate)}/hr</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-black text-slate-900">{formatCurrency(item.amount)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {}
            <div className="border-t-2 border-slate-200 p-6 bg-slate-50">
              <div className="max-w-sm ml-auto space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-600">Subtotal</span>
                  <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-600">Tax (0%)</span>
                  <span className="font-bold text-slate-900">{formatCurrency(tax)}</span>
                </div>
                <div className="pt-3 border-t-2 border-slate-300 flex items-center justify-between">
                  <span className="text-lg font-black text-slate-900">Total</span>
                  <span className="text-2xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                <h2 className="text-xl font-black text-slate-900">Attachments</h2>
              </div>
              <button className="px-4 py-2 bg-slate-100 text-slate-900 rounded-lg font-bold hover:bg-slate-200 transition-colors text-sm flex items-center gap-2">
                <Download className="w-4 h-4" strokeWidth={2.5} />
                Download All as ZIP
              </button>
            </div>

            <div className="space-y-2">
              {mockAttachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      attachment.type === 'invoice' 
                        ? 'bg-purple-100' 
                        : 'bg-blue-100'
                    }`}>
                      <FileText className={`w-5 h-5 ${
                        attachment.type === 'invoice' 
                          ? 'text-purple-600' 
                          : 'text-blue-600'
                      }`} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{attachment.name}</div>
                      <div className="text-xs font-semibold text-slate-500">{attachment.size}</div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <Download className="w-4 h-4 text-slate-600" strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-6">
            <h3 className="text-lg font-black text-slate-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowSendDialog(true)}
                disabled={status !== 'DRAFT'}
                className="w-full px-6 py-4 bg-slate-900 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-slate-900/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                Send Invoice
              </button>

              <button className="w-full px-6 py-4 bg-slate-100 text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" strokeWidth={2.5} />
                Download PDF
              </button>

              <button
                onClick={() => navigate('/admin/finance/invoices')}
                className="w-full px-6 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
                Back to Invoices
              </button>
            </div>

            {status === 'DRAFT' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <p className="text-xs font-semibold text-blue-900">
                    This invoice is in draft status. Send it to the client to mark it as sent.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {}
      {showSendDialog && (
        <>
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 animate-fade-in" onClick={() => !sending && setShowSendDialog(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full animate-slide-in">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-2xl font-black text-slate-900">Send Invoice</h2>
                <p className="text-sm font-semibold text-slate-600 mt-1">Confirm sending invoice to client</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recipients</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Mail className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                      billing@techcorp.com
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Mail className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                      finance@techcorp.com
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">Attachments</div>
                  <div className="text-sm font-semibold text-blue-700">
                    • Invoice PDF (INV-2024-001.pdf)
                    <br />• Timesheets (5 files)
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Custom Email Note (Optional)
                  </label>
                  <textarea
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    rows={4}
                    placeholder="Add a custom message to include in the email..."
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-slate-900 font-medium resize-none"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowSendDialog(false)}
                  disabled={sending}
                  className="px-6 py-3 bg-slate-100 text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={sending}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-slate-900/30 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                >
                  {sending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" strokeWidth={2.5} />
                      Send Invoice
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
