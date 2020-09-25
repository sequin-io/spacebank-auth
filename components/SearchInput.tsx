import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

export default function SearchInput({ value, onChange }: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(event.target.value);
  };

  return (
    <Input
      placeholder="Search transactions by description..."
      size="large"
      onChange={handleChange}
      value={value}
      suffix={<SearchOutlined />}
    />
  );
}
