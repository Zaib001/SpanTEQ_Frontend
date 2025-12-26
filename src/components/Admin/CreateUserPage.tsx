import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Briefcase, 
  DollarSign,
  Calendar,
  Award,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Save,
  Clock,
  ToggleLeft,
  ToggleRight,
  Percent
} from 'lucide-react';

type UserRole = 'Admin' | 'Recruiter' | 'Candidate';
type PayModel = 'Fixed' | 'Hourly' | 'Percentage' | 'Hybrid';
type BonusFrequency = 'Monthly' | 'Quarterly' | 'Yearly';

interface FormData {
  // Step 1: Basic Details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole | '';
  department: string;
  location: string;
  
  // Step 2: Recruiter Compensation
  recruiterBaseSalary: string;
  recruiterPTO: string;
  recruiterCarryForward: boolean;
  recruiterMaxCarryForward: string;
  recruiterExcessDeduction: boolean;
  recruiterAutoHolidays: boolean;
  recruiterEffectiveMonth: string;
  recruiterBonusEnabled: boolean;
  recruiterBonusAmount: string;
  recruiterBonusFrequency: BonusFrequency | '';
  recruiterBonusStartMonth: string;
  recruiterBonusEndMonth: string;
  
  // Step 2: Candidate Compensation
  candidatePayModel: PayModel | '';
  candidateFixedSalary: string;
  candidateHourlyRate: string;
  candidateBillRate: string;
  candidatePercentage: string;
  candidateHybridFixedSalary: string;
  candidatePayCycleMonth: string;
  candidateHybridBillRate: string;
  candidateHybridPercentage: string;
}

