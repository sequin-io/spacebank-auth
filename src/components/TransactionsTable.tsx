import React, { useMemo } from "react";
import { DateFilter, ListTransactions, Transaction } from "../types";
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
  const previousFishyIds = usePrevious(fishyIds) || [];

  const memoizedColumns = useMemo(
    () => [
      {
        Header: "Is fishy?",
        accessor: "id",
        width: 64,
        id: "is_fishy",
        Formatted: ({ value }: any) => {
          const currentState = fishyIds.find((id) => id === value);
          const previousState = previousFishyIds.find((id) => id === value);

          if (currentState) {
            return <FishyEmoji withOpenAnim={!previousState} />;
          }

          return <></>;
        },
      },
      ...columns,
    ],
    [fishyIds, previousFishyIds]
  );

  const filteredData = useMemo(() => {
    let maxDateDelta = Infinity;

    if (dateFilter !== "all") {
      maxDateDelta = (dateFilter === "last-week" ? 7 : 14) * 86400000;
    }

    return data.filter(
      (x) => Date.now() - x.inserted_at.valueOf() < maxDateDelta
    );
  }, [data, dateFilter]);

  return (
    <Table
      data={filteredData}
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
