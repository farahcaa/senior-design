/**
 * This file has been claimed for ownership from @oussemasahbeni/keycloakify-login-shadcn version 250004.0.15.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "login/i18n.ts" --revert
 */

import { i18nBuilder } from "@keycloakify/login-ui/i18n";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { I18nProvider, useI18n } = i18nBuilder
  .withThemeName<ThemeName>()
  .withCustomTranslations({
    en: {
      welcomeMessage: "Welcome to Cadence",
      loginAccountTitle: "Welcome back",
      registerTitle: "Create your account",
      email: "Email",
      enterCredentials: "Sign in to Cadence",
      noAccount: "New to Cadence?",
      doRegister: "Sign up",
      termsTitle: "Terms and Privacy Policy",
      termsText:
        "By creating an account you agree to the Cadence Terms and Privacy Policy.",
      acceptTerms: "I agree to the Terms and Privacy Policy",
      // Sign-in is by email (it's also the username), so errors say email too.
      invalidUserMessage: "Invalid email or password.",
      invalidUsernameOrEmailMessage: "Invalid email.",
      "organization.selectTitle": "Choose Your Organization",
      "organization.pickPlaceholder": "Pick an organization to continue",
    },
    ar: {
      welcomeMessage:
        "مرحبًا بك في Cadence - بوابتك إلى التخطيط والتنظيم السلس.",
      loginAccountTitle: "تسجيل الدخول  إلى حسابك",
      registerTitle: "تسجيل حساب جديد",
      email: "البريد الإلكتروني",
      enterCredentials: "أدخل بيانات الاعتماد الخاصة بك أدناه لتسجيل الدخول",
      doRegister: "إنشاء حساب",
      noAccount: "ليس لديك حساب؟",
      termsTitle: "الشروط وسياسة الخصوصية",
      termsText:
        "بإنشاء حساب، فإنك توافق على شروط Cadence وسياسة الخصوصية.",
      acceptTerms: "أوافق على الشروط وسياسة الخصوصية",
      invalidUserMessage: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      invalidUsernameOrEmailMessage: "البريد الإلكتروني غير صحيح.",
      "organization.selectTitle": "اختر مؤسستك",
      "organization.pickPlaceholder": "اختر مؤسسة للمتابعة",
    },
    fr: {
      welcomeMessage:
        "Bienvenue sur Cadence Votre passerelle vers une planification et une organisation sans faille.",
      loginAccountTitle: "Connectez-vous à votre compte",
      registerTitle: "Créer    un nouveau compte",
      email: "E-mail",
      enterCredentials:
        "Entrez vos informations d'identification ci-dessous pour vous connecter",
      doRegister: "S'inscrire",
      noAccount: "Vous n'avez pas de compte?",
      termsTitle: "Conditions et politique de confidentialité",
      termsText:
        "En créant un compte, vous acceptez les Conditions de Cadence et sa Politique de confidentialité.",
      acceptTerms: "J'accepte les Conditions et la Politique de confidentialité",
      invalidUserMessage: "Adresse e-mail ou mot de passe invalide.",
      invalidUsernameOrEmailMessage: "Adresse e-mail invalide.",
      "organization.selectTitle": "Choisissez Votre Organisation",
      "organization.pickPlaceholder":
        "Sélectionnez une organisation pour continuer",
    },
  })
  .build();

export { I18nProvider, useI18n };
