import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render () {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <div id="modal_container"></div>
          <NextScript />
        </body>
      </Html>
    )
  }
}
