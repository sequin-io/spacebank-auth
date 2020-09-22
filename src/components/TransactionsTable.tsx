import React, { useMemo } from "react";
import {
  DateFilter,
  TagfulTransaction,
  ListTransactions,
  Transaction,
} from "../types";
import usePrevious from "../usePrevious";
import FishyEmoji from "./FishyEmoji";
import Table from "./Table";

interface Props {
  data: ListTransactions;
  fishyIds: string[];
  dateFilter?: DateFilter;
  onSelectRow?(row: Transaction): void;
}

export default function TransactionsTable({
  data,
  fishyIds,
  onSelectRow,
  dateFilter,
}: Props) {
  const tagfulTransactions: TagfulTransaction[] = useMemo(
    () =>
      data.map((v) => {
        return {
          ...v,
          tag: fishyIds.find((id) => id === v.id) && "fishy",
        };
      }),
    [data, fishyIds]
  );

  const previousTagfulTransactions =
    usePrevious(tagfulTransactions) || tagfulTransactions;

  const memoizedColumns = useMemo(
    () => [
      {
        Header: "Is fishy?",
        accessor: "tag",
        width: 64,
        id: "tag",
        Formatted: (cell: any) => {
          const transactionId = cell.row.original.id;

          const previousState = previousTagfulTransactions.find(
            (transaction) => transaction.id === transactionId
          );

          const previousIsFishy =
            previousState && previousState.tag === "fishy";

          if (cell.value === "fishy") {
            return <FishyEmoji withOpenAnim={!previousIsFishy} />;
          }

          return <></>;
        },
      },
      ...columns,
    ],
    [previousTagfulTransactions]
  );

  const filteredData = useMemo(() => {
    let maxDateDelta = Infinity;

    if (dateFilter !== "all") {
      maxDateDelta = (dateFilter === "last-week" ? 7 : 14) * 86400000;
    }

    return tagfulTransactions.filter(
      (x) => Date.now() - x.inserted_at.valueOf() < maxDateDelta
    );
  }, [tagfulTransactions, dateFilter]);

  return (
    <Table
      data={filteredData}
      autoReset={false}
      onSelectRow={onSelectRow}
      columns={memoizedColumns as any}
    />
  );
}

const columns = [
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
