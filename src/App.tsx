import { Routes, Route } from 'react-router';
import { Toaster } from './design-system/Toaster';

import { LoginPage } from './routes/auth/LoginPage';
import { SignupClubPage } from './routes/auth/SignupClubPage';
import { SelectClubPage } from './routes/auth/SelectClubPage';
import { ForgotPasswordPage } from './routes/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './routes/auth/ResetPasswordPage';
import { AdminEmailsPage } from './routes/admin/AdminEmailsPage';
import { CheckInModePage } from './routes/check-in/CheckInModePage';
import { CheckInScanPage } from './routes/check-in/CheckInScanPage';
import { EmergencySheetPage } from './routes/convoys/EmergencySheetPage';
import { EmailPreferencesPage } from './routes/auth/EmailPreferencesPage';
import { InvitesPage } from './routes/invites/InvitesPage';
import { AcceptInvitePage } from './routes/auth/AcceptInvitePage';
import { PrivacyPolicyPage } from './routes/legal/PrivacyPolicyPage';
import { ChildSafetyPage } from './routes/legal/ChildSafetyPage';
import { RequireAuth } from './routes/RequireAuth';
import { RequireClub } from './routes/RequireClub';
import { AppShell } from './layout/AppShell';

import { DashboardPage } from './routes/DashboardPage';
import { MembersListPage } from './routes/members/MembersListPage';
import { MemberDetailPage } from './routes/members/MemberDetailPage';
import { ProspectsPage } from './routes/members/ProspectsPage';
import { RolesPage } from './routes/roles/RolesPage';
import { TitlesPage } from './routes/titles/TitlesPage';
import { ChaptersPage } from './routes/chapters/ChaptersPage';
import { AgendaPage } from './routes/agenda/AgendaPage';
import { MeetingsListPage } from './routes/meetings/MeetingsListPage';
import { MeetingDetailPage } from './routes/meetings/MeetingDetailPage';
import { EventsListPage } from './routes/events/EventsListPage';
import { EventDetailPage } from './routes/events/EventDetailPage';
import { ConvoysListPage } from './routes/convoys/ConvoysListPage';
import { ConvoyDetailPage } from './routes/convoys/ConvoyDetailPage';
import { FinanceOverviewPage } from './routes/finance/FinanceOverviewPage';
import { ChargesPage } from './routes/finance/ChargesPage';
import { TransactionsPage } from './routes/finance/TransactionsPage';
import { CategoriesPage } from './routes/finance/CategoriesPage';
import { AnnouncementsPage } from './routes/announcements/AnnouncementsPage';
import { MembershipCardPage } from './routes/membership-card/MembershipCardPage';
import { SettingsPage } from './routes/settings/SettingsPage';
import { AuditPage } from './routes/audit/AuditPage';
import { NovidadesPage } from './routes/novidades/NovidadesPage';
import { NotFoundPage } from './routes/NotFoundPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/entrar" element={<LoginPage />} />
        <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
        <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
        <Route path="/preferencias-email" element={<EmailPreferencesPage />} />
        <Route path="/criar-clube" element={<SignupClubPage />} />
        <Route path="/convite/:code" element={<AcceptInvitePage />} />
        <Route path="/privacidade" element={<PrivacyPolicyPage />} />
        <Route path="/seguranca-infantil" element={<ChildSafetyPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/selecionar-clube" element={<SelectClubPage />} />

          <Route element={<RequireClub />}>
            <Route path="/check-in" element={<CheckInScanPage />} />
            <Route path="/check-in-modo/:type/:id" element={<CheckInModePage />} />
            <Route path="/comboios/:id/emergencia" element={<EmergencySheetPage />} />
            <Route element={<AppShell />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/membros" element={<MembersListPage />} />
              <Route path="/membros/:id" element={<MemberDetailPage />} />
              <Route path="/admin/emails" element={<AdminEmailsPage />} />
              <Route path="/convites" element={<InvitesPage />} />
              <Route path="/prospects" element={<ProspectsPage />} />
              <Route path="/cargos" element={<RolesPage />} />
              <Route path="/titulos" element={<TitlesPage />} />
              <Route path="/regionais" element={<ChaptersPage />} />
              <Route path="/agenda" element={<AgendaPage />} />
              <Route path="/reunioes" element={<MeetingsListPage />} />
              <Route path="/reunioes/:id" element={<MeetingDetailPage />} />
              <Route path="/eventos" element={<EventsListPage />} />
              <Route path="/eventos/:id" element={<EventDetailPage />} />
              <Route path="/comboios" element={<ConvoysListPage />} />
              <Route path="/comboios/:id" element={<ConvoyDetailPage />} />
              <Route path="/financeiro" element={<FinanceOverviewPage />} />
              <Route path="/financeiro/mensalidades" element={<ChargesPage />} />
              <Route path="/financeiro/caixa" element={<TransactionsPage />} />
              <Route path="/financeiro/categorias" element={<CategoriesPage />} />
              <Route path="/comunicados" element={<AnnouncementsPage />} />
              <Route path="/carteirinha" element={<MembershipCardPage />} />
              <Route path="/configuracoes" element={<SettingsPage />} />
              <Route path="/auditoria" element={<AuditPage />} />
              <Route path="/novidades" element={<NovidadesPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
