import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Shield,
  MapPinned,
  CalendarDays,
  Gavel,
  PartyPopper,
  Bike,
  Megaphone,
  Wallet,
  Receipt,
  Landmark,
  Tags,
  Settings,
  ScrollText,
  IdCard,
} from 'lucide-react';
import { PERMISSIONS } from '../lib/permissions';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  permission?: string[];
}

export interface NavGroup {
  label: string | null;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: null,
    items: [{ label: 'Visão geral', to: '/', icon: LayoutDashboard }],
  },
  {
    label: 'Pessoas',
    items: [
      { label: 'Membros', to: '/membros', icon: Users, permission: [PERMISSIONS.MEMBERS_READ] },
      { label: 'Prospects', to: '/prospects', icon: UserPlus, permission: [PERMISSIONS.PROSPECTS_READ] },
      { label: 'Cargos e permissões', to: '/cargos', icon: Shield, permission: [PERMISSIONS.ROLES_MANAGE] },
      { label: 'Regionais', to: '/regionais', icon: MapPinned, permission: [PERMISSIONS.CHAPTERS_MANAGE] },
    ],
  },
  {
    label: 'Atividades',
    items: [
      { label: 'Agenda', to: '/agenda', icon: CalendarDays },
      { label: 'Reuniões', to: '/reunioes', icon: Gavel, permission: [PERMISSIONS.MEETINGS_READ] },
      { label: 'Eventos', to: '/eventos', icon: PartyPopper, permission: [PERMISSIONS.EVENTS_READ] },
      { label: 'Comboios', to: '/comboios', icon: Bike, permission: [PERMISSIONS.CONVOYS_READ] },
    ],
  },
  {
    label: 'Financeiro',
    items: [
      { label: 'Visão geral', to: '/financeiro', icon: Wallet, permission: [PERMISSIONS.FINANCE_READ, PERMISSIONS.FINANCE_MANAGE] },
      { label: 'Mensalidades', to: '/financeiro/mensalidades', icon: Receipt, permission: [PERMISSIONS.FINANCE_READ, PERMISSIONS.FINANCE_MANAGE] },
      { label: 'Caixa', to: '/financeiro/caixa', icon: Landmark, permission: [PERMISSIONS.FINANCE_READ, PERMISSIONS.FINANCE_MANAGE] },
      { label: 'Categorias', to: '/financeiro/categorias', icon: Tags, permission: [PERMISSIONS.FINANCE_MANAGE] },
    ],
  },
  {
    label: 'Comunicação',
    items: [{ label: 'Comunicados', to: '/comunicados', icon: Megaphone, permission: [PERMISSIONS.ANNOUNCEMENTS_READ] }],
  },
  {
    label: 'Clube',
    items: [{ label: 'Minha carteirinha', to: '/carteirinha', icon: IdCard }],
  },
  {
    label: 'Administração',
    items: [
      { label: 'Configurações', to: '/configuracoes', icon: Settings, permission: [PERMISSIONS.SETTINGS_MANAGE] },
      { label: 'Auditoria', to: '/auditoria', icon: ScrollText, permission: [PERMISSIONS.AUDIT_READ] },
    ],
  },
];
