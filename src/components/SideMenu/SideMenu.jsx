import React from 'react'
import { NavLink } from 'react-router-dom'
import './SideMenu.css'
const SideMenu = () => {
    return (
        <>
            <div className="side-menu">


                <ul className="list-group">
                    <li className="list-group-item">
                        <NavLink to='/dashboard'>Apps</NavLink>
                    </li>
                    {/* <li className="list-group-item">
                        <NavLink to='/dashboard'>Apps</NavLink>
                    </li>
                    <li className="list-group-item">
                        <NavLink to='/dashboard'>Apps</NavLink>
                    </li>
                    <li className="list-group-item">
                        <NavLink to='/dashboard'>Apps</NavLink>
                    </li>
                    <li className="list-group-item">
                        <NavLink to='/dashboard'>Apps</NavLink>
                    </li> */}
                </ul>
            </div>

        </>
    )
}

export default SideMenu
