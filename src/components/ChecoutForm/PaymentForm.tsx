import React from 'react';
import {Typography, Button, Divider} from "@material-ui/core";
import {Elements, CardElement, ElementsConsumer} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

type PaymentFormPropsType = {
    shippingData: Object
}

export const PaymentForm = ({shippingData} : PaymentFormPropsType ) => {
    return (
        <>
                <Review/>
        </>
    );
};

