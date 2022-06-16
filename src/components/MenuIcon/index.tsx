import React from 'react'

import styles from '@styles/components/menuIcon.module.css'

interface Props {
  isMenuOpen: boolean
  handleMobileMenu: () => void
}

const MenuIcon: React.FC<Props> = ({ handleMobileMenu, isMenuOpen }) => {
  return (
    <div className={styles.container} onClick={() => handleMobileMenu()}>
      <span
        className={`${styles.first} ${isMenuOpen && styles.close_left}`}
      ></span>
      <span
        className={`${styles.second} ${isMenuOpen && styles.close_right}`}
      ></span>
      <span className={`${styles.third} ${isMenuOpen && styles.fade}`}></span>
    </div>
  )
}

export default MenuIcon
