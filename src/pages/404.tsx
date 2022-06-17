import type { NextPage } from 'next'

const _404: NextPage = () => {
  return (
    <section className="_404_or_500_pages_container">
      <h1>Page not found!</h1>
      <p>
        The page was requested, but not found, maybe the content you are looking
        was deleted.
      </p>
    </section>
  )
}

export default _404