import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HotelProvider } from '@/context/HotelContext'
import { router } from './router'
import '@/i18n/config'
import '@/styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HotelProvider>
        <RouterProvider router={router} />
      </HotelProvider>
    </QueryClientProvider>
  )
}
