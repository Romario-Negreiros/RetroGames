import { useForm, SubmitHandler } from 'react-hook-form'

import Link from 'next/link'

import type { NextPage } from 'next'

interface Inputs {
  email: string
  name: string
}

const CreateAccount: NextPage = () => {
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
          <div>
            <input
              placeholder="Name"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 4,
                  message: 'Minimum 4 characters'
                },
                maxLength: {
                  value: 20,
                  message: 'Maximum of 20 characters'
                }
              })}
            />
            <p>{errors.name?.message}</p>
          </div>
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
