import React, {useEffect, useState} from 'react';
import {Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button} from "@material-ui/core";
import useStyles from './styles'
import {AddressForm} from "../AddressForm";
import {PaymentForm} from '../PaymentForm';
import {commerce} from '../../../lib/commerce';
import {CartType} from "../../../App";
import {Merchant} from "@chec/commerce.js/types/merchant";
import {Extrafield} from "@chec/commerce.js/types/extrafield";
import {Gateway} from "@chec/commerce.js/types/gateway";
import {ShippingMethod} from "@chec/commerce.js/types/shipping-method";
import {Live} from "@chec/commerce.js/types/live";
import {CheckoutTokenLineItem} from "@chec/commerce.js/types/checkout-token";

export interface CheckoutToken {
    id: string;
    cart_id: string | null;
    created: number;
    expires: number;
    analytics: any;
    conditionals: {
        collects_fullname: boolean;
        collects_shipping_address: boolean;
        collects_billing_address: boolean;
        has_physical_delivery: boolean;
        has_digital_delivery: boolean;
        has_available_discounts: boolean;
        has_pay_what_you_want: boolean;
        collects_extra_fields: boolean;
        is_cart_free: boolean;
    };
    collects: {
        fullname: boolean;
        shipping_address: boolean;
        billing_address: boolean;
        extra_fields: boolean;
    };
    has: {
        physical_delivery: boolean;
        digital_delivery: boolean;
        available_discounts: boolean;
        pay_what_you_want: boolean;
    };
    is: {
        cart_free: boolean;
    };
    line_items: CheckoutTokenLineItem[];
    merchant: Merchant;
    extra_fields: Extrafield[];
    gateways: Gateway[];
    shipping_methods: ShippingMethod[];
    live: Live;
}


type CheckoutPropsType = {
    cart: CartType
}

const steps = ['Shipping address', 'Payment details']

export const Checkout = ({cart}: CheckoutPropsType) => {

    const [activeStep, setActiveStep] = useState(0)
    const [checkoutToken, setCheckoutToken] = useState<CheckoutToken | null>(null)
    const [shippingData, setShippingData] = useState({})

    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, {type: 'cart'})
                setCheckoutToken(token)
            } catch (error) {

            }
        }
        generateToken()
    }, [cart])

    const nextStep = () => setActiveStep((prevState) => prevState + 1)
    const backStep = () => setActiveStep((prevState) => prevState - 1)

    const next = (data: Object) => {
        setShippingData(data)
        nextStep()
    }

    const Form = () => activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} next={next}/>
        : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} backStep={backStep}/>

    const s = useStyles()

    const Confirmation = () => (
        <div>Confirmation</div>
    )

    return (
        <>
            <div className={s.toolbar}/>
            <main className={s.layout}>
                <Paper className={s.paper}>
                    <Typography variant='h4' align='center'></Typography>
                    <Stepper activeStep={activeStep} className={s.stepper}>

                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation/> : checkoutToken && <Form/>}
                </Paper>
            </main>
        </>
    );
};

