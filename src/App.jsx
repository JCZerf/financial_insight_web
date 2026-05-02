import { AppRouter } from '@/app/app-router'
import { ThemeProvider } from '@/lib/theme'

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  )
}

export default App
