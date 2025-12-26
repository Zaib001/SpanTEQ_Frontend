import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, AlertCircle, Shield, Users, Ban, Scale } from 'lucide-react';

export function TermsAndConditions() {
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
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full border border-blue-200 mb-6">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Legal Document</span>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Terms and Conditions</h1>
          <p className="text-lg text-slate-600">
            Last Updated: December 11, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="prose prose-slate max-w-none">
          <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-2xl p-8 border border-purple-200 mb-12">
            <div className="mb-6">
              <p className="text-slate-700 leading-relaxed font-semibold text-lg mb-2">
                SpanTeq is a product of <span className="text-purple-700 font-bold">iCloudTeq LLC</span>
              </p>
              <p className="text-slate-600 text-sm">
                A Delaware limited liability company providing enterprise recruitment operations software
              </p>
            </div>
            <p className="text-slate-700 leading-relaxed mb-4">
              These Terms and Conditions ("Terms") govern your access to and use of the SpanTeq recruitment operations 
              platform (the "Platform"), a product owned and operated by iCloudTeq LLC. By accessing or using the Platform, 
              you agree to be bound by these Terms.
            </p>
            <p className="text-slate-700 leading-relaxed mb-0">
              <strong>Please read these Terms carefully before using the Platform.</strong> If you do not agree with 
              these Terms, you must not access or use the Platform.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">1. Acceptance of Terms</h2>
                <p className="text-slate-600">Your use of the Platform constitutes acceptance of these Terms.</p>
              </div>
            </div>

            <div className="ml-16 space-y-4 text-slate-700">
              <p>
                By creating an account, accessing, or using the SpanTeq Platform, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms and our Privacy Policy. If you are using the Platform 
                on behalf of an organization, you represent and warrant that you have the authority to bind that 
                organization to these Terms.
              </p>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of any material changes by 
                posting the updated Terms on the Platform. Your continued use of the Platform after such modifications 
                constitutes your acceptance of the updated Terms.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">2. User Accounts and Registration</h2>
                <p className="text-slate-600">Requirements for creating and maintaining an account on the Platform.</p>
              </div>
            </div>

            <div className="ml-16 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">2.1 Account Creation</h3>
                <p className="text-slate-700 mb-3">To use the Platform, you must:</p>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Provide accurate, current, and complete information during registration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Maintain and promptly update your account information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Be at least 18 years of age or have parental/guardian consent</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Be authorized by your organization to use the Platform</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">2.2 Account Security</h3>
                <p className="text-slate-700 mb-3">You are responsible for:</p>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Maintaining the confidentiality of your account credentials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span>All activities that occur under your account</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Immediately notifying us of any unauthorized access or security breach</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">2.3 Account Termination</h3>
                <p className="text-slate-700">
                  We reserve the right to suspend or terminate your account at any time for violations of these Terms, 
                  fraudulent activity, or any other reason at our sole discretion. You may also request account deletion 
                  by contacting our support team.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">3. Acceptable Use</h2>
                <p className="text-slate-600">Guidelines for proper use of the Platform.</p>
              </div>
            </div>

            <div className="ml-16 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">3.1 Permitted Use</h3>
                <p className="text-slate-700">
                  The Platform is designed for legitimate recruitment operations purposes, including timesheet management, 
                  candidate submissions, PTO tracking, and payroll processing. You agree to use the Platform only for its 
                  intended business purposes.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">3.2 Prohibited Activities</h3>
                <p className="text-slate-700 mb-3">You agree not to:</p>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Violate any applicable laws, regulations, or third-party rights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Submit false, misleading, or fraudulent information (timesheets, submissions, etc.)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Attempt to gain unauthorized access to any part of the Platform</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Interfere with or disrupt the Platform's functionality or servers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Use automated scripts, bots, or scrapers to access the Platform</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Reverse engineer, decompile, or attempt to extract source code</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Upload viruses, malware, or any malicious code</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Share your account credentials with unauthorized third parties</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">4. Intellectual Property</h2>
                <p className="text-slate-600">Ownership and rights related to the Platform and content.</p>
              </div>
            </div>

            <div className="ml-16 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">4.1 Platform Ownership</h3>
                <p className="text-slate-700">
                  The Platform, including all software, designs, text, graphics, logos, and other content, is owned by 
                  iCloudTeq LLC and its SpanTeq brand, and protected by copyright, trademark, and other intellectual property laws. 
                  You are granted a limited, non-exclusive, non-transferable license to access and use the Platform for its intended purposes.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">4.2 User Content</h3>
                <p className="text-slate-700 mb-3">
                  You retain ownership of any content you submit to the Platform (timesheets, documents, candidate data, etc.). 
                  By submitting content, you grant SpanTeq a limited license to:
                </p>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Store, process, and display your content to provide Platform services</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Use aggregated, anonymized data for analytics and platform improvements</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">4.3 Trademarks</h3>
                <p className="text-slate-700">
                  SpanTeq and related logos are trademarks of SpanTeq. You may not use these trademarks without our 
                  prior written consent.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">5. Disclaimer of Warranties</h2>
                <p className="text-slate-600">The Platform is provided "as is" without warranties of any kind.</p>
              </div>
            </div>

            <div className="ml-16 space-y-4 text-slate-700">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS 
                WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES 
                OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
              <p>
                We do not warrant that:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span>The Platform will be uninterrupted, timely, secure, or error-free</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span>The results obtained from using the Platform will be accurate or reliable</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Any errors or defects in the Platform will be corrected</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Ban className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">6. Limitation of Liability</h2>
                <p className="text-slate-600">Limits on our liability for damages arising from Platform use.</p>
              </div>
            </div>

            <div className="ml-16 space-y-4 text-slate-700">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL SPANTEQ, ITS OFFICERS, DIRECTORS, EMPLOYEES, 
                OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING 
                BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Your access to or use of (or inability to access or use) the Platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Any unauthorized access to or alteration of your data</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Any errors, mistakes, or inaccuracies in content or data</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Any interruption or cessation of Platform services</span>
                </li>
              </ul>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-6">
                <p className="text-red-900 font-medium">
                  OUR TOTAL LIABILITY FOR ALL CLAIMS ARISING FROM OR RELATED TO THE PLATFORM SHALL NOT EXCEED 
                  THE AMOUNT YOU PAID TO SPANTEQ IN THE 12 MONTHS PRECEDING THE CLAIM.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">7. Indemnification</h2>
            <div className="ml-0 text-slate-700">
              <p className="mb-4">
                You agree to defend, indemnify, and hold harmless SpanTeq and its officers, directors, employees, and 
                agents from any claims, liabilities, damages, losses, and expenses (including reasonable attorney's fees) 
                arising out of or in any way connected with:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Your access to or use of the Platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Your violation of these Terms</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Your violation of any third-party rights</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Any content you submit to the Platform</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">8. Data and Privacy</h2>
            <div className="ml-0 text-slate-700">
              <p className="mb-4">
                Your use of the Platform is also governed by our Privacy Policy. By using the Platform, you consent to 
                the collection, use, and sharing of your information as described in the Privacy Policy.
              </p>
              <p>
                You acknowledge that the Platform processes sensitive employment data, including timesheet records, salary 
                information, and personal details. You agree to comply with all applicable data protection laws when using 
                the Platform.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">9. Termination</h2>
            <div className="ml-0 text-slate-700">
              <p className="mb-4">
                We may suspend or terminate your access to the Platform immediately, without prior notice or liability, 
                for any reason, including if you breach these Terms.
              </p>
              <p className="mb-4">
                Upon termination, your right to use the Platform will cease immediately. All provisions of these Terms 
                that by their nature should survive termination shall survive, including ownership provisions, warranty 
                disclaimers, and limitations of liability.
              </p>
              <p>
                You may terminate your account at any time by contacting our support team. Upon termination, we will 
                retain your data according to our data retention policies and applicable legal requirements.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">10. Governing Law and Dispute Resolution</h2>
            <div className="ml-0 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">10.1 Governing Law</h3>
                <p className="text-slate-700">
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which 
                  SpanTeq operates, without regard to its conflict of law provisions.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">10.2 Dispute Resolution</h3>
                <p className="text-slate-700 mb-3">
                  Any disputes arising out of or relating to these Terms or the Platform shall be resolved through:
                </p>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Good faith negotiations between the parties</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Mediation, if negotiations fail</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Binding arbitration or litigation in the appropriate jurisdiction</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 11 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">11. General Provisions</h2>
            <div className="ml-0 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">11.1 Entire Agreement</h3>
                <p className="text-slate-700">
                  These Terms, together with our Privacy Policy, constitute the entire agreement between you and SpanTeq 
                  regarding the Platform.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">11.2 Severability</h3>
                <p className="text-slate-700">
                  If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in 
                  full force and effect.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">11.3 No Waiver</h3>
                <p className="text-slate-700">
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">11.4 Assignment</h3>
                <p className="text-slate-700">
                  You may not assign or transfer these Terms without our prior written consent. We may assign these Terms 
                  without restriction.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">12. Contact Information</h2>
                <p className="text-slate-600">Questions about these Terms? Contact us.</p>
              </div>
            </div>
            <div className="ml-16 space-y-3 text-slate-700">
              <p><strong>iCloudTeq LLC</strong></p>
              <p className="text-sm text-slate-600">SpanTeq Platform</p>
              <p>Email: <a href="mailto:legal@spanteq.com" className="text-blue-600 hover:text-blue-700 font-medium">legal@spanteq.com</a></p>
              <p>Support: <a href="mailto:support@spanteq.com" className="text-blue-600 hover:text-blue-700 font-medium">support@spanteq.com</a></p>
              <p>Website: <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">www.spanteq.com</a></p>
            </div>
          </section>

          {/* Acknowledgment */}
          <div className="bg-slate-900 text-white rounded-2xl p-8 mt-12">
            <h3 className="text-2xl font-bold mb-4">Acknowledgment</h3>
            <p className="text-slate-300 leading-relaxed">
              BY USING THE SPANTEQ PLATFORM, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY 
              THESE TERMS AND CONDITIONS. IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST IMMEDIATELY CEASE USING THE PLATFORM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}