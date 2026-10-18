import { useParams } from 'react-router';
import { css } from 'styled-system/css';
import { Printer } from 'lucide-react';
import { Button } from '../../design-system/Button';
import { Spinner } from '../../design-system/Spinner';
import { useEmergencySheet } from '../../features/convoys/hooks';
import { apiErrorMessage } from '../../lib/errors';
import { formatDateTime } from '../../lib/format';

export function EmergencySheetPage() {
  const { id = '' } = useParams();
  const sheet = useEmergencySheet(id, Boolean(id));

  return (
    <div className={css({ bg: 'white', color: '#181A1C', minH: '100dvh', p: '8', '@media print': { p: '0' } })}>
      <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '4', '@media print': { display: 'none' } })}>
        <p className={css({ fontSize: '13px', color: '#686D70' })}>Dado sensível: guarde a folha impressa com o capitão e descarte depois do comboio.</p>
        <Button onClick={() => window.print()}>
          <Printer size={16} /> Imprimir
        </Button>
      </div>
      {sheet.isLoading ? (
        <Spinner />
      ) : sheet.isError ? (
        <p role="alert">{apiErrorMessage(sheet.error, 'Não foi possível carregar a ficha.')}</p>
      ) : sheet.data ? (
        <>
          <h1 className={css({ fontSize: '24px', fontWeight: '800', mb: '1' })}>Ficha de emergência — comboio</h1>
          <p className={css({ fontSize: '13px', mb: '4' })}>
            Saída {formatDateTime(sheet.data.departureAt)} · gerada em {formatDateTime(sheet.data.generatedAt)}
          </p>
          <table className={css({ width: '100%', borderCollapse: 'collapse', fontSize: '13px' })}>
            <thead>
              <tr>
                {['Membro', 'Telefone', 'Sangue', 'Contato de emergência', 'Moto'].map((h) => (
                  <th key={h} className={css({ textAlign: 'left', borderBottom: '2px solid #181A1C', p: '2' })}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sheet.data.participants.map((p) => (
                <tr key={p.participantId}>
                  <td className={css({ p: '2', borderBottom: '1px solid #D5D1C9', fontWeight: '700' })}>
                    {p.member.nickname ?? p.member.fullName}
                    <div className={css({ fontWeight: '400', color: '#686D70' })}>{p.member.fullName}</div>
                  </td>
                  <td className={css({ p: '2', borderBottom: '1px solid #D5D1C9' })}>{p.member.phone ?? '—'}</td>
                  <td className={css({ p: '2', borderBottom: '1px solid #D5D1C9', fontWeight: '800' })}>{p.member.bloodType ?? '—'}</td>
                  <td className={css({ p: '2', borderBottom: '1px solid #D5D1C9' })}>
                    {p.member.emergencyContactName ?? '—'}
                    <div>{p.member.emergencyContactPhone ?? ''}</div>
                  </td>
                  <td className={css({ p: '2', borderBottom: '1px solid #D5D1C9' })}>
                    {p.motorcycle ? [p.motorcycle.brand, p.motorcycle.model, p.motorcycle.color].filter(Boolean).join(' ') : '—'}
                    <div>{p.motorcycle?.licensePlate ?? ''}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
    </div>
  );
}
