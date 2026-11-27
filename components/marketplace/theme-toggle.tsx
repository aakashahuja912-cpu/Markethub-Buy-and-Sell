'use client'

import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.dataset.theme === 'dark')
  }, [])

  function toggleTheme() {
    const nextTheme = isDark ? 'light' : 'dark'
    document.documentElement.dataset.theme = nextTheme
    localStorage.setItem('markethub-theme', nextTheme)
    setIsDark(nextTheme === 'dark')
  }

  return (
    <button className="icon-button theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`} aria-pressed={isDark} title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <motion.span key={isDark ? 'moon' : 'sun'} initial={{ opacity: 0, rotate: -35, scale: 0.7 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ duration: 0.2 }}>
        {isDark ? <Moon aria-hidden="true" size={18} /> : <Sun aria-hidden="true" size={18} />}
      </motion.span>
    </button>
  )
}
