import { action } from "./action";
import { loader } from "./loader";
import TimesPage from "./page";
const meta = () => {
  return [
    { title: "Configurações | 99Agendamentos" }
  ];
};
export { loader, action, meta };
export default TimesPage;