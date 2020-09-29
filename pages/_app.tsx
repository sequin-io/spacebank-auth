import "../styles/globals.css";
import "../styles/index.css";
import "../styles/Header.css";
import "../styles/Layout.css";
import "../styles/FishyEmoji.css";

import { DecodeProvider } from "@decode/client";

// prettier-ignore
function MyApp({ Component, pageProps }) {
  return (
    <Component {...pageProps} />
  );
}

export default MyApp;
