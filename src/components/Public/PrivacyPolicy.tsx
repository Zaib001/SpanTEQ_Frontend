import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, FileCheck, Mail } from 'lucide-react';

export function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Title Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-purple-50 rounded-full border border-purple-200 mb-6">
            <Shield className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-900">Legal Document</span>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-600">
            Last Updated: December 11, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="prose prose-slate max-w-none">
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 mb-12">
            <p className="text-slate-700 leading-relaxed mb-0">
              SpanTeq ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information when you use our recruitment operations platform. 
              Please read this privacy policy carefully.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">1. Information We Collect</h2>
                <p className="text-slate-600">We collect information that you provide directly to us and information automatically collected when you use our platform.</p>
              </div>
            </div>

            <div className="ml-16 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">1.1 Personal Information</h3>
                <p className="text-slate-700 mb-3">When you register or use our platform, we may collect:</p>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Name, email address, phone number, and job title</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Employment information (role, compensation details, start date)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Timesheet data, work hours, and project information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <span>PTO requests and leave balance information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Salary, commission, and payment information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Candidate submission data and recruitment metrics</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">1.2 Automatically Collected Information</h3>
                <p className="text-slate-700 mb-3">We automatically collect certain information when you use our platform:</p>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Log data (IP address, browser type, pages visited, time spent)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Device information (device type, operating system, unique identifiers)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Cookies and similar tracking technologies</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">2. How We Use Your Information</h2>
                <p className="text-slate-600">We use the information we collect for various business purposes.</p>
              </div>
            </div>

            <div className="ml-16 space-y-4">
              <p className="text-slate-700">We use your information to:</p>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Provide, operate, and maintain our recruitment operations platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Process timesheets, PTO requests, and payroll calculations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Track candidate submissions and recruitment performance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Manage user accounts and provide customer support</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Send administrative information, updates, and security alerts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Improve and optimize our platform through analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Comply with legal obligations and enforce our terms</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">3. Information Sharing and Disclosure</h2>
                <p className="text-slate-600">We do not sell your personal information. We may share information in the following circumstances.</p>
              </div>
            </div>

            <div className="ml-16 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">3.1 With Your Consent</h3>
                <p className="text-slate-700">We may share your information when you explicitly consent to such sharing.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">3.2 Service Providers</h3>
                <p className="text-slate-700">We may share information with third-party service providers who perform services on our behalf, such as:</p>
                <ul className="space-y-2 text-slate-700 mt-3">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Cloud hosting and data storage providers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Payment processors for salary and commission disbursements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Analytics and performance monitoring services</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">3.3 Legal Requirements</h3>
                <p className="text-slate-700">We may disclose your information if required by law or in response to valid requests by public authorities.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">3.4 Business Transfers</h3>
                <p className="text-slate-700">In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">4. Data Security</h2>
                <p className="text-slate-600">We implement appropriate technical and organizational measures to protect your information.</p>
              </div>
            </div>

            <div className="ml-16 space-y-4">
              <p className="text-slate-700">Our security measures include:</p>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Encryption of data in transit and at rest</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Regular security audits and vulnerability assessments</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Role-based access controls and authentication mechanisms</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Secure backup and disaster recovery procedures</span>
                </li>
              </ul>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mt-6">
                <p className="text-amber-900 font-medium">
                  <strong>Important:</strong> No method of transmission over the internet or electronic storage is 100% secure. 
                  While we strive to protect your personal information, we cannot guarantee its absolute security.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">5. Your Rights and Choices</h2>
                <p className="text-slate-600">You have certain rights regarding your personal information.</p>
              </div>
            </div>

            <div className="ml-16 space-y-4">
              <p className="text-slate-700">Depending on your location, you may have the right to:</p>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Access and receive a copy of your personal information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Correct or update inaccurate personal information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Request deletion of your personal information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Object to or restrict certain processing of your information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Withdraw consent where processing is based on consent</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Data portability (receive your data in a structured format)</span>
                </li>
              </ul>
              <p className="text-slate-700 mt-4">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">6. Data Retention</h2>
            <div className="ml-0 text-slate-700">
              <p className="mb-4">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
                unless a longer retention period is required or permitted by law. When determining retention periods, we consider:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>The nature and sensitivity of the information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Legal and regulatory requirements</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Business and operational needs</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">7. Changes to This Privacy Policy</h2>
            <div className="ml-0 text-slate-700">
              <p className="mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy 
                Policy periodically for any changes.
              </p>
              <p>
                Your continued use of our platform after any modifications to this Privacy Policy will constitute your 
                acknowledgment of the modifications and your consent to abide by the modified Privacy Policy.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">8. Contact Us</h2>
                <p className="text-slate-600">If you have questions or concerns about this Privacy Policy, please contact us.</p>
              </div>
            </div>
            <div className="ml-16 space-y-3 text-slate-700">
              <p><strong>SpanTeq</strong></p>
              <p>Email: <a href="mailto:privacy@spanteq.com" className="text-purple-600 hover:text-purple-700 font-medium">privacy@spanteq.com</a></p>
              <p>Website: <a href="/" className="text-purple-600 hover:text-purple-700 font-medium">www.spanteq.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
