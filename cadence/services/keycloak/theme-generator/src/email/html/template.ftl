<#--
  This file has been claimed for ownership from @keycloakify/email-native version 260007.0.0.
  To relinquish ownership and restore this file to its original content, run the following command:

  $ npx keycloakify own --path "email/html/template.ftl" --revert

  Cadence email layout, matching the login page: violet header band with the wordmark, rounded
  white card, pill buttons, dark purple-grey footer with "Eat out. Stay on track. Anywhere."
  Brand: violet #6d50cf / #5a3fb8, ink #16131d, neutral #f5f5f5. Every HTML email imports this and
  wraps its content in <@layout.emailLayout>; Keycloak's built-in bodies (security alerts, required
  actions, …) get the same frame plus the default <p>/<a> styles below.

  Email-client rules: tables for layout, inline styles on everything that matters (Gmail strips
  some <style>), no web fonts guaranteed (Plus Jakarta Sans/Inter fall back to system sans).
-->
<#macro emailLayout>
<#-- Optional logo: a PUBLIC, absolute URL (email clients can't load images bundled in the theme JAR),
     set per environment through theme.properties `logoUrl` <- CADENCE_EMAIL_LOGO_URL. Empty = wordmark only. -->
<#assign logoUrl = (properties.logoUrl)!"">
<#assign font = "'Plus Jakarta Sans','Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light only" />
  <title>${realmName!"Cadence"}</title>
  <style>
    body { margin: 0; padding: 0; background: #f5f5f5; }
    .content p { margin: 0 0 16px; font-size: 15px; line-height: 1.65; color: #404040; }
    .content a { color: #5a3fb8; }
    .btn:hover { background: #5a3fb8 !important; }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; border-radius: 0 !important; }
      .px { padding-left: 24px !important; padding-right: 24px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background:#f5f5f5; font-family:${font}; color:#16131d;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0"
               style="width:600px; max-width:600px; background:#ffffff; border-radius:24px; overflow:hidden; border:1px solid #e5e5e5;">

          <!-- Header: violet band, logo + wordmark -->
          <tr>
            <td class="px" style="background:#6d50cf; padding:24px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <#if logoUrl?has_content>
                  <td style="vertical-align:middle; padding-right:12px;">
                    <img src="${logoUrl}" alt="" width="44" height="44"
                         style="display:block; border:0; width:44px; height:44px; border-radius:12px;" />
                  </td>
                  </#if>
                  <td style="vertical-align:middle;">
                    <div style="font-family:${font}; font-size:22px; font-weight:800; letter-spacing:-0.4px; color:#ffffff; line-height:1.1;">
                      Cadence<span style="color:#b9a6f5;">.</span>
                    </div>
                    <div style="font-family:${font}; font-size:12px; color:#d9cffa; padding-top:3px;">
                      Macro tracking, anywhere you eat
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="px content" style="padding:40px 40px 16px; font-family:${font};">
              <#nested>
            </td>
          </tr>

          <!-- Footer: dark purple-grey band, the tagline -->
          <tr>
            <td class="px" style="background:#16131d; padding:28px 40px;">
              <div style="font-family:${font}; font-size:20px; font-weight:800; letter-spacing:-0.4px; line-height:1.15; color:#ffffff;">
                Eat out. Stay on track. <span style="color:#b9a6f5;">Anywhere.</span>
              </div>
              <p style="margin:12px 0 0; font-family:${font}; font-size:12px; line-height:1.6; color:#a3a3a3;">
                You received this email from ${realmName!"Cadence"} because of activity on your account.
                If you weren't expecting it, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:16px 0 0; font-family:${font}; font-size:11px; color:#a3a3a3;">
          © Cadence
        </p>

      </td>
    </tr>
  </table>
</body>
</html>
</#macro>
