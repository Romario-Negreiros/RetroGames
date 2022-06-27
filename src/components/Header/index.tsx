import React from 'react'
import { useAuth, useAuthMethods, useToast } from '@utils/hooks'
import { handleError } from '@utils/handlers'

import MenuIcon from '../MenuIcon'
import Image from 'next/image'
import Link from 'next/link'

import styles from '@styles/components/header.module.css'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const { user } = useAuth()
  const { setToast } = useToast()
  const { signOut } = useAuthMethods()

  const handleMobileMenu = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 600) {
      setIsMenuOpen(!isMenuOpen)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      handleError(err, 'Sign user out', undefined, setToast)
    }
  }

  return (
    <header className={styles.container}>
      <section>
        <Image src="/logo.svg" width={40} height={40} alt="RetroGames" />
      </section>
      <nav>
        <MenuIcon handleMobileMenu={handleMobileMenu} isMenuOpen={isMenuOpen} />
        <ul className={`${styles.nav_list_container} ${isMenuOpen && styles.nav_list_container_active}`}>
          <li onClick={handleMobileMenu}>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          {user && (
            <li onClick={handleMobileMenu}>
              <Link href={`/${user.displayName}`}>
                <a>{user.displayName}</a>
              </Link>
            </li>
          )}
          {!user && (
            <li onClick={handleMobileMenu}>
              <Link href="/sign_in">
                <a>Sign In</a>
              </Link>
            </li>
          )}
          {user && (
            <li
              onClick={() => {
                handleMobileMenu()
                handleSignOut()
              }}
            >
              <a>Sign Out</a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header
