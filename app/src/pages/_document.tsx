import { Html, Head, Main, NextScript } from "next/document";

const Document = () => {
    return (<Html>
        <Head>
            <link rel="manifest" href="/manifest.json" />
            <link rel="apple-touch-icon" href="/icon.png"></link>
            <meta name="theme-color" content="#0E0E2C" />
        </Head> 
        <body>
            <Main />
            <NextScript />
        </body>
    </Html>)
}

export default Document;