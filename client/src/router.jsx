import { createBrowserRouter } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import SendMoney from '../pages/SendMoney'
import Recharge from './pages/Recharge'
import PayBills from '../pages/PayBills'
import Login from './pages/Login'
import Signup from '../pages/Signup'


export const router = createBrowserRouter([
{ path: '/', element: <Dashboard /> },
{ path: '/send', element: <SendMoney /> },
{ path: '/recharge', element: <Recharge /> },
{ path: '/bills', element: <PayBills /> },
{ path: '/login', element: <Login /> },
{ path: '/signup', element: <Signup /> },
])