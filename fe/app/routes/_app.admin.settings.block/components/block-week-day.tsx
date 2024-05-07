import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

const BlockWeekDay = () => {
  return ( 
    <Card>
      <CardHeader>
        <CardTitle>Bloqueio de dia da semana</CardTitle>
        <CardDescription>
        Esta funcionalidade permite a seleção de dias específicos da semana para bloquear agendamentos, restringindo quaisquer marcações durante essas datas.
        </CardDescription>
      </CardHeader>
      <form>
        <CardContent>
          
        </CardContent>
        <CardFooter>

        </CardFooter>
      </form>
    </Card>
  );
}
 /**
  * User
tenho uma funcionalidade no meu sistema, o usuario seleciona os dias da semana, por exemplo segunda e terca, e o sistema bloqueia qualquer tentativa de agendamento nesses dias selecionados, alem disso tenho outra funcionalidade semelhante, que são os horarios de funcionamento, nele o usuario define os dias da semana e os horarios para de funcionamento que são permitidos agendamentos,
Crie descrições claras para essas 2 funcionalidades
  */
export default BlockWeekDay;