import React from 'react'

import styles from '@styles/components/menuIcon.module.css'

interface Props {
  isMenuOpen: boolean
  handleMobileMenu: () => void
}

const MenuIcon: React.FC<Props> = ({ handleMobileMenu, isMenuOpen }) => {
  return (
    <button
      className={styles.container}
      aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
      onClick={() => handleMobileMenu()}
    >
      <span className={`${isMenuOpen && styles.close_left}`}></span>
      <span className={`${isMenuOpen && styles.close_right}`}></span>
      <span className={`${isMenuOpen && styles.fade}`}></span>
    </button>
  )
}

export default MenuIcon
