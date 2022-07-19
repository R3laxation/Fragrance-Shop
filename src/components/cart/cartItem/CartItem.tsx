import React from 'react';
import {Typography, Button, Card, CardActions, CardContent, CardMedia} from "@material-ui/core";
import useStyles from './styles'
import {LineItem} from "@chec/commerce.js/types/line-item";

type CartItemPropsType = {
    item: LineItem
    onUpdateCartQty: (productId: string, quantity: number) => void
    onRemoveFromCart: (productId: string) => void
}


export const CartItem = ({item, onUpdateCartQty, onRemoveFromCart}: CartItemPropsType) => {

    const s = useStyles();

    if (!item.image) return <div>...Loading</div>

    return (
        <Card>
            <CardMedia image={item.image.url} className={s.media}/>
            <CardContent className={s.cardContent}>
                <Typography variant='h4'>{item.name}</Typography>
                <Typography variant='h5'>{item.line_total.formatted_with_symbol}</Typography>
            </CardContent>
            <CardActions className={s.cartActions}>
                <div className={s.buttons}>
                    <Button type='button' size='small'
                            onClick={() => onUpdateCartQty(item.id, item.quantity - 1)}>-</Button>
                    <Typography>{item.quantity}</Typography>
                    <Button type='button' size='small'
                            onClick={() => onUpdateCartQty(item.id, item.quantity + 1)}>+</Button>
                </div>
                <Button variant='contained' type='button' color='secondary' onClick={() => onRemoveFromCart(item.id)}>Remove</Button>
            </CardActions>
        </Card>
    );
};

