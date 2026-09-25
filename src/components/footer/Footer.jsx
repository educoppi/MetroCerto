import React from "react";
import "./Footer.css";

/**
 * Footer
 * ============================================================
 * Rodapé flexível, pensado para manutenção fácil.
 *
 * PRINCÍPIO DO ARQUIVO:
 * Cada seção (contato, links rápidos, redes sociais, legal) é
 * uma LISTA (array). Isso significa que adicionar ou remover um
 * item é só editar essa lista — você nunca precisa tocar em mais
 * de um lugar do JSX. Não existe nenhum campo "solto" (tipo
 * `phone`, `email`, `address` como props separadas) que precise
 * ser removido em vários pontos diferentes do arquivo.
 *
 * COMO ADICIONAR/REMOVER COISAS:
 *
 * 1) Quer tirar o e-mail do rodapé?
 *    -> Vá em `defaultContactItems` e apague o objeto do e-mail.
 *       Não precisa mexer em mais nada.
 *
 * 2) Quer adicionar "WhatsApp" no contato?
 *    -> Adicione um novo objeto em `defaultContactItems`:
 *       { label: "WhatsApp", value: "(16) 99999-0000", href: "https://wa.me/5516999990000" }
 *
 * 3) Quer tirar as redes sociais inteiras?
 *    -> Passe socialLinks={[]} ao usar o componente, ou deixe
 *       `defaultSocialLinks` vazio. A coluna some sozinha, pois
 *       ela só renderiza se a lista tiver algo.
 *
 * 4) Quer tirar a coluna de contato inteira?
 *    -> Passe contactItems={[]}. A coluna some, sem quebrar nada,
 *       porque a renderização checa o tamanho da lista antes.
 *
 * 5) Quer adicionar uma nova coluna (ex: "Formas de pagamento")?
 *    -> Use o componente LinksColumn de novo, com outro título e
 *       outra lista de links. Cada coluna é independente.
 *
 * Nenhuma dessas mudanças quebra o restante do arquivo, porque:
 * - Toda lista é validada com Array.isArray antes de usar .map.
 * - Toda seção só renderiza quando a lista tem itens.
 * - Nenhuma variável é usada em um lugar e declarada em outro.
 * ============================================================
 */

// ---------- Dados padrão (edite livremente) ----------

const defaultQuickLinks = [
  { label: "ESTOQUE", href: "/estoque" },
  { label: "INFO", href: "/info" },
  { label: "ACOMPANHAMENTO", href: "/acompanhamento" },
  { label: "CADASTRAR", href: "/cadastrar-tecido" },
];

const defaultContactItems = [
  // Vazio por padrão. Exemplo de como adicionar um item:
  // { label: "Telefone", value: "(16) 0000-0000", href: "tel:+551600000000" },
  // { label: "E-mail", value: "contato@empresa.com", href: "mailto:contato@empresa.com" },
];

const defaultSocialLinks = [
  // Vazio por padrão. Exemplo de como adicionar um item:
  // { label: "Instagram", href: "https://instagram.com" },
];

const defaultLegalLinks = [
  { label: "Política de Privacidade", href: "/privacidade" },
  { label: "Termos de Uso", href: "/termos" },
];

// ---------- Helper ----------

function toSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

// ---------- Subcomponentes (cada um cuida só da própria seção) ----------

function BrandMark({ companyName, logoSrc }) {
  if (logoSrc) {
    return (
      <img
        src={logoSrc}
        alt={`Logotipo de ${companyName}`}
        className="footer__logo"
      />
    );
  }
  return <span className="footer__logo-fallback">{companyName}</span>;
}

function LinksColumn({ title, links }) {
  const items = toSafeArray(links);
  if (items.length === 0) return null;

  return (
    <nav className="footer__col" aria-label={title}>
      <h3 className="footer__heading">{title}</h3>
      <ul className="footer__list">
        {items.map((link, idx) => (
          <li key={link.href ?? idx}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ContactColumn({ title, items }) {
  const safeItems = toSafeArray(items);
  if (safeItems.length === 0) return null;

  return (
    <div className="footer__col">
      <h3 className="footer__heading">{title}</h3>
      <ul className="footer__list footer__contact">
        {safeItems.map((item, idx) => (
          <li key={item.label ?? idx}>
            <span className="footer__label">{item.label}</span>
            {item.href ? (
              <a href={item.href}>{item.value}</a>
            ) : (
              <span>{item.value}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialList({ links }) {
  const items = toSafeArray(links);
  if (items.length === 0) return null;

  return (
    <ul className="footer__social" aria-label="Redes sociais">
      {items.map((social, idx) => (
        <li key={social.href ?? idx}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
          >
            {social.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function LegalList({ links }) {
  const items = toSafeArray(links);
  if (items.length === 0) return null;

  return (
    <ul className="footer__legal">
      {items.map((link, idx) => (
        <li key={link.href ?? idx}>
          <a href={link.href}>{link.label}</a>
        </li>
      ))}
    </ul>
  );
}

// ---------- Componente principal ----------

export default function Footer({
  companyName = "Nome da Empresa",
  logoSrc = null,
  quickLinksTitle = "Links rápidos",
  quickLinks = defaultQuickLinks,
  contactTitle = "Contato",
  contactItems = defaultContactItems,
  socialLinks = defaultSocialLinks,
  legalLinks = defaultLegalLinks,
  year = new Date().getFullYear(),
}) {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__grid">
          <div className="footer__col footer__col--brand">
            <BrandMark companyName={companyName} logoSrc={logoSrc} />
            <SocialList links={socialLinks} />
          </div>

          <LinksColumn title={quickLinksTitle} links={quickLinks} />

          <ContactColumn title={contactTitle} items={contactItems} />
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {year} {companyName}. Todos os direitos reservados.
          </p>
          <LegalList links={legalLinks} />
        </div>
      </div>
    </footer>
  );
}
