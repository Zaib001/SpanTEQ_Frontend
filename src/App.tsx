import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HomePage } from "./components/Public/HomePage";
import { LoginPage } from "./components/Public/LoginPage";
import { ResetPasswordPage } from "./components/Public/ResetPasswordPage";
import { PrivacyPolicy } from "./components/Public/PrivacyPolicy";
import { TermsAndConditions } from "./components/Public/TermsAndConditions";
import { AdminLayout } from "./components/Layout/AdminLayout";
import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { UsersPage } from "./components/Admin/UsersPage";
import { SubmissionsPage } from "./components/Admin/SubmissionsPage";
import { PTORequestsPage } from "./components/Admin/PTORequestsPage";
import { SalariesPage } from "./components/Admin/SalariesPage";
import { TimesheetsPage } from "./components/Admin/TimesheetsPage";
import { DocumentsPage } from "./components/Admin/DocumentsPage";
import { MessagesPage } from "./components/Admin/MessagesPage";
import { CustomBuilderPage } from "./components/Admin/CustomBuilderPage";
import { InterviewsPage } from "./components/Admin/InterviewsPage";
import { NewCandidatesPage } from "./components/Admin/NewCandidatesPage";
import { NewRecruitersPage } from "./components/Admin/NewRecruitersPage";
import { CompanyHolidays } from "./pages/Admin/CompanyHolidays.tsx";
import { DocumentRequests } from "./pages/Admin/DocumentRequests.tsx";
import { AIUsageLog } from "./pages/Admin/AIUsageLog.tsx";
import { CreateUserPage } from "./components/Admin/CreateUserPage";
import { FinanceLayout } from "./components/Finance/FinanceLayout";
import { FinanceDashboard } from "./components/Finance/FinanceDashboard";
import { RevenueLedger } from "./components/Finance/RevenueLedger";
import { ClientBillingProfiles } from "./components/Finance/ClientBillingProfiles";
import { Invoices } from "./components/Finance/Invoices";
import { InvoiceDetail } from "./components/Finance/InvoiceDetail";
import { Payments } from "./components/Finance/Payments";
import { RecruiterDashboard } from "./components/Recruiter/RecruiterDashboard";
import { RecruiterCandidates } from "./components/Recruiter/RecruiterCandidates";
import { RecruiterSubmissions } from "./components/Recruiter/RecruiterSubmissions";
import { RecruiterTimesheets } from "./components/Recruiter/RecruiterTimesheets";
import { RecruiterPTO } from "./components/Recruiter/RecruiterPTO";
import { CandidateDashboard } from "./components/Candidate/CandidateDashboard";
import { CandidateSubmissions } from "./components/Candidate/CandidateSubmissions";
import { CandidateTimesheet } from "./components/Candidate/CandidateTimesheet";
import { ProfilePage } from "./components/Shared/ProfilePage";
import { SettingsPage } from "./components/Shared/SettingsPage";
import "./styles/globals.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />
        <Route
          path="/terms-and-conditions"
          element={<TermsAndConditions />}
        />

        <Route path="/admin" element={<AdminLayout />}>
          <Route
            index
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />
          <Route path="users" element={<UsersPage />} />
          <Route
            path="submissions"
            element={<SubmissionsPage />}
          />
          <Route path="pto" element={<PTORequestsPage />} />
          <Route path="salaries" element={<SalariesPage />} />
          <Route
            path="timesheets"
            element={<TimesheetsPage />}
          />
          <Route path="documents" element={<DocumentsPage />} />
          <Route
            path="company-holidays"
            element={<CompanyHolidays />}
          />
          <Route
            path="document-requests"
            element={<DocumentRequests />}
          />
          <Route path="ai-usage" element={<AIUsageLog />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route
            path="custom-builder"
            element={<CustomBuilderPage />}
          />
          <Route
            path="test-custom"
            element={
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 9999,
                  backgroundColor: "lime",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h1
                  style={{ fontSize: "72px", color: "black" }}
                >
                  TEST ROUTE WORKS!
                </h1>
              </div>
            }
          />
          <Route
            path="interviews"
            element={<InterviewsPage />}
          />
          <Route
            path="new-candidates"
            element={<NewCandidatesPage />}
          />
          <Route
            path="new-recruiters"
            element={<NewRecruitersPage />}
          />
          <Route
            path="create-user"
            element={<CreateUserPage />}
          />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />

          {}
          <Route path="finance" element={<FinanceLayout />}>
            <Route index element={<FinanceDashboard />} />
            <Route
              path="revenue-ledger"
              element={<RevenueLedger />}
            />
            <Route
              path="client-billing-profiles"
              element={<ClientBillingProfiles />}
            />
            <Route path="invoices" element={<Invoices />} />
            <Route
              path="invoices/:id"
              element={<InvoiceDetail />}
            />
            <Route path="payments" element={<Payments />} />
          </Route>
        </Route>

        {}
        <Route path="/recruiter" element={<AdminLayout />}>
          <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="candidates" element={<RecruiterCandidates />} />
          <Route path="submissions" element={<RecruiterSubmissions />} />
          <Route path="timesheets" element={<RecruiterTimesheets />} />
          <Route path="timesheets" element={<RecruiterTimesheets />} />
          <Route path="pto" element={<RecruiterPTO />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {}
        <Route path="/candidate" element={<AdminLayout />}>
          <Route index element={<Navigate to="/candidate/dashboard" replace />} />
          <Route path="dashboard" element={<CandidateDashboard />} />
          <Route path="submissions" element={<CandidateSubmissions />} />
          <Route path="submissions" element={<CandidateSubmissions />} />
          <Route path="timesheet" element={<CandidateTimesheet />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}