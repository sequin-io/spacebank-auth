import { Card } from "antd";
import React from "react";
import Header from "./Header";

interface Props {
  title?: string;
  className?: string;
}

export default function Layout({
  children,
  title,
  className,
}: React.PropsWithChildren<Props>) {
  return (
    <div className="layout">
      <header>
        <Header />
      </header>
      <main>
        <div className="layout-content-wrapper">
          <div className="layout-cloud" />
          <div className="layout-content">
            <Card title={title} className={className}>
              {children}
            </Card>
          </div>
        </div>
      </main>
      <footer className="layout-footer">
        Powered by{" "}
        <a
          href="https://usedecode.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Decode
        </a>
        .
      </footer>
    </div>
  );
}
