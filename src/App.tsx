import React, {useEffect, useState} from 'react';
import './App.css';
import {Products, Navbar, Cart, Checkout} from './components'
import {commerce} from './lib/commerce'
import {Price} from "@chec/commerce.js/types/price";
import {Currency} from "@chec/commerce.js/types/currency";
import {LineItem} from "@chec/commerce.js/types/line-item";
import {ProductVariantGroup} from "@chec/commerce.js/types/product-variant-group";
import {Asset} from "@chec/commerce.js/types/asset";
import {ProductAttribute} from "@chec/commerce.js/types/product-attribute";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {CheckoutCapture} from "@chec/commerce.js/types/checkout-capture";
import {AxiosError} from "axios";


export interface CartType {
    id: string;
    created: number;
    updated: number;
    expires: number;
    total_items: number;
    total_unique_items: number;
    subtotal: Price;
    currency: Currency;
    discount_code: any; // todo
    hosted_checkout_url: string;
    line_items: LineItem[];
}

export interface ProductType {
    id: string;
    created: number;
    updated: number;
    active: boolean;
    permalink: string;
    name: string;
    description: string;
    price: Price;
    inventory: {
        managed: boolean;
        available: number;
    };
    media: {
        type: string;
        source: string;
    };
    sku: string | null;
    sort_order: number;
    seo: {
        title: string | null;
        description: string | null;
    };
    thank_you_url: string | null;
    meta: any;
    conditionals: {
        is_active: boolean;
        is_tax_exempt: boolean;
        is_pay_what_you_want: boolean;
        is_inventory_managed: boolean;
        is_sold_out: boolean;
        has_digital_delivery: boolean;
        has_physical_delivery: boolean;
        has_images: boolean;
        collects_fullname: boolean;
        collects_shipping_address: boolean;
        collects_billing_address: boolean;
        collects_extra_fields: boolean;
    };
    is: {
        active: boolean;
        tax_exempt: boolean;
        pay_what_you_want: boolean;
        inventory_managed: boolean;
        sold_out: boolean;
    };
    has: {
        digital_delivery: boolean;
        physical_delivery: boolean;
        images: boolean;
        video: boolean;
        rich_embed: boolean;
    };
    collects: {
        fullname: boolean;
        shipping_address: boolean;
        billing_address: boolean;
        extra_fields: boolean;
    };
    checkout_url: {
        checkout: string;
        display: string;
    };
    extra_fields: any[];
    variant_groups: ProductVariantGroup[];
    categories: Array<{
        id: string;
        slug: string;
        name: string;
    }>;
    assets: Asset[];
    image: Asset | null;
    attributes: ProductAttribute[];
    related_products: any[];
}


const App = () => {

    const [products, setProducts] = useState([])
    const [cart, setCart] = useState<CartType>({} as CartType)
    const [order, setOrder] = useState({})
    const [errorMessage, setErrorMessage] = useState('')


    const fetchProducts = async () => {
        const {data} = await commerce.products.list()
        setProducts(data as [])
    }
    const fetchCart = async () => {
        const cart = await commerce.cart.retrieve()
        setCart(cart)
    }
    const handleAddToCart = async (productId: string, quantity: number) => {
        const {cart} = await commerce.cart.add(productId, quantity)
        setCart(cart)
    }
    const handeUpdateCartQty = async (productId: string, quantity: number) => {
        const {cart} = await commerce.cart.update(productId, {quantity})
        setCart(cart)
    }
    const handeRemoveFromCart = async (productId: string) => {
        const {cart} = await commerce.cart.remove(productId)
        setCart(cart)
    }
    const handleEmptyCart = async () => {
        const {cart} = await commerce.cart.empty()
        setCart(cart)
    }
    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh()
        setCart(newCart)
    }

    const handleCaptureCheckout = async (checkoutTokenId: string, newOrder: CheckoutCapture) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder)
            setOrder(incomingOrder)
            refreshCart()
        } catch (err) {
            const error = err as AxiosError
            setErrorMessage(error.message)
        }
    }


    useEffect(() => {
        fetchProducts().finally(() => {
        })
        fetchCart().finally(() => {
        })
    }, [])

    return (
        <BrowserRouter>
            <div>
                <Navbar totalItems={cart.total_items}/>
                <Routes>
                    <Route path={'/'} element={<Products products={products} onAddToCart={handleAddToCart}/>}></Route>
                    <Route path={'/cart'} element={<Cart
                        cart={cart}
                        handeUpdateCartQty={handeUpdateCartQty}
                        handeRemoveFromCart={handeRemoveFromCart}
                        handleEmptyCart={handleEmptyCart}
                    />}></Route>
                    <Route path={'/checkout'} element={<Checkout
                        cart={cart} order={order}
                        onCaptureCheckout={handleCaptureCheckout}
                        error={errorMessage}/>}>
                    </Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
