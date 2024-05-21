import { action } from "./action";
import { loader } from "./loader";
import ResetPasswordPage from "./page";

const meta = () => {
  return [
    { title: "Redefinir senha | 99Agendamentos" }
  ];
};
export default ResetPasswordPage;
export { action, loader, meta }