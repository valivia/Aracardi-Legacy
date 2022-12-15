import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import { createTheme, ThemeProvider } from "@mui/material";
// import NextLink from "next/link";
// import { forwardRef } from "react";

import { Raleway } from "@next/font/google";
import { trpc } from "@utils/trpc";
const raleway = Raleway({ subsets: ["latin"] });

// const LinkBehaviour = forwardRef(function LinkBehaviour(props, ref) {
//   return <NextLink href={ref} {...props} />;
// });

const theme = createTheme({
  palette: {
    secondary: {
      main: "#0b0b0b",
      contrastText: "#d9c193",
    },
    primary: {
      main: "#d9c193",
      contrastText: "#0b0b0b",
    },
  },
  typography: {},
  components: {
    // MuiLink: {
    //   defaultProps: {
    //     component: LinkBehaviour,
    //   },
    // },
    // MuiButtonBase: {
    //   defaultProps: {
    //     LinkComponent: LinkBehaviour,
    //   },
    // },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderColor: "#d9c193",
        },
      },
    },
  },
});


function App({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>Aracardi</title>
      <meta name="description" content="Play card games!" />
      <link rel="Icon" href="/favicon.ico" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width"></meta>
    </Head>
    <ThemeProvider theme={theme}>
      <Component className={raleway.className} {...pageProps} />
    </ThemeProvider>
  </>;
}

export default trpc.withTRPC(App);
