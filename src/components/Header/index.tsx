import React from 'react'

import MenuIcon from '../MenuIcon'
import Image from 'next/image'
import Link from 'next/link'

import styles from '@styles/components/header.module.css'

const navItems = [
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
    url: '/login'
  },
  {
    text: 'Log off'
  }
]

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const handleMobileMenu = () => {
    if (window.innerWidth <= 550) {
      setIsMenuOpen(!isMenuOpen)
    }
  }
  return (
    <header className={styles.container}>
      <section>
        <Image src="/logo.svg" width={40} height={40} alt="RetroGames" />
      </section>
      <nav>
        <MenuIcon handleMobileMenu={handleMobileMenu} isMenuOpen={isMenuOpen} />
        <ul
          className={`${styles.nav_list_container} ${
            isMenuOpen && styles.nav_list_container_active
          }`}
        >
          {navItems.map(item => (
            <li key={item.text}>
              {item.url ? (
                <Link href={item.url}>
                  <a>{item.text}</a>
                </Link>
              ) : (
                item.text
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header
