import React from 'react'
import { useAuth } from '@utils/hooks'

import MenuIcon from '../MenuIcon'
import Image from 'next/image'
import Link from 'next/link'

import styles from '@styles/components/header.module.css'

interface Item {
  text: string
  url?: string
  onClick?: () => void
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
    text: 'Log in',
    url: '/login',
    disabled: false
  },
  {
    text: 'Log off',
    disabled: true
  }
]

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [navItems, setNavItems] = React.useState(initialNavItems)
  const { user } = useAuth()
  const firstUpdate = React.useRef(true)

  const handleMobileMenu = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 600) {
      setIsMenuOpen(!isMenuOpen)
    }
  }

  const handleClickOnNavItem = (item: Item) => {
    handleMobileMenu()
    if (item.onClick) item.onClick()
  }

  const handleUserAuthStateChange = () => {
    setNavItems(oldNavItems =>
      oldNavItems.map(item => (item.disabled !== undefined ? { ...item, disabled: !item.disabled } : { ...item }))
    )
  }

  React.useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      if (user) {
        handleUserAuthStateChange()
      }
    } else {
      handleUserAuthStateChange()
    }
  }, [user])

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
                    item.text
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
