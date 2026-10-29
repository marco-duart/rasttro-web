// Permissões em português para a tela de cargos: um rótulo curto e uma linha do que cada uma libera.
// O código técnico (members.read...) fica só no servidor; uma permissão nova sem tradução aparece pelo código.
export const permissionGroupLabel: Record<string, string> = {
  members: 'Membros',
  prospects: 'Prospects',
  finance: 'Financeiro',
  meetings: 'Reuniões',
  events: 'Eventos',
  convoys: 'Comboios',
  announcements: 'Comunicados',
  documents: 'Documentos',
  chapters: 'Regionais',
  roles: 'Cargos',
  titles: 'Títulos',
  settings: 'Configurações',
  subscription: 'Assinatura',
  audit: 'Auditoria',
};

export const permissionInfo: Record<string, { label: string; description: string }> = {
  'members.read': { label: 'Ver membros', description: 'Consulta o quadro de membros e as fichas.' },
  'members.manage': { label: 'Gerenciar membros', description: 'Cadastra, edita, muda estágio e desliga membros.' },
  'members.private_data.read': { label: 'Ver dados pessoais', description: 'Vê telefone, e-mail, nascimento e dados de emergência.' },
  'prospects.read': { label: 'Ver prospects', description: 'Acompanha o funil de convidados e aspirantes.' },
  'prospects.manage': { label: 'Gerenciar prospects', description: 'Convida pessoas e move os prospects no funil.' },
  'prospects.approve': { label: 'Aprovar prospects', description: 'Aprova a entrada de um prospect como membro.' },
  'finance.read_own': { label: 'Ver a própria mensalidade', description: 'Cada membro vê só as suas cobranças.' },
  'finance.read': { label: 'Ver o financeiro', description: 'Vê mensalidades, caixa e categorias de todos.' },
  'finance.manage': { label: 'Gerenciar o financeiro', description: 'Registra pagamentos, isenta cobranças e lança no caixa.' },
  'finance.close_period': { label: 'Fechar o período do caixa', description: 'Fecha o mês e impede alterações depois.' },
  'meetings.read': { label: 'Ver reuniões', description: 'Consulta reuniões, pautas e atas publicadas.' },
  'meetings.manage': { label: 'Gerenciar reuniões', description: 'Convoca reuniões e registra presença e decisões.' },
  'meetings.minutes.manage': { label: 'Gerenciar atas', description: 'Escreve e publica a ata das reuniões.' },
  'events.read': { label: 'Ver eventos', description: 'Consulta eventos e as confirmações.' },
  'events.manage': { label: 'Gerenciar eventos', description: 'Cria, edita e cancela eventos.' },
  'convoys.read': { label: 'Ver comboios', description: 'Consulta comboios, paradas e participantes.' },
  'convoys.manage': { label: 'Gerenciar comboios', description: 'Monta comboios, define papéis e abre a ficha de emergência.' },
  'announcements.read': { label: 'Ver comunicados', description: 'Lê os comunicados do clube.' },
  'announcements.manage': { label: 'Gerenciar comunicados', description: 'Publica e remove comunicados.' },
  'documents.read': { label: 'Ver documentos', description: 'Consulta os documentos do clube.' },
  'documents.manage': { label: 'Gerenciar documentos', description: 'Envia e remove documentos.' },
  'chapters.manage': { label: 'Gerenciar regionais', description: 'Cria e edita as regionais do clube.' },
  'roles.manage': { label: 'Gerenciar cargos', description: 'Cria cargos, edita permissões e atribui cargos.' },
  'titles.manage': { label: 'Gerenciar títulos', description: 'Cria títulos e concede ou retira de membros.' },
  'settings.manage': { label: 'Gerenciar configurações', description: 'Altera identidade, dados de pagamento e estágios do clube.' },
  'subscription.read': { label: 'Ver a assinatura', description: 'Vê o plano e a situação da assinatura do clube.' },
  'audit.read': { label: 'Ver a auditoria', description: 'Consulta quem fez cada ação sensível.' },
};

export const permissionLabel = (permission: string) => permissionInfo[permission]?.label ?? permission;
export const permissionGroup = (group: string) => permissionGroupLabel[group] ?? group;
