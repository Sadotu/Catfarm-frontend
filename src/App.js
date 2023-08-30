import {Navigate, Route, Routes} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "./context/AuthContext";
import './App.css';
import './global-variables.css'
import './global-styles.css'

//pages
import Calendar from "./pages/Calendar/Calendar";
import Database from "./pages/Database/Database";
import Event from "./pages/Event/Event";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Login from "./pages/Login/Login";
import Task from "./pages/Task/Task";
import Profile from "./pages/Profile/Profile";
import SignUp from "./pages/SignUp/SignUp";
import Tasks from "./pages/Tasks/Tasks";
import Volunteers from "./pages/Volunteers/Volunteers";

function App() {
    const { isAuth } = useContext(AuthContext)

  return (
    <>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/forgot_password" element={<ForgotPassword/>}/>
                <Route path="/logout" element={<Login/>}/>

                {/* Authorized pages */}
                <Route path="/" element={isAuth ? <Profile/> : <Navigate to="login"/>}/>
                <Route path="/profile" element={isAuth ? <Profile/> : <Navigate to="login"/>}/>
                <Route path="/database" element={isAuth ? <Database/> : <Navigate to="login"/>}/>
                <Route path="/calendar" element={isAuth ? <Calendar/> : <Navigate to="login"/>}/>
                <Route path="/new_event" element={isAuth ? <Event/> : <Navigate to="login"/>}/>
                <Route path="/event/:event_id" element={isAuth ? <Event/> : <Navigate to="login"/>}/>
                <Route path="/tasks" element={isAuth ? <Tasks/> : <Navigate to="login"/>}/>
                <Route path="/new_task" element={isAuth ? <Task/> : <Navigate to="login"/>}/>
                <Route path="/task/:task_id" element={isAuth ? <Task/> : <Navigate to="login"/>}/>
                <Route path="/volunteers" element={isAuth ? <Volunteers/> : <Navigate to="login"/>}/>
            </Routes>
    </>
  );
}

export default App;
