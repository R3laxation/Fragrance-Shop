import React from 'react';
import {Container, Typography, Button, Grid} from '@material-ui/core'
import {CartType} from "../../App";
import useStyles from './styles'
import {CartItem} from "./cartItem/CartItem";
import {Link} from 'react-router-dom';

type CartPropsType = {
    cart: CartType
    handeUpdateCartQty: (productId: string, quantity: number) => void
    handeRemoveFromCart: (productId: string) => void
    handleEmptyCart: () => void
}


export const Cart = ({cart, handeUpdateCartQty, handeRemoveFromCart, handleEmptyCart}: CartPropsType) => {

    const s = useStyles();

    // const isEmpty = !Object.keys(cart).length


    const EmptyCart = () => (
        <Typography variant='subtitle1'>You have no items in yor shopping cart,)
            <Link to={'/'} className={s.link}>try adding some :</Link>
        </Typography>
    )


    const FieldCart = () => (
        <>
            <Grid container spacing={3}>
                {cart.line_items.map((i) => (
                    <Grid item xs={12} sm={4} key={i.id}>
                        <CartItem item={i} onUpdateCartQty={handeUpdateCartQty} onRemoveFromCart={handeRemoveFromCart}/>
                    </Grid>
                ))}
            </Grid>
            <div className={s.cardDetails}>
                <Typography variant='h4'>
                    Subtotal: {cart.subtotal.formatted_with_symbol}
                </Typography>
                <div>
                    <Button className={s.emptyButton} size='large' type='button' variant='contained' color='secondary' onClick={handleEmptyCart}>Empty
                        Cart</Button>
                    <Button component={Link} to={'/checkout'}   className={s.checkoutButton} size='large' type='button' variant='contained'
                            color='primary'>Checkout</Button>
                </div>
            </div>
        </>
    )

    if (!cart.line_items) return <div>...Loading</div>

    return (
        <Container>
            <div className={s.toolbar}/>
            <Typography className={s.title} variant='h3' gutterBottom>Your Shopping Cart</Typography>
            {!cart.line_items.length ? <EmptyCart/> : <FieldCart/>}
        </Container>
    );
};

