import { ActionFunction, json } from "@remix-run/node";
import { withAuthAction } from "~/middlewares/with-auth-action";
import { getValidatedFormData } from "remix-hook-form";
import { UpdateTransactionSchema, updateTransactionSchema } from "./validation/update-transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTransaction } from "~/services/cashflow/create-transaction";
import { ActionResponse } from "~/types/action-response";
import { Transaction, TransactionStatus, TransactionType } from "~/types/cashflow/transaction";
import moment from "moment";
import { unmaskMoney } from "~/masks/unmask";
import { Token } from "~/types/token";
import { CreateTransactionSchema, createTransactionSchema } from "./validation/create-transaction";
import { updateTransaction } from "~/services/cashflow/update-transaction";
import { deleteTransaction } from "~/services/cashflow/delete-transaction";

export const action: ActionFunction = withAuthAction(async ({ request, token }) => {
  switch(request.method) {
    case 'POST':
      return await createTransactionAction(request, token);
    case 'PATCH': 
      return await updateTransactionAction(request, token);
    case 'DELETE':
      return await deleteTransactionAction(request, token);
  }
});
const createTransactionAction = async (request: Request, token: Token) => {
  const { errors, data, receivedValues: defaultValues } =
    await getValidatedFormData<CreateTransactionSchema>(request, zodResolver(createTransactionSchema));
  if (errors) {
    return json({ errors, defaultValues });
  }
  const result = await createTransaction(request, token, {
    name: data.name,
    description: data.description,
    status: data.status as TransactionStatus,
    date: moment(data.date).toDate(),
    type: data.type as TransactionType,
    value: unmaskMoney(data.value)
  });
  if (!result.success) {
    return json({ ok: false, error: result.errorMessage } as ActionResponse);
  }
  return json({ ok: true, data: result.data} as ActionResponse<Transaction>)
}
const updateTransactionAction = async (request: Request, token: Token) => {
  const { errors, data, receivedValues: defaultValues } =
    await getValidatedFormData<UpdateTransactionSchema>(request, zodResolver(updateTransactionSchema));
  if (errors) {
    return json({ errors, defaultValues });
  }
  const result = await updateTransaction(request, token, {
    id: data.id,
    name: data.name,
    description: data.description,
    status: data.status as TransactionStatus,
    date: moment(data.date).toDate(),
    type: data.type as TransactionType,
    value: unmaskMoney(data.value)
  });
  if (!result.success) {
    return json({ ok: false, error: result.errorMessage } as ActionResponse);
  }
  return json({ ok: true, data: result.data} as ActionResponse<Transaction>);
}
const deleteTransactionAction = async (request: Request, token: Token) => {
  const formData = await request.clone().formData();
  const transactionId = formData.get('transactionId') as string;
  const result = await deleteTransaction(request, token, transactionId);
  if (!result.success) {
    return json({ ok: false, error: result.errorMessage } as ActionResponse)
  }
  return json({ ok: true } as ActionResponse);
}