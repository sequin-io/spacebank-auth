import React, { ReactElement } from "react";

import "./FetchingMask.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface Props {
  fetching?: boolean;
}

export default function FetchingMask({ fetching }: Props): ReactElement {
  if (fetching) {
    return (
      <div className={`fetching-mask fetching`}>
        <Spin indicator={<LoadingOutlined />} />
      </div>
    );
  }
  return <div className={`fetching-mask`}></div>;
}
