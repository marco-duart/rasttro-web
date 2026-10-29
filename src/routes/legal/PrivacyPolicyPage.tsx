import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router';
import { css, cx } from 'styled-system/css';
import { AuthBrandMark } from '../../design-system/AuthBrandMark';
import { Card } from '../../design-system/Card';

const CONTACT_EMAIL = 'maaxis.tech@gmail.com';
const UPDATED_AT = '29 de outubro de 2026';

const section = css({ display: 'flex', flexDirection: 'column', gap: '3', '& + &': { mt: '8' } });
const heading = css({ textStyle: 'h3' });
const text = css({ textStyle: 'body', color: 'text.muted' });
const list = css({ textStyle: 'body', color: 'text.muted', pl: '5', listStyle: 'disc', display: 'flex', flexDirection: 'column', gap: '2' });
const link = css({ color: 'brand', fontWeight: '600', _hover: { textDecoration: 'underline' } });
const cell = css({ textAlign: 'left', verticalAlign: 'top', p: '3', borderBottom: '1px solid', borderColor: 'border' });

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={section}>
      <h2 className={heading}>{title}</h2>
      {children}
    </section>
  );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className={css({ overflowX: 'auto' })}>
      <table className={css({ width: '100%', borderCollapse: 'collapse', textStyle: 'bodySm', minW: '560px' })}>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} className={cx(cell, css({ fontWeight: '600' }))}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((value, i) => (
                <td key={i} className={cx(cell, css({ color: i === 0 ? 'inherit' : 'text.muted' }))}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Email = () => <a className={link} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = 'Política de Privacidade — Rasttro';
  }, []);

  return (
    <div
      className={css({
        minH: '100dvh',
        p: { base: '4', md: '8' },
        bg: 'canvas',
        backgroundImage:
          'radial-gradient(ellipse 800px 500px at 50% -10%, color-mix(in srgb, var(--colors-brand) 12%, transparent), transparent)',
      })}
    >
      <div className={css({ width: '100%', maxW: '820px', mx: 'auto' })}>
        <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '8' })}>
          <AuthBrandMark />
          <Link to="/entrar" className={css({ textStyle: 'bodySm', color: 'text.muted', _hover: { color: 'brand' } })}>
            Entrar
          </Link>
        </div>

        <Card className={css({ p: { base: '5', md: '9' } })}>
          <h1 className={css({ textStyle: 'h1', mb: '2' })}>Política de Privacidade</h1>
          <p className={css({ textStyle: 'bodySm', color: 'text.muted', mb: '8' })}>
            Rasttro (app e painel web) · Última atualização: {UPDATED_AT}
          </p>

          <Section title="1. Quem somos">
            <p className={text}>
              O Rasttro é um sistema de gestão para motoclubes, com o aplicativo para os integrantes e o painel web para a
              diretoria. Ele é operado pela Maaxis, CNPJ 61.580.959/0001-38, que segue a Lei Geral de Proteção de Dados
              (Lei 13.709/2018, LGPD).
            </p>
            <ul className={list}>
              <li>Dados da sua conta de acesso (e-mail e senha): a Maaxis é a controladora.</li>
              <li>
                Dados da ficha de membro cadastrados e geridos pelo motoclube: o clube é o controlador, e a Maaxis trata
                esses dados apenas para prestar o serviço ao clube (operadora).
              </li>
            </ul>
            <p className={text}>
              Contato para assuntos de privacidade e pedidos de titulares: <Email />.
            </p>
          </Section>

          <Section title="2. Dados que tratamos">
            <Table
              head={['Dado', 'Para quê', 'Base legal']}
              rows={[
                ['Conta: e-mail, senha (guardada só como hash) e data do último acesso', 'Criar a conta e autenticar o acesso', 'Execução de contrato'],
                ['Ficha de membro: nome, apelido, foto, telefone, e-mail, data de nascimento, data de entrada, número de membro, estágio, cargos, títulos, regional e observações da diretoria', 'Gestão do quadro de membros pelo clube', 'Definida pelo clube (controlador)'],
                ['Dados de emergência: tipo sanguíneo e contato de emergência (nome e telefone)', 'Ficha de emergência usada nos passeios e comboios', 'Proteção da vida e da incolumidade física (LGPD, art. 11, II, "e"); o preenchimento é opcional'],
                ['Motos: marca, modelo, ano, cor, placa e apelido', 'Carteirinha, comboios e ficha de emergência', 'Definida pelo clube (controlador)'],
                ['Participação: presenças em reuniões, respostas a eventos, check-in e chegada em comboios, leitura de comunicados', 'Agenda, comboios e comunicados do clube', 'Definida pelo clube (controlador)'],
                ['Financeiro: mensalidades, pagamentos registrados pela diretoria e lançamentos de caixa', 'Gestão financeira do clube', 'Definida pelo clube (controlador)'],
                ['Aparelho: token de notificação e preferências de aviso', 'Enviar notificações no celular', 'Execução de contrato'],
                ['Dados técnicos: endereço IP e navegador ou aparelho, nas sessões e no registro de auditoria', 'Segurança, prevenção a fraude e rastreio de ações no clube', 'Legítimo interesse'],
                ['E-mails enviados: destinatário, entrega e descadastramentos', 'Convites, redefinição de senha e avisos do clube', 'Execução de contrato e legítimo interesse'],
              ]}
            />
            <p className={text}>
              O Rasttro não processa pagamentos: as mensalidades são pagas diretamente ao clube (por exemplo, por PIX) e a
              diretoria registra o pagamento no sistema.
            </p>
          </Section>

          <Section title="3. Permissões do aplicativo">
            <ul className={list}>
              <li>Câmera: ler o QR de check-in e tirar a foto do perfil. Usada só quando você abre essas funções.</li>
              <li>Fotos: escolher a foto do perfil.</li>
              <li>Notificações: avisos de comunicados, eventos, comboios e mensalidades. Você escolhe quais receber.</li>
            </ul>
            <p className={text}>
              O app não coleta a localização do aparelho. Os endereços de eventos e pontos de encontro são cadastrados pela
              diretoria.
            </p>
          </Section>

          <Section title="4. Quem vê seus dados dentro do clube">
            <ul className={list}>
              <li>Os membros do clube veem nome, apelido, foto, cargos, títulos e regional uns dos outros.</li>
              <li>
                Telefone, e-mail, data de nascimento, tipo sanguíneo, contato de emergência, placa da moto e observações só
                aparecem para você e para quem tem, no clube, a permissão de ver dados pessoais.
              </li>
              <li>A abertura da ficha de emergência de um comboio fica registrada na auditoria do clube.</li>
              <li>Cada clube só acessa os próprios dados. Quem é desligado perde o acesso ao clube.</li>
            </ul>
          </Section>

          <Section title="5. Com quem compartilhamos">
            <p className={text}>
              Não vendemos dados nem os usamos para publicidade, e o Rasttro não tem ferramentas de rastreamento ou de
              análise de terceiros. Usamos fornecedores para operar o serviço, que só tratam os dados para essa finalidade:
            </p>
            <Table
              head={['Fornecedor', 'Para quê', 'Localização']}
              rows={[
                ['Cloudinary', 'Guardar fotos de perfil e imagens do clube (logo e capa)', 'Estados Unidos'],
                ['Expo e Google (Firebase Cloud Messaging)', 'Entregar notificações no celular', 'Estados Unidos'],
                ['Vercel', 'Hospedar o painel web', 'Estados Unidos'],
                ['Provedor de e-mail (SMTP)', 'Enviar convites, redefinição de senha e avisos', 'Brasil ou exterior'],
                ['Provedor de nuvem', 'Servidores da API e do banco de dados', 'Brasil ou exterior'],
              ]}
            />
            <p className={text}>
              Quando um fornecedor fica fora do Brasil, a transferência internacional segue o art. 33 da LGPD, com cláusulas
              contratuais e medidas de segurança adequadas.
            </p>
          </Section>

          <Section title="6. Armazenamento no aparelho">
            <p className={text}>
              O painel web guarda no navegador o token de sessão, o clube selecionado e o tema escolhido. O app guarda a
              sessão no armazenamento seguro do aparelho e as preferências de tela no armazenamento local. Não usamos cookies
              de publicidade nem de rastreamento.
            </p>
          </Section>

          <Section title="7. Por quanto tempo guardamos">
            <ul className={list}>
              <li>Os dados da conta ficam guardados enquanto a conta existir.</li>
              <li>
                Ao ser desligado, o membro perde o acesso, e o clube mantém a ficha como histórico do quadro. Pagamentos e
                lançamentos do caixa ficam guardados pelo tempo exigido em lei.
              </li>
              <li>
                Para excluir sua conta, peça pelo e-mail <Email />, a partir do endereço cadastrado. Respondemos em até 15
                dias. Apagamos a conta e os dados de acesso; os registros que o clube precisa manter por obrigação legal são
                anonimizados.
              </li>
            </ul>
          </Section>

          <Section title="8. Seus direitos">
            <p className={text}>
              Você pode pedir a confirmação de que tratamos seus dados, acesso, correção, portabilidade, anonimização,
              bloqueio ou eliminação, informações sobre compartilhamento e a revogação do consentimento. Boa parte dos dados
              da ficha pode ser corrigida por você mesmo no app (Perfil e Motos). Para dados geridos pelo clube, fale também
              com a diretoria. Pedidos pelo e-mail <Email />. Você também pode reclamar à Autoridade Nacional de Proteção de
              Dados (ANPD).
            </p>
          </Section>

          <Section title="9. Segurança">
            <p className={text}>
              Usamos conexão criptografada (HTTPS), senhas com hash, isolamento dos dados entre clubes, permissões por cargo,
              registro de auditoria e encerramento das sessões de quem é desligado. Nenhum sistema é 100% seguro; em caso de
              incidente relevante, avisaremos os afetados e a ANPD, como manda a lei.
            </p>
          </Section>

          <Section title="10. Menores de idade">
            <p className={text}>O Rasttro não é direcionado a menores de 18 anos.</p>
          </Section>

          <Section title="11. Alterações">
            <p className={text}>
              Podemos atualizar esta Política. A data da versão em vigor aparece no topo desta página, e mudanças relevantes
              serão avisadas no app ou no painel.
            </p>
          </Section>
        </Card>
      </div>
    </div>
  );
}
