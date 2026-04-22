import {createBrowserRouter} from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Procteted from "./features/auth/compponents/procteted"
import Home from "./features/interview/pages/Home"
import Interview from "./features/interview/pages/interview"

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path:"/",
        element:<Procteted><Home/></Procteted>
    },
    {
        path:"/interview/:interviewId",
        element:<Procteted><Interview/></Procteted>
    }
])
    