export function CreateUserPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    department: '',
    location: '',
    recruiterBaseSalary: '',
    recruiterPTO: '',
    recruiterCarryForward: false,
    recruiterMaxCarryForward: '',
    recruiterExcessDeduction: false,
    recruiterAutoHolidays: true,
    recruiterEffectiveMonth: '',
    recruiterBonusEnabled: false,
    recruiterBonusAmount: '',
    recruiterBonusFrequency: '',
    recruiterBonusStartMonth: '',
    recruiterBonusEndMonth: '',
    candidatePayModel: '',
    candidateFixedSalary: '',
    candidateHourlyRate: '',
    candidateBillRate: '',
    candidatePercentage: '',
    candidateHybridFixedSalary: '',
    candidatePayCycleMonth: '',
    candidateHybridBillRate: '',
    candidateHybridPercentage: ''
  });

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    alert('User created successfully!');
  };

  const canProceedToStep2 = formData.firstName && formData.lastName && formData.email && formData.role;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-glow-green">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gradient-premium">Create New User</h1>
              <p className="text-slate-400 mt-1">Add a new team member to your organization</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[280px_1fr] gap-8">
          {/* Progress Sidebar */}
          <div className="space-y-4">
            <div className="glass rounded-3xl p-6 border border-white/10 sticky top-8">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Progress</h3>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="relative">
                  <div className={`flex items-start gap-4 cursor-pointer ${currentStep === 1 ? 'opacity-100' : 'opacity-50'}`}
                    onClick={() => setCurrentStep(1)}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      currentStep === 1 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-glow-green' 
                        : 'glass border border-white/10'
                    }`}>
                      {currentStep > 1 ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <span className="text-white font-bold">1</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold mb-1 ${currentStep === 1 ? 'text-emerald-400' : 'text-slate-300'}`}>
                        Basic Details
                      </h4>
                      <p className="text-xs text-slate-500">Personal & contact info</p>
                    </div>
                  </div>
                  {currentStep === 2 && (
                    <div className="absolute left-5 top-12 bottom-0 w-px bg-gradient-to-b from-emerald-500 to-transparent" />
                  )}
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className={`flex items-start gap-4 ${currentStep === 2 ? 'opacity-100' : 'opacity-50'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      currentStep === 2 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-glow-green' 
                        : 'glass border border-white/10'
                    }`}>
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold mb-1 ${currentStep === 2 ? 'text-emerald-400' : 'text-slate-300'}`}>
                        Compensation
                      </h4>
                      <p className="text-xs text-slate-500">Salary & benefits setup</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Badge */}
              {formData.role && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="text-xs text-slate-500 mb-2">Selected Role</div>
                  <div className={`px-4 py-2 rounded-xl text-sm font-semibold text-center ${
                    formData.role === 'Admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                    formData.role === 'Recruiter' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {formData.role}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Form */}
          <div className="space-y-6">
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl p-8 shadow-xl animate-slide-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Basic Details</h2>
                </div>

                <div className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => updateField('firstName', e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => updateField('lastName', e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          placeholder="john.doe@company.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Temporary Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        placeholder="Enter temporary password"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">User will be prompted to change on first login</p>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      User Role <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                      <select
                        value={formData.role}
                        onChange={(e) => updateField('role', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none bg-white cursor-pointer"
                      >
                        <option value="">Select a role...</option>
                        <option value="Admin">Admin</option>
                        <option value="Recruiter">Recruiter</option>
                        <option value="Candidate">Candidate</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 rotate-90 pointer-events-none" />
                    </div>
                  </div>

                  {/* Department & Location */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Department
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={formData.department}
                          onChange={(e) => updateField('department', e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          placeholder="Engineering"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => updateField('location', e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          placeholder="New York, NY"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!canProceedToStep2}
                    className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                      canProceedToStep2
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Continue to Compensation
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Compensation Settings */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-slide-in">
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Compensation Settings</h2>
                  </div>

                  {/* No Role Selected */}
                  {!formData.role && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                        <Briefcase className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-700 mb-2">No Role Selected</h3>
                      <p className="text-slate-500 mb-4">Please select a user role in Step 1 to configure compensation</p>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        Go to Basic Details
                      </button>
                    </div>
                  )}

                  {/* Admin Role - No Compensation Needed */}
                  {formData.role === 'Admin' && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-700 mb-2">Admin Role Selected</h3>
                      <p className="text-slate-500">No compensation settings required for admin users</p>
                    </div>
                  )}

                  {/* Recruiter Compensation */}
                  {formData.role === 'Recruiter' && (
                    <div className="space-y-8">
                      {/* Base Compensation */}
                      <div className="border-2 border-blue-200 rounded-2xl p-6 bg-blue-50/50">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <DollarSign className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-800">Recruiter Compensation</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Base Monthly Salary
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
                              <input
                                type="number"
                                value={formData.recruiterBaseSalary}
                                onChange={(e) => updateField('recruiterBaseSalary', e.target.value)}
                                className="w-full pl-8 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                                placeholder="5000"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Monthly PTO Allocation
                            </label>
                            <div className="relative">
                              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input
                                type="number"
                                value={formData.recruiterPTO}
                                onChange={(e) => updateField('recruiterPTO', e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                                placeholder="2"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">days</span>
                            </div>
                          </div>
                        </div>

                        {/* PTO Settings */}
                        <div className="mt-6 space-y-4">
                          <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-slate-200">
                            <div className="flex items-center gap-3">
                              <Calendar className="w-5 h-5 text-blue-500" />
                              <div>
                                <div className="font-semibold text-slate-800">Carry-Forward Allowed</div>
                                <div className="text-xs text-slate-500">Allow unused PTO to roll over</div>
                              </div>
                            </div>
                            <button
                              onClick={() => updateField('recruiterCarryForward', !formData.recruiterCarryForward)}
                              className="relative"
                            >
                              {formData.recruiterCarryForward ? (
                                <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center justify-end px-1 transition-all">
                                  <div className="w-4 h-4 bg-white rounded-full" />
                                </div>
                              ) : (
                                <div className="w-12 h-6 bg-slate-300 rounded-full flex items-center justify-start px-1 transition-all">
                                  <div className="w-4 h-4 bg-white rounded-full" />
                                </div>
                              )}
                            </button>
                          </div>

                          {formData.recruiterCarryForward && (
                            <div className="ml-8 animate-slide-in">
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Max Carry-Forward Days
                              </label>
                              <input
                                type="number"
                                value={formData.recruiterMaxCarryForward}
                                onChange={(e) => updateField('recruiterMaxCarryForward', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                                placeholder="5"
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-slate-200">
                            <div className="flex items-center gap-3">
                              <TrendingUp className="w-5 h-5 text-blue-500" />
                              <div>
                                <div className="font-semibold text-slate-800">Excess PTO Deduction Enabled</div>
                                <div className="text-xs text-slate-500">Deduct from salary if PTO exceeded</div>
                              </div>
                            </div>
                            <button
                              onClick={() => updateField('recruiterExcessDeduction', !formData.recruiterExcessDeduction)}
                              className="relative"
                            >
                              {formData.recruiterExcessDeduction ? (
                                <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center justify-end px-1 transition-all">
                                  <div className="w-4 h-4 bg-white rounded-full" />
                                </div>
                              ) : (
                                <div className="w-12 h-6 bg-slate-300 rounded-full flex items-center justify-start px-1 transition-all">
                                  <div className="w-4 h-4 bg-white rounded-full" />
                                </div>
                              )}
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-slate-200">
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="w-5 h-5 text-blue-500" />
                              <div>
                                <div className="font-semibold text-slate-800">Apply Company Holidays Automatically</div>
                                <div className="text-xs text-slate-500">Auto-apply standard holidays</div>
                              </div>
                            </div>
                            <button
                              onClick={() => updateField('recruiterAutoHolidays', !formData.recruiterAutoHolidays)}
                              className="relative"
                            >
                              {formData.recruiterAutoHolidays ? (
                                <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center justify-end px-1 transition-all">
                                  <div className="w-4 h-4 bg-white rounded-full" />
                                </div>
                              ) : (
                                <div className="w-12 h-6 bg-slate-300 rounded-full flex items-center justify-start px-1 transition-all">
                                  <div className="w-4 h-4 bg-white rounded-full" />
                                </div>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="mt-6">
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Effective Start Month
                          </label>
                          <input
                            type="month"
                            value={formData.recruiterEffectiveMonth}
                            onChange={(e) => updateField('recruiterEffectiveMonth', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                          />
                        </div>
                      </div>

                      {/* Recurring Bonus */}
                      <div className="border-2 border-purple-200 rounded-2xl p-6 bg-purple-50/50">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500 rounded-lg">
                              <Award className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Recruiter Recurring Bonus</h3>
                          </div>
                          <button
                            onClick={() => updateField('recruiterBonusEnabled', !formData.recruiterBonusEnabled)}
                            className="relative"
                          >
                            {formData.recruiterBonusEnabled ? (
                              <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center justify-end px-1 transition-all">
                                <div className="w-4 h-4 bg-white rounded-full" />
                              </div>
                            ) : (
                              <div className="w-12 h-6 bg-slate-300 rounded-full flex items-center justify-start px-1 transition-all">
                                <div className="w-4 h-4 bg-white rounded-full" />
                              </div>
                            )}
                          </button>
                        </div>

                        {formData.recruiterBonusEnabled && (
                          <div className="space-y-6 animate-slide-in">
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  Bonus Amount
                                </label>
                                <div className="relative">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
                                  <input
                                    type="number"
                                    value={formData.recruiterBonusAmount}
                                    onChange={(e) => updateField('recruiterBonusAmount', e.target.value)}
                                    className="w-full pl-8 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                                    placeholder="1000"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  Bonus Frequency
                                </label>
                                <div className="relative">
                                  <select
                                    value={formData.recruiterBonusFrequency}
                                    onChange={(e) => updateField('recruiterBonusFrequency', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white appearance-none cursor-pointer"
                                  >
                                    <option value="">Select frequency...</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Quarterly">Quarterly</option>
                                    <option value="Yearly">Yearly</option>
                                  </select>
                                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 rotate-90 pointer-events-none" />
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  Bonus Start Month
                                </label>
                                <input
                                  type="month"
                                  value={formData.recruiterBonusStartMonth}
                                  onChange={(e) => updateField('recruiterBonusStartMonth', e.target.value)}
                                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  Bonus End Month <span className="text-slate-400">(Optional)</span>
                                </label>
                                <input
                                  type="month"
                                  value={formData.recruiterBonusEndMonth}
                                  onChange={(e) => updateField('recruiterBonusEndMonth', e.target.value)}
                                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Candidate Compensation */}
                  {formData.role === 'Candidate' && (
                    <div className="space-y-8">
                      {/* Pay Model Selection */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          Candidate Compensation Model
                        </label>
                        <div className="grid grid-cols-4 gap-4">
                          {(['Fixed', 'Hourly', 'Percentage', 'Hybrid'] as PayModel[]).map((model) => (
                            <button
                              key={model}
                              onClick={() => updateField('candidatePayModel', model)}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                formData.candidatePayModel === model
                                  ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-105'
                                  : 'border-slate-200 bg-white hover:border-emerald-300'
                              }`}
                            >
                              <div className={`w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                                formData.candidatePayModel === model
                                  ? 'bg-emerald-500'
                                  : 'bg-slate-200'
                              }`}>
                                {model === 'Fixed' && <DollarSign className={`w-5 h-5 ${formData.candidatePayModel === model ? 'text-white' : 'text-slate-500'}`} />}
                                {model === 'Hourly' && <Clock className={`w-5 h-5 ${formData.candidatePayModel === model ? 'text-white' : 'text-slate-500'}`} />}
                                {model === 'Percentage' && <Percent className={`w-5 h-5 ${formData.candidatePayModel === model ? 'text-white' : 'text-slate-500'}`} />}
                                {model === 'Hybrid' && <TrendingUp className={`w-5 h-5 ${formData.candidatePayModel === model ? 'text-white' : 'text-slate-500'}`} />}
                              </div>
                              <div className={`font-semibold text-sm ${
                                formData.candidatePayModel === model ? 'text-emerald-600' : 'text-slate-700'
                              }`}>
                                {model}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Fixed Model */}
                      {formData.candidatePayModel === 'Fixed' && (
                        <div className="border-2 border-emerald-200 rounded-2xl p-6 bg-emerald-50/50 animate-slide-in">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-500 rounded-lg">
                              <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Fixed Salary Model</h3>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Fixed Monthly Salary
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
                              <input
                                type="number"
                                value={formData.candidateFixedSalary}
                                onChange={(e) => updateField('candidateFixedSalary', e.target.value)}
                                className="w-full pl-8 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
                                placeholder="4000"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Hourly Model */}
                      {formData.candidatePayModel === 'Hourly' && (
                        <div className="border-2 border-blue-200 rounded-2xl p-6 bg-blue-50/50 animate-slide-in">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500 rounded-lg">
                              <Clock className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Hourly Rate Model</h3>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Hourly Rate
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
                              <input
                                type="number"
                                value={formData.candidateHourlyRate}
                                onChange={(e) => updateField('candidateHourlyRate', e.target.value)}
                                className="w-full pl-8 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                                placeholder="25"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">/hour</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Percentage Model */}
                      {formData.candidatePayModel === 'Percentage' && (
                        <div className="border-2 border-purple-200 rounded-2xl p-6 bg-purple-50/50 animate-slide-in">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-500 rounded-lg">
                              <Percent className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Percentage-Based Model</h3>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Client Bill Rate
                              </label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
                                <input
                                  type="number"
                                  value={formData.candidateBillRate}
                                  onChange={(e) => updateField('candidateBillRate', e.target.value)}
                                  className="w-full pl-8 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                                  placeholder="100"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">/hour</span>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Candidate Percentage (%)
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={formData.candidatePercentage}
                                  onChange={(e) => updateField('candidatePercentage', e.target.value)}
                                  className="w-full px-4 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                                  placeholder="65"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Hybrid Model */}
                      {formData.candidatePayModel === 'Hybrid' && (
                        <div className="border-2 border-orange-200 rounded-2xl p-6 bg-orange-50/50 animate-slide-in">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-500 rounded-lg">
                              <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Hybrid Compensation Model</h3>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Fixed Monthly Salary (Initial Period)
                              </label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
                                <input
                                  type="number"
                                  value={formData.candidateHybridFixedSalary}
                                  onChange={(e) => updateField('candidateHybridFixedSalary', e.target.value)}
                                  className="w-full pl-8 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
                                  placeholder="3000"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Pay Cycle Change Month
                              </label>
                              <input
                                type="month"
                                value={formData.candidatePayCycleMonth}
                                onChange={(e) => updateField('candidatePayCycleMonth', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
                              />
                              <p className="text-xs text-slate-500 mt-1">When to switch from fixed to percentage-based</p>
                            </div>

                            <div className="pt-4 border-t-2 border-orange-200">
                              <h4 className="font-semibold text-slate-700 mb-4">Percentage-Based Period (After Cycle Change)</h4>
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Client Bill Rate
                                  </label>
                                  <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
                                    <input
                                      type="number"
                                      value={formData.candidateHybridBillRate}
                                      onChange={(e) => updateField('candidateHybridBillRate', e.target.value)}
                                      className="w-full pl-8 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
                                      placeholder="100"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">/hour</span>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Candidate Percentage (%)
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="number"
                                      value={formData.candidateHybridPercentage}
                                      onChange={(e) => updateField('candidateHybridPercentage', e.target.value)}
                                      className="w-full px-4 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
                                      placeholder="70"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="bg-white rounded-3xl p-6 shadow-xl">
                  <div className="flex justify-between gap-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back to Basic Details
                    </button>

                    <button
                      onClick={handleSubmit}
                      className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Create User
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
