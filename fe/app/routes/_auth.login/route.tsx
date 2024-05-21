import { action } from "./action";
import { loader } from "./loader";
import LoginPage from "./page";

const meta = () => {
  return [
    { title: "Login | 99Agendamentos" }
  ];
};
export default LoginPage;
export { action, loader, meta }