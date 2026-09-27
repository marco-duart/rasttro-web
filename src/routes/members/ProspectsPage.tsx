import { useNavigate } from 'react-router';
import { css } from 'styled-system/css';
import { Flex } from 'styled-system/jsx';
import { UserPlus } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Avatar } from '../../design-system/Avatar';
import { Spinner } from '../../design-system/Spinner';
import { EmptyState } from '../../design-system/EmptyState';
import { useMembershipStages } from '../../features/membership-stages/hooks';
import { useMembers } from '../../features/members/hooks';
import type { MembershipStage } from '../../api/types';

function ProspectColumn({ stage }: { stage: MembershipStage }) {
  const navigate = useNavigate();
  const { data, isLoading } = useMembers({ membershipStageId: stage.id, pageSize: 50, status: 'ACTIVE' });

  return (
    <div className={css({ minW: '280px', flex: '1' })}>
      <Flex align="center" justify="space-between" mb="3">
        <h3 className={css({ textStyle: 'label', color: 'text.muted', textTransform: 'uppercase' })}>{stage.name}</h3>
        <span className={css({ textStyle: 'caption', color: 'text.muted' })}>{data?.meta.total ?? '—'}</span>
      </Flex>
      <Flex direction="column" gap="2">
        {isLoading ? (
          <Spinner size={20} />
        ) : (
          data?.data.map((member) => (
            <Card
              key={member.id}
              onClick={() => navigate(`/membros/${member.id}`)}
              className={css({ p: '3', cursor: 'pointer', _hover: { borderColor: 'brand' } })}
            >
              <Flex align="center" gap="2">
                <Avatar name={member.fullName} photoUrl={member.photoUrl} size={28} />
                <div className={css({ minW: 0 })}>
                  <p className={css({ fontWeight: '600', fontSize: '14px', truncate: true })}>{member.fullName}</p>
                  <p className={css({ textStyle: 'caption', color: 'text.muted' })}>desde {new Date(member.joinedAt ?? '').toLocaleDateString('pt-BR')}</p>
                </div>
              </Flex>
            </Card>
          ))
        )}
        {!isLoading && data?.data.length === 0 && <p className={css({ textStyle: 'caption', color: 'text.muted' })}>Ninguém neste estágio.</p>}
      </Flex>
    </div>
  );
}

export function ProspectsPage() {
  const { data: stages, isLoading } = useMembershipStages();
  const prospectStages = stages?.filter((s) => s.isProspectStage) ?? [];

  return (
    <div>
      <PageHeader title="Prospects" description="Acompanhe o ciclo de ingresso — de convidado a membro efetivo." />
      {isLoading ? (
        <Spinner />
      ) : prospectStages.length === 0 ? (
        <EmptyState icon={<UserPlus size={32} />} title="Nenhum estágio de prospecção configurado" description="Configure os estágios em Configurações do clube." />
      ) : (
        <Flex gap="4" overflowX="auto" pb="2">
          {prospectStages.map((stage) => (
            <ProspectColumn key={stage.id} stage={stage} />
          ))}
        </Flex>
      )}
    </div>
  );
}
