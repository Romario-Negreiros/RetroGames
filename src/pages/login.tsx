import Link from 'next/link'

import type { NextPage } from 'next'

const Login: NextPage = () => {
  return (
    <section className="form_wrapper">
      <form>
        <section className="form_inner_content_wrapper">
          <input type="email" placeholder="Email" />
        </section>
        <section className="form_inner_content_wrapper">
          <button>Log in</button>
          <Link href="create_account">
            <a>Create account</a>
          </Link>
        </section>
      </form>
    </section>
  )
}

export default Login
