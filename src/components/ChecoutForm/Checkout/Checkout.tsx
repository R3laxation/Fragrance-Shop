import React, {useEffect, useState} from 'react';
import {
    Button,
    CircularProgress,
    CssBaseline,
    Divider,
    Paper,
    Step,
    StepLabel,
    Stepper,
    Typography
} from "@material-ui/core";
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
import {CheckoutCapture} from "@chec/commerce.js/types/checkout-capture";
import {Link, useNavigate} from "react-router-dom";


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
    order: any
    onCaptureCheckout: (checkoutTokenId: string, newOrder: CheckoutCapture) => void
    error: string
}

const steps = ['Shipping address', 'Payment details']

export const Checkout = ({cart, order, onCaptureCheckout, error}: CheckoutPropsType) => {
    const navigate = useNavigate()
    const [activeStep, setActiveStep] = useState(0)
    const [checkoutToken, setCheckoutToken] = useState<CheckoutToken>({} as CheckoutToken)
    const [shippingData, setShippingData] = useState({})
    const [isFinished, setIsFinished] = useState(false)

    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, {type: 'cart'})
                setCheckoutToken(token)
            } catch (error) {
                navigate('/')
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



    const s = useStyles()

    const timeout = () => {
        setTimeout(() =>{
            setIsFinished(true)
        }, 3000)
    }

    const Form = () => activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} next={next}/>
        : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep}
                       onCaptureCheckout={onCaptureCheckout} timeout={timeout}/>

    let Confirmation = () => order.customer ? (
        <>
            <div>
                <Typography variant={'h5'}>Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}</Typography>
                <Divider className={s.divider}/>
                <Typography variant={'subtitle2'}>Order ref: {order.customer_reference}</Typography>
            </div>
            <br/>
            <Button component={Link} to='/' variant={'outlined'} type={'button'}>Back to home</Button>

        </>
    ) : isFinished ? (
        <>
            <div>
                <Typography variant={'h5'}>Thank you for your purchase</Typography>
                <Divider className={s.divider}/>
            </div>
            <br/>
            <Button component={Link} to='/' variant={'outlined'} type={'button'}>Back to home</Button>

        </>
    ) : (
        <div className={s.spinner}>
            <CircularProgress/>
        </div>
)

    if(error) {
        <>
            <Typography variant={'h5'}>Error: {error}</Typography>
            <br/>
            <Button component={Link} to='/' variant={'outlined'} type={'button'}>Back to home</Button>
        </>
    }

    return (
        <>
            <CssBaseline/>
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

