import { useForm, SubmitHandler } from 'react-hook-form'

import Link from 'next/link'

import type { NextPage } from 'next'

interface Inputs {
  email: string
}

const Login: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = data => {
    console.log(data)
  }

  return (
    <section className="form_wrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="form_inner_content_wrapper">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^.+[@]{1}[aA-zZ]+[.]{1}.+$/,
                  message: 'Invalid email format. example@mail.com'
                }
              })}
            />
            <p>{errors.email?.message}</p>
          </div>
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
