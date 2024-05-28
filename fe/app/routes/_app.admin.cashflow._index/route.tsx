import { action } from "./action";
import { loader } from "./loader";
import CashFlowPage from "./page";
const meta = () => {
  return [
    { title: "Fluxo de Caixa | 99Agendamentos" }
  ];
};
export default CashFlowPage;
export { loader, action, meta };
