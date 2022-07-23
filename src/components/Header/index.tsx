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

  const handleOpenOrCloseMobileMenu = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 600) {
      setIsMenuOpen(!isMenuOpen)
      document.querySelector('body')?.classList.toggle('body_with_menu_open')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      handleError(err, 'Sign user out', undefined, setToast)
    }
  }

  const handleCloseMobileMenuOnWindowResize = React.useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 600 && isMenuOpen) {
      setIsMenuOpen(false)
      document.querySelector('body')?.classList.remove('body_with_menu_open')
    }
  }, [isMenuOpen])

  React.useEffect(() => {
    window.addEventListener('resize', handleCloseMobileMenuOnWindowResize)
  }, [handleCloseMobileMenuOnWindowResize])

  return (
    <header className={styles.container}>
      <section>
        <Image src="/logo.svg" width={40} height={40} alt="RetroGames" />
      </section>
      <nav>
        <MenuIcon handleOpenOrCloseMobileMenu={handleOpenOrCloseMobileMenu} isMenuOpen={isMenuOpen} />
        <ul className={`${styles.nav_list_container} ${isMenuOpen && styles.nav_list_container_active}`}>
          <li onClick={handleOpenOrCloseMobileMenu}>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          {user && (
            <li onClick={handleOpenOrCloseMobileMenu}>
              <Link href={`/users/${user.displayName}`}>
                <a>{`${user.displayName?.charAt(0).toLocaleUpperCase()}${user.displayName?.slice(1)}`}</a>
              </Link>
            </li>
          )}
          {!user && (
            <li onClick={handleOpenOrCloseMobileMenu}>
              <Link href="/sign-in">
                <a>Sign In</a>
              </Link>
            </li>
          )}
          {user && (
            <li
              onClick={() => {
                handleOpenOrCloseMobileMenu()
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
