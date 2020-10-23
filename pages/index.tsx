import React, { useState, useMemo, useEffect } from "react";
import { Tag } from "antd";

import usePrevious from "../util/usePrevious";
import useDebounce from "../util/useDebounce";
import FishyEmoji from "../components/FishyEmoji";
import Layout from "../components/Layout";
import SearchInput from "../components/SearchInput";
import TransactionsTableCard from "../components/TransactionsTableCard";

import { Table } from "@decode/client";
import { api } from "../lib/api";

export default function App() {
  let [dateFilter, setDateFilter] = useState("all");

  let [search, setSearch] = useState("");
  let debouncedSearch = useDebounce(search, 500);

  // Stores the current selected row of the table
  let [selectedTransactionId, setSelectedTransactionId] = useState<string>();

  let [transactions, setTransactions] = useState([]);
  let [fishyIds, setFishyIds] = useState([]);

  // Get transactions  from api using Decode Auth
  let updateTransactions = async () => {
    setTransactions(await api.getTransactions());
  };

  // Get transactions tagged Fishy from api using Decode Auth
  let updateFishyIds = async () => {
    setFishyIds(await api.getFishyTransactions());
  };

  let updateTable = () => {
    updateTransactions();
    updateFishyIds();
  };

  useEffect(() => {
    updateTable();
  }, [debouncedSearch]);

  // Marks a transaction as fishy
  let markAsFishy = async () => {
    await api.tagTransaction(selectedTransactionId);
    updateTable();
  };

  // Remove the fishy tag from a transaction
  let markNotFishy = async () => {
    await api.untagTransaction(selectedTransactionId);
    updateTable();
  };

  let fishyColumn = useIsFishyColumn(fishyIds);
  let memoizedColumns = useMemo(() => [fishyColumn, ...columns], [
    fishyIds.length,
  ]);

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
        processing={false}
        disableButtons={!selectedTransactionId}
        onFishyClick={markAsFishy}
        onClearClick={markNotFishy}
        onDateFilterChange={setDateFilter}
      >
        <Table
          data={transactions}
          columns={memoizedColumns}
          dataHash={transactions.length}
          onSelectRow={(row: any) => setSelectedTransactionId(row.id)}
        />
      </TransactionsTableCard>
    </Layout>
  );
}

const oneWeek = 1000 * 60 * 60 * 24 * 7;

let dateFromDateFilter = (dateFilter: string) => {
  switch (dateFilter) {
    case "all": {
      return new Date(1).toISOString();
    }
    case "last-week": {
      return new Date(Date.now() - oneWeek).toISOString();
    }
    case "last-two-weeks": {
      return new Date(Date.now() - oneWeek * 2).toISOString();
    }
    default: {
      throw new Error(`Unhandled date fitler: ${dateFilter}`);
    }
  }
};

let useIsFishyColumn = (fishyIds: string[]) => {
  let previousFishyIds = usePrevious(fishyIds);

  return {
    Header: "Is fishy?",
    width: 64,
    id: "tag",
    Formatted: (cell: any) => {
      let transactionId = cell.row.original.id;

      if (fishyIds.includes(transactionId)) {
        return (
          <FishyEmoji
            animateEnter={!previousFishyIds?.includes(transactionId)}
          />
        );
      }

      return <></>;
    },
  };
};

let columns = [
  {
    Header: "Amount",
    accessor: "amount_in_cents",
    id: "amount_in_cents",
    width: 64,
    Formatted: ({ value }: any) => (
      <>
        {value < 0 ? "-" : "+"}${Math.abs(value) / 100}
      </>
    ),
  },
  {
    Header: "Description",
    accessor: "description",
    id: "description",
  },
  {
    Header: "Is pending?",
    accessor: "is_pending",
    id: "is_pending",
    width: 64,
  },
  {
    Header: "Inserted at",
    accessor: "inserted_at",
    id: "inserted_at",
  },
  {
    Header: "Updated at",
    accessor: "updated_at",
    id: "updated_at",
  },
];
