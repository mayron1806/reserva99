import { clientLoader } from "./clientLoader";
import { loader } from "./loader";
import ClientsPage from "./page";
const meta = () => {
  return [
    { title: "Clientes | 99Agendamentos" }
  ];
};
export { loader, clientLoader, meta };
export default ClientsPage;
