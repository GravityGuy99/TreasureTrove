import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { Blog } from './pages/Blog.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Signup } from './pages/Signup.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { Login } from './pages/Login.jsx'
import { UserPage } from './pages/UserPage.jsx'
import { SpecialPage } from './pages/SpecialPage.jsx'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Blog />,
    },
    {
        path: '/signup',
        element: <Signup />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/user/:id',
        element: <UserPage />,
    },
    //I added the special page
    {
        path: '/specialpage',
        element: <SpecialPage />,
    }
])
const queryClient = new QueryClient()

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
                <RouterProvider router={router} />
            </AuthContextProvider>
        </QueryClientProvider>
    )
}