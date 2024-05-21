import { action } from "./action";
import ErrorBoundary from "./error";
import { loader } from "./loader";
import GeneralPage from "./page";
const meta = () => {
  return [
    { title: "Configurações | 99Agendamentos" }
  ];
};
export default GeneralPage;
export { loader, ErrorBoundary, action, meta };