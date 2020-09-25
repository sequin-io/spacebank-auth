import "../styles/globals.css";
import "../styles/index.css";
import "../styles/Table.css";
import "../styles/Header.css";
import "../styles/Layout.css";
import "../styles/FishyEmoji.css";
import "../styles/FetchingMask.css";

import { DecodeProvider } from "@decode/client";

function MyApp({ Component, pageProps }) {
  return (
    <DecodeProvider>
      <Component {...pageProps} />
    </DecodeProvider>
  );
}

export default MyApp;
