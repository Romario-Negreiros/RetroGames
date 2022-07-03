import type { NextPage } from 'next'

const _404: NextPage = () => {
  return (
    <main className="main_container _404_or_500_pages_container">
      <h1>Page not found!</h1>
      <p>Maybe the content you are looking for was deleted.</p>
    </main>
  )
}

export default _404
