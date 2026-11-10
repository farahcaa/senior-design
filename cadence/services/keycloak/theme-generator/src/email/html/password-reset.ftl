<#--
  This file has been claimed for ownership from @keycloakify/email-native version 260007.0.0.
  To relinquish ownership and restore this file to its original content, run the following command:

  $ npx keycloakify own --path "email/html/password-reset.ftl" --revert
-->
<#import "template.ftl" as layout>
<@layout.emailLayout>
  <h1 style="margin:0 0 16px; font-size:28px; line-height:1.15; font-weight:800; letter-spacing:-0.5px; color:#16131d;">Reset your password</h1>

  <p style="margin:0 0 24px; font-size:15px; line-height:1.65; color:#404040;">
    Someone requested to reset the password on your ${realmName!"Cadence"} account. If that was you, choose a new password below.
  </p>

  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
    <tr>
      <td align="center" bgcolor="#6d50cf" style="border-radius:999px;">
        <a class="btn" href="${link}" target="_blank"
           style="display:inline-block; padding:15px 32px; font-size:15px; font-weight:700; color:#ffffff; text-decoration:none; background:#6d50cf; border-radius:999px;">
          Reset password
        </a>
      </td>
    </tr>
  </table>

  <p style="margin:0 0 4px; font-size:13px; line-height:1.6; color:#737373;">
    This link expires in ${linkExpirationFormatter(linkExpiration)}. If you didn't request a reset, just ignore this email and nothing will change.
  </p>

  <p style="margin:16px 0 0; font-size:12px; line-height:1.6; color:#a3a3a3;">
    Button not working? Paste this link into your browser:<br/>
    <a href="${link}" style="color:#5a3fb8; word-break:break-all;">${link}</a>
  </p>
</@layout.emailLayout>
