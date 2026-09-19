import React from "react";
import "./Footer.css";

/**
 * Footer
 *
 * Componente de rodapé reutilizável e seguro para projetos React.
 * Todo o conteúdo é recebido via props (com valores padrão), então
 * nenhum texto é "hardcoded" no meio da lógica — basta passar novos
 * valores para customizar sem tocar no JSX/CSS.
 *
 * Segurança:
 * - Não usa dangerouslySetInnerHTML em nenhum ponto.
 * - Links externos usam rel="noopener noreferrer" para evitar
 *   que a página aberta tenha acesso ao `window.opener`.
 * - href de telefone/e-mail são montados com encodeURIComponent
 *   para evitar quebra de string em valores inesperados.
 * - Todas as listas são validadas (Array.isArray) antes do .map,
 *   então props ausentes ou malformadas não quebram o render.
 */

const defaultQuickLinks = [
  { label: "Início", href: "/" },
  { label: "Sobre nós", href: "/sobre" },
  { label: "Serviços", href: "/servicos" },
  { label: "Contato", href: "/contato" },
];

const defaultSocialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Facebook", href: "https://facebook.com" },
];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export default function Footer({
  companyName = "Nome da Empresa",
  description = "Uma breve descrição sobre a empresa, o que ela faz e o valor que entrega aos clientes.",
  logoSrc = null,
  phone = "(16) 0000-0000",
  email = "contato@empresa.com",
  address = "Rua Exemplo, 123 - Centro, São Carlos - SP",
  businessHours = "Seg. a Sex., 9h às 18h",
  quickLinks = defaultQuickLinks,
  socialLinks = defaultSocialLinks,
  legalLinks = [
    { label: "Política de Privacidade", href: "/privacidade" },
    { label: "Termos de Uso", href: "/termos" },
  ],
  year = new Date().getFullYear(),
}) {
  const safeQuickLinks = Array.isArray(quickLinks) ? quickLinks : [];
  const safeSocialLinks = Array.isArray(socialLinks) ? socialLinks : [];
  const safeLegalLinks = Array.isArray(legalLinks) ? legalLinks : [];

  const phoneHref = isNonEmptyString(phone)
    ? `tel:${encodeURIComponent(phone.replace(/[^\d+]/g, ""))}`
    : null;

  const emailHref = isNonEmptyString(email)
    ? `mailto:${encodeURIComponent(email)}`
    : null;

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__grid">
          {/* Coluna: identidade da empresa */}
          <div className="footer__col footer__col--brand">
            <div className="footer__brand">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={`Logotipo de ${companyName}`}
                  className="footer__logo"
                />
              ) : (
                <span className="footer__logo-fallback">{companyName}</span>
              )}
            </div>
            {isNonEmptyString(description) && (
              <p className="footer__description">{description}</p>
            )}
            {safeSocialLinks.length > 0 && (
              <ul className="footer__social" aria-label="Redes sociais">
                {safeSocialLinks.map((social, idx) => (
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
            )}
          </div>

          {/* Coluna: links rápidos */}
          {safeQuickLinks.length > 0 && (
            <nav className="footer__col" aria-label="Links rápidos">
              <h3 className="footer__heading">Links rápidos</h3>
              <ul className="footer__list">
                {safeQuickLinks.map((link, idx) => (
                  <li key={link.href ?? idx}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Coluna: contato */}
          <div className="footer__col">
            <h3 className="footer__heading">Contato</h3>
            <ul className="footer__list footer__contact">
              {isNonEmptyString(address) && (
                <li>
                  <span className="footer__label">Endereço</span>
                  <span>{address}</span>
                </li>
              )}
              {isNonEmptyString(phone) && (
                <li>
                  <span className="footer__label">Telefone</span>
                  {phoneHref ? (
                    <a href={phoneHref}>{phone}</a>
                  ) : (
                    <span>{phone}</span>
                  )}
                </li>
              )}
              {isNonEmptyString(email) && (
                <li>
                  <span className="footer__label">E-mail</span>
                  {emailHref ? (
                    <a href={emailHref}>{email}</a>
                  ) : (
                    <span>{email}</span>
                  )}
                </li>
              )}
              {isNonEmptyString(businessHours) && (
                <li>
                  <span className="footer__label">Horário</span>
                  <span>{businessHours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {year} {companyName}. Todos os direitos reservados.
          </p>
          {safeLegalLinks.length > 0 && (
            <ul className="footer__legal">
              {safeLegalLinks.map((link, idx) => (
                <li key={link.href ?? idx}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
