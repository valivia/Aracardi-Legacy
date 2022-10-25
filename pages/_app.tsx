import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import LogoComponent from '../components/global/logo.module'

function App({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>Card Game</title>
      <meta name="description" content="Play card games!" />
      <link rel="Icon" href="/favicon.ico" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width"></meta>
    </Head>
    <Component {...pageProps} />
  </>
}

export default App
