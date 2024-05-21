import { action } from "./action";
import { loader } from "./loader";
import CreateSchedulePage from "./page";
const meta = () => {
  return [
    { title: "Criar Agendamento | 99Agendamentos" }
  ];
};
export { loader, action, meta };
export default CreateSchedulePage;