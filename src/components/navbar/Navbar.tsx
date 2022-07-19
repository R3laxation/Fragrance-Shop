import React from 'react';
import {AppBar, Toolbar, IconButton, Badge, Menu, MenuItem, Typography} from "@material-ui/core";
import {ShoppingCart} from '@material-ui/icons';
import logo from '../../assets/1000647.png'
import useStyles from './styles'
import {Link, useLocation} from "react-router-dom";

type NavbarPropsType = {
    totalItems: number
}
export const Navbar = ({totalItems}: NavbarPropsType) => {

    const s = useStyles()
    const location = useLocation()


    return (
        <>
            <AppBar position='fixed' className={s.appBar} color='inherit'>
                <Toolbar>
                    <Typography component={Link} to={'/'} variant='h6' className={s.title} color='inherit'>
                        <img src={logo} alt='Fragrance shop' height='25px' className={s.image}/>
                        Fragrance shop
                    </Typography>
                    <div className={s.grow}/>
                    {location.pathname === '/' &&
                        <div>
                            <IconButton component={Link} to={'/cart'} aria-label='Show cart items' color='inherit'>
                                <Badge badgeContent={totalItems} color='secondary'>
                                    <ShoppingCart/>
                                </Badge>
                            </IconButton>
                        </div>}
                </Toolbar>
            </AppBar>
        </>
    );
};
