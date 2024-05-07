import { useFetcher, useNavigate, useParams } from "@remix-run/react";
import { useState } from "react";
import { useCacheInvalidator } from "remix-client-cache";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { toast } from "~/components/ui/use-toast";
import { useActionCallback } from "~/hooks/use-action-callback";

const DeleteClientDialog = () => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const { invalidateCache } = useCacheInvalidator();
  const fetcherDelete = useFetcher();
  const isSubmitting = fetcherDelete.state === 'submitting';
  
  useActionCallback(fetcherDelete, {
    onSuccess() {
      toast({
        title: 'Sucesso',
        description: 'Cliente deletado com sucesso.',
      });
      invalidateCache('/admin/clients');
      navigate('/admin/clients');
    },
    onError(message) {
      toast({
        title: 'Erro',
        description: message ?? 'Ocorreu um erro ao tentar deletar o cliente.',
        variant: 'destructive'
      });
    },
  });
  const handleDeleteService = () => fetcherDelete.submit({ clientId: params.clientId! }, { method: 'DELETE' });
  return ( 
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full sm:w-min">
          Deletar cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">Deseja realmente deletar esse cliente?</DialogTitle>
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
 
export default DeleteClientDialog;