import React from 'react'
import { Link } from 'react-router-dom'

const btnStyle = 'hover:bg-[#553f9f] p-2 rounded-xl'

const Navbar = () => {
    return (
        <nav className="navbar flex justify-between align-center p-4 bg-[#9a80f1]">
            <div className="logo text-white text-2xl font-bold">
                <Link to="/">JobStat</Link>
                </div>
            <ul className="nav-links flex gap-5 text-white text-l font-semibold">
                <li className={btnStyle} ><Link to="/">Dashboard</Link></li>
                <li className={btnStyle}><Link to="/applications">Applications</Link></li>
                <li className={btnStyle}> <Link to="/add-application">Add Application</Link></li>



            </ul>
        </nav>
    )
}

export default Navbar
