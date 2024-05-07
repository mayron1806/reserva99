import { useFetcher, useNavigate, useParams } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { toast } from "~/components/ui/use-toast";
import { useActionCallback } from "~/hooks/use-action-callback";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  closeTransactionDialog: () => void;
  transactionId?: string;
}
const DeleteTransactionDialog = ({ open, setOpen, transactionId, closeTransactionDialog }: Props) => {
  const fetcherDelete = useFetcher();
  const isSubmitting = fetcherDelete.state === 'submitting';
  
  useActionCallback(fetcherDelete, {
    onSuccess() {
      toast({
        title: 'Sucesso',
        description: 'Transação deletada com sucesso.',
      });
      setOpen(false);
      closeTransactionDialog();
    },
    onError(message) {
      toast({
        title: 'Erro',
        description: message ?? 'Ocorreu um erro ao tentar deletar o transação.',
        variant: 'destructive'
      });
    },
  });
  const handleDeleteService = () => fetcherDelete.submit({ transactionId: transactionId! }, { method: 'DELETE', encType: 'multipart/form-data' });
  return ( 
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full sm:w-min">Deletar</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">Deseja realmente deletar essa transação?</DialogTitle>
          <DialogDescription>Essa operação não pode ser desfeitas.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} disabled={isSubmitting}>Não</Button>
          <Button loading={isSubmitting} variant="outline" onClick={handleDeleteService}>Sim</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
 
export default DeleteTransactionDialog;