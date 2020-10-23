import "../styles/globals.css";
import "../styles/index.css";
import "../styles/Header.css";
import "../styles/Layout.css";
import "../styles/FishyEmoji.css";

import { AuthProvider } from "@decode/client";

// prettier-ignore
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
