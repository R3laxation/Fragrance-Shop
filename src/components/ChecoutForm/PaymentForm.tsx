import React, { FormEvent } from 'react';
import {Typography, Button, Divider} from "@material-ui/core";
import {Elements, CardElement, ElementsConsumer} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

import {CheckoutToken} from "./Checkout/Checkout";
import {Review} from './Review';

type PaymentFormPropsType = {
    shippingData: Object
    checkoutToken: CheckoutToken | null
    backStep: () => void
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY as string);

export const PaymentForm = ({shippingData, checkoutToken, backStep}: PaymentFormPropsType) => {

    const handleSubmit = async (e: FormEvent, elements: any, stripe: any) => {
            e.preventDefault()

        if(!stripe || elements) return
        const cardElement = elements.getElement(CardElement)
        const {error, paymentMethod} = await stripe.paymentMethod({type: 'card', card: cardElement})
    }

    return (
        <>
            <Review checkoutToken={checkoutToken} />
            <Divider />
            <Typography variant="h6" gutterBottom style={{ margin: '20px 0' }}>Payment method</Typography>
            <Elements stripe={stripePromise}>
                <ElementsConsumer>{({ elements, stripe }) => (
                    <form onSubmit={(e) => handleSubmit(e, elements, stripe)} >
                        <CardElement />
                        <br /> <br />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="outlined" onClick={backStep}>Back</Button>
                            <Button type="submit" variant="contained" disabled={!stripe} color="primary">
                                Pay {checkoutToken?.live.subtotal.formatted_with_symbol}
                            </Button>
                        </div>
                    </form>
                )}
                </ElementsConsumer>
            </Elements>
        </>
    );
};

