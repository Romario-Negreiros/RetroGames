import type { NextPage } from 'next'

const _500: NextPage = () => {
  return (
    <section className="_404_or_500_pages_container">
      <h1>Internal error!</h1>
      <p>Something went wrong, why don&apos;t you go back and try again?</p>
    </section>
  )
}

export default _500
