import React from 'react';
import {Grid} from "@material-ui/core";
import useStyles from './styles'
import {ProductType} from "../../App";
import {Product} from "./product/Product";

type ProductsPropsType ={
    products: ProductType[]
    onAddToCart: (productId: string, quantity: number) => void
}


export const Products = ({products, onAddToCart}: ProductsPropsType) => {
    const s = useStyles()
    return (
        <main className={s.content}>
            <div className={s.toolbar}/>
            <Grid container justifyContent="center" spacing={4}>
                {products.map((p: any) => (
                    <Grid item key={p.id} xs={12} sm={6} md={4} lg={3}>
                        <Product product={p} onAddToCart={onAddToCart}/>
                    </Grid>
                ))}
            </Grid>
        </main>
    );
};

