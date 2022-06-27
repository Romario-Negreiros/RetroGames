import React from 'react'
import { useAuth, useAuthMethods, useToast } from '@utils/hooks'
import { handleError } from '@utils/handlers'

import MenuIcon from '../MenuIcon'
import Image from 'next/image'
import Link from 'next/link'

import { User } from '@contexts/authContext'

import styles from '@styles/components/header.module.css'

interface Item {
  text: string
  url?: string
  disabled?: boolean
}

const initialNavItems: Item[] = [
  {
    text: 'Home',
    url: '/'
  },
  {
    text: 'user.name',
    url: '/:name'
  },
  {
    text: 'Sign in',
    url: '/login',
    disabled: false
  },
  {
    text: 'Sign out',
    disabled: true
  }
]

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [navItems, setNavItems] = React.useState(initialNavItems)
  const { user } = useAuth()
  const { setToast } = useToast()
  const { signOut } = useAuthMethods()
  const firstUpdate = React.useRef(true)

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

  const handleClickOnNavItem = (item: Item) => {
    handleMobileMenu()
    if (item.text === 'Log off') {
      handleSignOut()
    }
  }

  const handleUserAuthStateChange = React.useCallback((user: User | null) => {
    const navItemsCopy: Item[] = JSON.parse(JSON.stringify(navItems))
    navItemsCopy[2].disabled = Boolean(user)
    navItemsCopy[3].disabled = !user
    setNavItems(navItemsCopy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
    } else {
      handleUserAuthStateChange(user)
    }
  }, [user, handleUserAuthStateChange])

  return (
    <header className={styles.container}>
      <section>
        <Image src="/logo.svg" width={40} height={40} alt="RetroGames" />
      </section>
      <nav>
        <MenuIcon handleMobileMenu={handleMobileMenu} isMenuOpen={isMenuOpen} />
        <ul className={`${styles.nav_list_container} ${isMenuOpen && styles.nav_list_container_active}`}>
          {navItems.map(item => {
            if (!item.disabled) {
              return (
                <li key={item.text} onClick={() => handleClickOnNavItem(item)}>
                  {item.url ? (
                    <Link href={item.url}>
                      <a>{item.text}</a>
                    </Link>
                  ) : (
                    <a>
                      {item.text}
                    </a>
                  )}
                </li>
              )
            } else return null
          })}
        </ul>
      </nav>
    </header>
  )
}

export default Header
