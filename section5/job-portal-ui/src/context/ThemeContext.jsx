import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize theme from localStorage or default to light
    const saved = localStorage.getItem('job-portal-theme')
    const initialTheme = saved === 'dark' ? 'dark' : 'light'
    console.log('Initializing theme:', initialTheme)
    setTheme(initialTheme)
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (!isInitialized) return

    const root = document.documentElement
    console.log('Applying theme:', theme)
    
    // Remove both classes first
    root.classList.remove('light', 'dark')
    
    // Add the current theme class
    root.classList.add(theme)
    
    // Save to localStorage
    localStorage.setItem('job-portal-theme', theme)
    
    console.log('DOM classes after update:', root.className)
  }, [theme, isInitialized])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    console.log('Toggling theme from', theme, 'to', newTheme)
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isInitialized }}>
      {children}
    </ThemeContext.Provider>
  )
}