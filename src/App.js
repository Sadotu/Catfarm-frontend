import {Navigate, Route, Routes} from "react-router-dom";
import './App.css';

//pages
import Calendar from "./pages/Calendar/Calendar";
import Database from "./pages/Database/Database";
import Event from "./pages/Event/Event";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Login from "./pages/Login/Login";
import NewEvent from "./pages/NewEvent/NewEvent";
import NewTask from "./pages/NewTask/NewTask";
import Profile from "./pages/Profile/Profile";
import SignUp from "./pages/SignUp/SignUp";
import Task from "./pages/Task/Task";
import Tasks from "./pages/Tasks/Tasks";
import Volunteer from "./pages/Volunteer/Volunteer";
import Volunteers from "./pages/Volunteers/Volunteers";

function App() {
    const isAuth = true;

  return (
    <>
        <main>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element/>
                <Route path="/forgotpassword"/>
                {/* Authorized pages */}
                <Route path="/login"/>
            </Routes>
        </main>
    </>
  );
}

export default App;
