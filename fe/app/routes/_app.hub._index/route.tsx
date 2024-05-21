import { action } from "./action";
import { loader } from "./loader";
import CompanyPage from "./page";
const meta = () => {
  return [
    { title: "Hub | 99Agendamentos" }
  ];
};
export default CompanyPage;
export { loader, action, meta };
