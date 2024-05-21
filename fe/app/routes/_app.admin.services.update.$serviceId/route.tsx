import UpdateService from "./page";
import { action } from './action';
import { loader } from "./loader";
const meta = () => {
  return [
    { title: "Serviços | 99Agendamentos" }
  ];
};
export { action, loader, meta };
export default UpdateService;