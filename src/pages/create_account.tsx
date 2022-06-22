import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAuthMethods, useToast } from '@utils/hooks'
import { handleError, handleToast } from '@utils/handlers'

import Link from 'next/link'
import { Error as ErrorComponent, Waiting } from '../components'

import type { NextPage } from 'next'
import { AuthErrorCodes } from 'firebase/auth'

interface Inputs {
  email: string
  name: string
}

const CreateAccount: NextPage = () => {
  const [error, setError] = React.useState('')
  const [isLoaded, setIsLoaded] = React.useState(true)
  const { setToast } = useToast()
  const { sendSignInLinkToEmail, verifyIfEmailAlreadyExists } = useAuthMethods()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async ({ email, name }) => {
    try {
      setIsLoaded(false)
      if (!(await verifyIfEmailAlreadyExists(email))) {
        await sendSignInLinkToEmail(email)
        handleToast(
          ` Please, click on the link sent to your email to complete the 
          account creation, make sure to check your spam box too!
        `,
          setToast,
          10000
        )
        setIsLoaded(true)
        const submitBtn = document.querySelector('.button') as HTMLButtonElement
        submitBtn.disabled = true
        return
      }
      throw new Error(`(${AuthErrorCodes.EMAIL_EXISTS})`)
    } catch (err) {
      handleError(err, 'Creating new account', setError)
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
        <ErrorComponent error={error} setError={setError} />
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
          <div>
            <input
              placeholder="Name"
              className="input"
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
          <button className="button">Submit</button>
          <Link href="/login">
            <a>Log in instead</a>
          </Link>
        </section>
      </form>
    </section>
  )
}

export default CreateAccount
