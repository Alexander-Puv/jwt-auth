import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Store from './store/store.ts'
import { createContext } from 'react'

interface ContextParams {
  store: Store
}

const store = new Store()

export const Context = createContext<ContextParams>({
  store
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Context.Provider value={{store}}>
    <App />
  </Context.Provider>
)
