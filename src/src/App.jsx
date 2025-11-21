import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { Blog } from './pages/Blog.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Signup } from './pages/Signup.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { Login } from './pages/Login.jsx'
import { ProfileRedirect } from './pages/ProfileRedirect.jsx'
import { CreatePostPage } from './pages/CreatePostPage.jsx'
import { UserPage } from './pages/UserPage.jsx'

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
        path: '/user',
        element: <ProfileRedirect />,
    },
    {
        path: '/user/:userId',
        element: <UserPage />,
    },
    {
        path: '/createpost',
        element: <CreatePostPage />,
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