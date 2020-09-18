import React, { useState } from "react";
import { ShowDecodeError, useDecode, useFetcher } from "@decode/client";
import { Tag } from "antd";
import useDebounce from "../useDebounce";
import FishyEmoji from "../components/FishyEmoji";
import Layout from "../components/Layout";
import SearchInput from "../components/SearchInput";
import TransactionsTableCard from "../components/TransactionsTableCard";
import FetchingMask from "../components/FetchingMask";
import TransactionsTable from "../components/TransactionsTable";

import {
  ListTransactions,
  ListTaggedTransactionIds,
  DateFilter,
} from "../types";

import "./Transactions.css";

export default function Transactions() {
  const [processing, setProcessing] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // Stores the current selected row at the table
  const [selectedRow, setSelectedRow] = useState<ListTransactions[0]>();

  // Retrieve transactions from database using Decode
  const { data, error } = useDecode<ListTransactions>([
    "listTransactions",
    { description: `%${debouncedSearch}%` },
  ]);

  // Retrieve transactions tagged Fishy from api using Decode
  const fishyIds = useDecode<ListTaggedTransactionIds>([
    "listTaggedTransactionIds",
    { name: "fishy" },
  ]);

  // Used for one-time request using Decode
  const fetcher = useFetcher();

  // Marks a transaction as fishy
  const markAsFishy = async () => {
    await fetcher("tagTransaction", {
      transaction_id: selectedRow!.id,
      body: { name: "fishy" },
    });
  };

  // Remove the fishy tag from a transaction
  const clearTags = async () => {
    await fetcher("untagTransaction", {
      transaction_id: selectedRow!.id,
      name: "fishy",
    });
  };

  // Handles the click in the "Clear Tags" and "Mark as Fishy" buttons
  const handleFishyChange = async (operation: () => Promise<void>) => {
    if (!selectedRow) return;

    setProcessing(true);
    try {
      await operation(); // executes the request operation
      await fishyIds.mutate(); // updates the fishy status in the table
    } catch {}
    setProcessing(false);
  };

  if (error) {
    return <ShowDecodeError error={error} />;
  }

  return (
    <Layout className="transactions" title="Transactions">
      <p>
        We'll use this app to mark suspicious transactions as
        <Tag color="warning" className="transactions-tag">
          Fishy <FishyEmoji />
        </Tag>
      </p>
      <SearchInput value={search} onChange={setSearch} />
      <TransactionsTableCard
        processing={processing}
        disableButtons={!selectedRow}
        onFishyClick={() => handleFishyChange(markAsFishy)}
        onClearClick={() => handleFishyChange(clearTags)}
        onDateFilterChange={setDateFilter}
      >
        <FetchingMask fetching={!data} />
        <TransactionsTable
          dateFilter={dateFilter}
          data={data || []}
          fishyIds={fishyIds.data ? fishyIds.data.ids : []}
          onSelectRow={(row) => setSelectedRow(row)}
        />
      </TransactionsTableCard>
    </Layout>
  );
}
