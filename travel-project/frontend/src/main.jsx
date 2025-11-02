import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "./App.jsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import CreateTrip from "./create-trip/index.jsx";
import Header from "./componenets/custom/Header.jsx";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import AdminDashboard from "./adminDashboard/AdminDashboard.jsx";
import NewsList from "./newsSection/NewsList.jsx";
import NewsDetail from "./newsSection/NewsDetail.jsx";
import NewsEdit from "./newsSection/NewsEdit.jsx";
import AdminAddNews from "./newsSection/AdminAddNews.jsx";
import ContactUs from "./contactSection/ContactUs.jsx";
import AdminContactMessages from "./contactSection/AdminContactMessages.jsx";
import About from "./About.jsx";
import Service from "./Service.jsx";

const router = createBrowserRouter([
    {
        path : "/",
        element :<App/>
    },
    {
        path:"/create-trip",
        element:<CreateTrip/>
    }
    ,{
    path:"/login",
        element:<Login/>
    },{
        path:"/register",
        element:<Register/>
    },
    {
      path:"/admin",
      element:<AdminDashboard/>
    },
    {
        path:"/news",
        element:<NewsList/>
    },
    {
        path:"/news/:id",
        element:<NewsDetail/>
    },
    {
        path:"/admin/news/:id",
        element:<NewsEdit/>
    },
    {
        path:"/admin/news",
        element:<AdminAddNews/>
    },
    {
        path:"/contact",
        element:<ContactUs/>
    },
    {
        path:"/admin/messages",
        element:<AdminContactMessages/>
    },
    {path:"/about",
        element:<About/>
    },
    {path:"/service",
        element:<Service/>
    }




])
ReactDOM.createRoot (document.getElementById('root')).render(
    <React.StrictMode>

      <RouterProvider router={router}/>
    </React.StrictMode>
)
