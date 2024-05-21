import { clientLoader } from "./clientLoader";
import { loader } from "./loader";
import ServicesPage from "./page";
const meta = () => {
  return [
    { title: "Serviços | 99Agendamentos" }
  ];
};
export { loader, clientLoader, meta };
export default ServicesPage;
