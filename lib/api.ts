import { wrapFetch } from "@decode/client";
import { ListTransactions } from "../types";

function fetch(input: RequestInfo, init?: RequestInit) {
  return wrapFetch(window.fetch)(input, init);
}

function getUrl(path: string) {
  return `https://spacebank.onrender.com/api/${path}`;
}

async function getTransactions(): Promise<ListTransactions> {
  let res = await fetch(getUrl("transactions"));
  return (await res.json()).transactions;
}

async function getFishyTransactions(): Promise<string[]> {
  let res = await fetch(getUrl("tagged_transaction_ids?name=fishy"));
  return (await res.json()).ids;
}

async function tagTransaction(id: string) {
  await fetch(getUrl(`transactions/${id}/tag`), {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      name: "fishy",
    }),
  });
}

async function untagTransaction(id: string) {
  await fetch(getUrl(`transactions/${id}/tag?name=fishy`), {
    method: "DELETE",
  });
}

export const api = {
  getTransactions,
  getFishyTransactions,
  tagTransaction,
  untagTransaction,
};
