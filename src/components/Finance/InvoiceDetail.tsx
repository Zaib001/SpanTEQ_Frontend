import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Download, Send, FileText, Calendar, Building2,
  MapPin, Mail, DollarSign, Clock, Check, X, Paperclip,
  User, CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import FinanceService from '../../services/finance.service';
import { RecordPayment } from './RecordPayment';

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
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'DRAFT' | 'SENT' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'VOID'>('DRAFT');
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [sending, setSending] = useState(false);
  const [sentAt, setSentAt] = useState<string | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInvoice();
      fetchPayments();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await FinanceService.getInvoiceById(id!);
      setInvoice(data);
      setStatus(data.status);
      setSentAt(data.sentAt || null);
    } catch (err: any) {
      console.error('Error fetching invoice:', err);
      setError('Failed to load invoice details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const data = await FinanceService.getInvoicePayments(id!);
      setPayments(data);
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleDownloadPDF = async () => {
    try {
      if (!id) return;
      const blob = await FinanceService.downloadInvoicePDF(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice - ${invoice?.invoiceNumber || id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
    }
  };

  const handleDownloadZIP = async () => {
    try {
      if (!id) return;
      const blob = await FinanceService.downloadInvoiceZip(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${invoice?.invoiceNumber || id}_Attachments.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading ZIP:', err);
      alert('Failed to download ZIP. Please ensure the invoice PDF has been generated.');
    }
  };

  const handleSend = async () => {
    try {
      setSending(true);
      setError(null);
      await FinanceService.sendInvoice(id!, customNote);

      // Refresh invoice data to get updated status
      await fetchInvoice();
      setShowSendDialog(false);
    } catch (err: any) {
      console.error('Error sending invoice:', err);
      setError(err?.message || 'Failed to send invoice. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-blue-200 font-bold">Fetching Invoice Details...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-12 text-center backdrop-blur-xl">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-black text-white mb-2">Error</h3>
        <p className="text-red-200 mb-6">{error || 'Invoice not found'}</p>
        <button onClick={() => navigate('/admin/finance/invoices')} className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold">Back to Invoices</button>
      </div>
    );
  }

  const subtotal = invoice.lineItems?.reduce((sum: number, item: any) => sum + item.amount, 0) || invoice.totalBilledAmount;
  const tax = 0;
  const total = subtotal + tax;
  const alreadyReceived = payments.reduce((sum, p) => sum + p.amountReceived, 0);
  const outstanding = total - alreadyReceived;

  return (
    <div className="space-y-6">
      { }
      <button
        onClick={() => navigate('/admin/finance/invoices')}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-700"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
        Back to Invoices
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        { }
        <div className="lg:col-span-2 space-y-6">
          { }
          <div className="bg-white border border-slate-200 rounded-2xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Invoice #{invoice.invoiceNumber}</h1>
                <p className="text-slate-600 font-semibold">{invoice.clientName}</p>
              </div>
              <div className={`px-4 py-2 rounded-xl text-sm font-black uppercase flex items-center gap-2 ${status === 'DRAFT'
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

            { }
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

            { }
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Billing Period</div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                  <span className="font-bold text-slate-900">{invoice.invoicePeriod?.month || 'N/A'}</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Due Date</div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" strokeWidth={2.5} />
                  <span className="font-bold text-slate-900">{new Date(invoice.dueDate).toLocaleDateString()}</span>
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
                  <span className="font-bold text-slate-900">System</span>
                </div>
              </div>
            </div>

            { }
            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Billing Address</h3>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="font-bold text-slate-900 mb-2">{invoice.clientName}</div>
                <div className="text-sm font-semibold text-slate-600 space-y-1">
                  <div>{invoice.clientBillingProfileId?.billingAddress?.line1 || invoice.clientBillingProfileId?.billingAddress?.street || 'N/A'}</div>
                  <div>{invoice.clientBillingProfileId?.billingAddress?.city || 'N/A'}, {invoice.clientBillingProfileId?.billingAddress?.state || 'N/A'} {invoice.clientBillingProfileId?.billingAddress?.zip || 'N/A'}</div>
                  <div>{invoice.clientBillingProfileId?.billingAddress?.country || 'N/A'}</div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
                  {invoice.clientBillingProfileId?.billingEmails?.to?.join(', ') || invoice.clientBillingProfileId?.billingEmails?.toString() || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          { }
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-black text-slate-900">Line Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-right text-xs font-black text-slate-600 uppercase tracking-wider">Approved Hours</th>
                    <th className="px-6 py-4 text-right text-xs font-black text-slate-600 uppercase tracking-wider">Bill Rate</th>
                    <th className="px-6 py-4 text-right text-xs font-black text-slate-600 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.lineItems?.map((item: any, index: number) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900">{item.candidateName || item.description}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-slate-700">{item.approvedHours || item.quantity} hrs</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-slate-900">{formatCurrency(Number(item.clientBillRate || item.billRate || item.rate || 0))}/hr</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-black text-slate-900">{formatCurrency(item.amount)}</span>
                      </td>
                    </tr>
                  ))}
                  {(!invoice.lineItems || invoice.lineItems.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-bold">No line items found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            { }
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
                {alreadyReceived > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-bold">
                    <span>Already Received</span>
                    <span>{formatCurrency(alreadyReceived)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-orange-600 font-black">
                  <span>Outstanding Balance</span>
                  <span>{formatCurrency(outstanding)}</span>
                </div>
              </div>
            </div>
          </div>

          { }
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                <h2 className="text-xl font-black text-slate-900">Attachments</h2>
              </div>
              <button
                onClick={handleDownloadZIP}
                className="px-4 py-2 bg-slate-100 text-slate-900 rounded-lg font-bold hover:bg-slate-200 transition-colors text-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" strokeWidth={2.5} />
                Download All as ZIP
              </button>
            </div>

            <div className="space-y-2">
              {/* Show Invoice PDF if it exists */}
              {invoice.attachments?.invoicePdfPath && (
                <div className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-100">
                      <FileText className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">
                        {invoice.attachments.invoicePdfPath.split('/').pop() || 'invoice.pdf'}
                      </div>
                      <div className="text-xs font-semibold text-slate-500">Invoice PDF</div>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadPDF}
                    className="p-2 hover:bg-white rounded-lg transition-colors group-hover:opacity-100"
                  >
                    <Download className="w-4 h-4 text-slate-600" strokeWidth={2.5} />
                  </button>
                </div>
              )}

              {/* Show Supporting Timesheets */}
              {invoice.attachments?.supportingTimesheets?.map((ts: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100">
                      <FileText className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{ts.filename || `Timesheet ${index + 1}`}</div>
                      <div className="text-xs font-semibold text-slate-500">Timesheet Attachment</div>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-slate-400 italic mr-2">
                    (Static download not enabled)
                  </div>
                </div>
              ))}

              {(!invoice.attachments?.invoicePdfPath && (!invoice.attachments?.supportingTimesheets || invoice.attachments.supportingTimesheets.length === 0)) && (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-sm font-bold text-slate-500 underline decoration-blue-500 decoration-2 underline-offset-4">
                    Send the invoice to generate the PDF and attach timesheets.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        { }
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

              <button
                onClick={handleDownloadPDF}
                className="w-full px-6 py-4 bg-slate-100 text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" strokeWidth={2.5} />
                Download PDF
              </button>

              {status !== 'DRAFT' && status !== 'PAID' && status !== 'VOID' && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full px-6 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-5 h-5" strokeWidth={2.5} />
                  Record Payment
                </button>
              )}

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

      { }
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
                    {invoice.clientBillingProfileId?.billingEmails?.to?.map((email: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Mail className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                        {email}
                      </div>
                    ))}
                    {(!invoice.clientBillingProfileId?.billingEmails?.to || invoice.clientBillingProfileId.billingEmails.to.length === 0) && (
                      <div className="text-sm font-semibold text-slate-500">No recipients configured</div>
                    )}
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

      {showPaymentModal && (
        <RecordPayment
          invoiceId={id!}
          invoiceNumber={invoice.invoiceNumber}
          client={invoice.clientName}
          totalAmount={total}
          alreadyReceived={alreadyReceived}
          outstanding={outstanding}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            fetchInvoice();
            fetchPayments();
          }}
        />
      )}
    </div>
  );
}
