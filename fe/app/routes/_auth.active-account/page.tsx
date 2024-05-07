import { useLoaderData, useNavigate } from "@remix-run/react";
import { loader } from "./loader";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "~/components/ui/button";

const ActiveAccountPage = () => {
  const data = useLoaderData<typeof loader>();
  if(data.ok) return <SuccessPage />
  return <ErrorPage errorMessage={data.errorMessage} />
}
const SuccessPage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4 p-4 text-center">
      <CheckCircle2 className="w-20 h-20" />
      <p>Sua conta foi ativada com sucesso, clique no botão abaixo para fazer login.</p>
      <Button onClick={() => navigate('/login')}>Ir para login</Button>
    </div>
  )
}
const ErrorPage = ({ errorMessage }: { errorMessage?: string }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4 p-4 text-center">
      <AlertCircle className="w-20 h-20 text-destructive" />
      <p>{errorMessage ? errorMessage : 'Ocorreu um erro ao tentar ativar sua conta, tente fazer login para enviarmos um novo link para ativação.'}</p>
      <Button onClick={() => navigate('/login')}>Ir para login</Button>
    </div>
  )
}
export default ActiveAccountPage;