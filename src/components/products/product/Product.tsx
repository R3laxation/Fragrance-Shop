import React from 'react';
import {Card, CardMedia, CardContent, CardActions, Typography, IconButton} from "@material-ui/core";
import {AddShoppingCart} from '@material-ui/icons';
import useStyles from './styles'
import {ProductType} from "../../../App";

type ProductPropsType = {
    product: ProductType
    onAddToCart: (productId: string, quantity: number) => void
}



export const Product = ({product, onAddToCart}: ProductPropsType) => {



    const s = useStyles();


    if(!product.image) return <div>...Loading</div>

    return (
        <div>
            <Card className={s.root}>
                    <CardMedia className={s.media} image={product.image.url} title={product.name} style={{height: '50px'}}/>
                    <CardContent >
                        <div className={s.cardContent}>
                            <Typography variant='h5' gutterBottom>
                                {product.name}
                            </Typography>
                            <Typography variant='h5' >
                                {product.price.formatted_with_symbol}
                            </Typography>
                        </div>
                        <Typography dangerouslySetInnerHTML={{__html: product.description}} variant='body2' color='textSecondary'/>
                    </CardContent>
                    <CardActions disableSpacing className={s.cardActions}>
                        <IconButton area-label='Add to Cart' onClick={() => onAddToCart(product.id, 1)}>
                            <AddShoppingCart/>
                        </IconButton>
                    </CardActions>
            </Card>
        </div>
    );
};

