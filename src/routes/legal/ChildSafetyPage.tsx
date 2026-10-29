import { ContactEmail, LegalLayout, LegalSection } from './LegalLayout';
import { legalLink, legalList, legalText } from './legalStyles';

export function ChildSafetyPage() {
  return (
    <LegalLayout title="Normas de Segurança Infantil" updatedAt="29 de outubro de 2026">
      <LegalSection title="1. Nosso compromisso">
        <p className={legalText}>
          O Rasttro, operado pela Maaxis (CNPJ 61.580.959/0001-38), tem tolerância zero com abuso e exploração sexual
          infantil (AESI). Isso inclui qualquer conteúdo ou comportamento que explore sexualmente, abuse ou coloque em
          perigo crianças e adolescentes, como material de abuso sexual infantil (CSAM), aliciamento de menores,
          extorsão sexual e tráfico para fins sexuais.
        </p>
      </LegalSection>

      <LegalSection title="2. Onde estas normas valem">
        <p className={legalText}>
          Valem para o aplicativo Rasttro e para o painel web, e para todo conteúdo enviado por quem usa o serviço: fotos
          de perfil, logo e capa do clube, comunicados, pautas e atas de reunião, descrições de eventos e comboios e
          observações da ficha.
        </p>
        <ul className={legalList}>
          <li>O Rasttro é destinado a maiores de 18 anos.</li>
          <li>
            Não há cadastro aberto, chat com desconhecidos nem perfis públicos: a pessoa só entra por convite de um
            motoclube e só vê os membros do próprio clube.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. O que é proibido">
        <ul className={legalList}>
          <li>Publicar, armazenar, pedir ou compartilhar material de abuso sexual infantil, de qualquer tipo.</li>
          <li>Conteúdo que sexualize crianças ou adolescentes, inclusive desenhos, montagens ou imagens geradas por IA.</li>
          <li>Usar o serviço para aliciar, assediar, ameaçar ou extorquir menores, ou para combinar encontros com eles.</li>
          <li>Facilitar tráfico ou qualquer forma de exploração de crianças e adolescentes.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Como denunciar">
        <p className={legalText}>
          Envie a denúncia para <ContactEmail /> com o assunto "Denúncia – segurança infantil". Diga o nome do clube, o
          que viu e onde (tela, comunicado, foto) e, se puder, a data. Não anexe o material ilegal: a descrição basta para
          localizarmos o conteúdo.
        </p>
        <p className={legalText}>Se uma criança estiver em perigo agora, procure as autoridades antes:</p>
        <ul className={legalList}>
          <li>Polícia Militar: 190.</li>
          <li>Disque Direitos Humanos: 100 (gratuito, 24 horas).</li>
          <li>
            SaferNet Brasil, denúncia anônima de crimes na internet:{' '}
            <a className={legalLink} href="https://new.safernet.org.br/denuncie" target="_blank" rel="noreferrer">
              new.safernet.org.br/denuncie
            </a>
            .
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. O que fazemos com uma denúncia">
        <ul className={legalList}>
          <li>Analisamos com prioridade, assim que a denúncia chega.</li>
          <li>Removemos o conteúdo e bloqueamos o acesso das contas envolvidas.</li>
          <li>
            Preservamos os registros necessários à investigação, como determina a lei, e comunicamos o caso às autoridades
            competentes (Polícia Federal e Ministério Público).
          </li>
          <li>Colaboramos com as autoridades sempre que solicitado, nos termos da lei.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Leis que seguimos">
        <p className={legalText}>
          Cumprimos a legislação brasileira de proteção à criança e ao adolescente, em especial o Estatuto da Criança e do
          Adolescente (Lei 8.069/1990, arts. 240 a 241-E), o Marco Civil da Internet (Lei 12.965/2014) e a Lei Geral de
          Proteção de Dados (Lei 13.709/2018), além das políticas do Google Play e da App Store.
        </p>
      </LegalSection>

      <LegalSection title="7. Contato de segurança infantil">
        <p className={legalText}>
          Maaxis, responsável pelo Rasttro: <ContactEmail />. Este é o canal para denúncias e para autoridades sobre
          segurança infantil.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
