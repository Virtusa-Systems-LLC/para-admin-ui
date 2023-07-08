import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { AppBarComponent } from "@syncfusion/ej2-react-navigations";
const MainComponent = () => {
    return (
        <>
            <AppBarComponent colorMode="Primary">
                <ButtonComponent
                    cssClass="e-inherit"
                    iconCss="e-icons e-menu"
                ></ButtonComponent>
                <span className="regular" style={{ margin: "0 5px" }}>
                    Auth Server
                </span>
                <div className="e-appbar-spacer"></div>
                <NavLink to="/1">
                    <ButtonComponent cssClass="e-inherit" style={{ color: "white" }}>
                        Custom Auth
                    </ButtonComponent>
                </NavLink>
                <NavLink to="/2">
                    <ButtonComponent cssClass="e-inherit" style={{ color: "white" }}>
                        Original Auth
                    </ButtonComponent>
                </NavLink>
                <NavLink to="/3">
                    <ButtonComponent cssClass="e-inherit" style={{ color: "white" }}>
                        Object Linking
                    </ButtonComponent>
                </NavLink>
            </AppBarComponent>
            <div>
                <div className="row px-3">
                    <div className="col-12">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainComponent
