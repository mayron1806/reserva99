import { confirmCreateAccount } from "./confirm-create-account";
import { rememberReserve } from "./remember-reserve";
import { resetPassword } from "./reset-password";

export const EmailTemplates = {
  'confirm-create-account': confirmCreateAccount,
  'reset-password': resetPassword,
  'remember-reserve': rememberReserve,
}