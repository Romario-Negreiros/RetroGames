import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAuthMethods, useToast } from '@utils/hooks'
import { handleError, handleToast } from '@utils/handlers'

import Link from 'next/link'
import { Error, Waiting } from '../components'

import type { NextPage } from 'next'

interface Inputs {
  email: string
}

const Login: NextPage = () => {
  const [error, setError] = React.useState('')
  const [isLoaded, setIsLoaded] = React.useState(true)
  const { setToast } = useToast()
  const { sendSignInLinkToEmail } = useAuthMethods()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async ({ email }) => {
    try {
      setIsLoaded(false)
      await sendSignInLinkToEmail(email)
      handleToast(
        ` Please, click on the link sent to your email to complete the 
        log in, make sure to check your spam box too!
        `,
        setToast,
        10000
      )
      setIsLoaded(true)
      const submitBtn = document.querySelector('.button') as HTMLButtonElement
      submitBtn.disabled = true
    } catch (err) {
      handleError(err, 'Logging in', setError)
      setIsLoaded(true)
    }
  }

  if (!isLoaded) {
    return (
      <section className="full_screen_height_wrapper">
        <Waiting waitingFor="Creating account..." />
      </section>
    )
  } else if (error) {
    return (
      <section className="full_screen_height_wrapper">
        <Error error={error} setError={setError} />
      </section>
    )
  }
  return (
    <section className="full_screen_height_wrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="form_inner_content_wrapper">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="input"
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
          <button className="button">Log in</button>
          <Link href="create_account">
            <a>Create account</a>
          </Link>
        </section>
      </form>
    </section>
  )
}

export default Login
