import Link from 'next/link'

import type { NextPage } from 'next'

const CreateAccount: NextPage = () => {
  return (
    <section className="form_wrapper">
      <form>
        <section className="form_inner_content_wrapper">
          <input type="email" placeholder="Email" />
          <input placeholder="Name" />
        </section>
        <section className="form_inner_content_wrapper">
          <button>Submit</button>
          <Link href="/login">
            <a>Log in instead</a>
          </Link>
        </section>
      </form>
    </section>
  )
}

export default CreateAccount
