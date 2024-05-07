import { useLoaderData } from "@remix-run/react";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { LoaderData, loader } from "../loader";
import React from "react";
import { formatMoney } from "~/formats/money-format";
import { durationFormat } from "~/formats/time-format";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  reserveId?: string;
}
const ShowReserveDialog = ({ open, setOpen, reserveId }: Props) => {
  const data: LoaderData = useLoaderData<typeof loader>();
  const reserve = data.reserves.find(r => r.id === reserveId);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[500px]">
        <div>
          <Title>{reserve?.service.name} {reserve?.variant ? `- ${reserve.variant.name}` : ''}</Title>
          <p className="text-muted-foreground">{reserve?.service.identifier}</p>
          <div>
            <p><strong>Preço: </strong> {formatMoney((reserve?.variant ? reserve.variant.price : reserve?.service.price)!)}</p>
            <p><strong>Duração: </strong> {durationFormat((reserve?.variant ? reserve.variant.duration : reserve?.service.duration)!)}</p>
          </div>
        </div>
        <div>
          <Title>Paciente</Title>
          <p>{reserve?.client.name}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
const Title = ({ children }: { children: React.ReactNode }) => {
  return <h3 className="font-bold text-lg">{children}</h3>
}
export default ShowReserveDialog;