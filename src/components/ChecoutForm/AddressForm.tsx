import React, {useEffect, useState} from 'react';
import {InputLabel, Select, MenuItem, Button, Grid, Typography} from "@material-ui/core";
import {useForm, FormProvider} from "react-hook-form";
import {commerce} from '../../lib/commerce'
import {CheckoutToken} from "./Checkout/Checkout";
import {Price} from "@chec/commerce.js/types/price";
import {Link} from "react-router-dom";
import {FormInput} from './CustomTextField';

type AddressFormPropsType = {
    checkoutToken: CheckoutToken | null
    next: (data: Object) => void
}

type ShippingCountriesType = { [name: string]: string }
type ShippingSubDivisionsType = { [name: string]: string }
type ShippingOptionsType = {
    id: string;
    description: string;
    price: Price;
    countries: string[];
}

export const AddressForm = ({checkoutToken, next}: AddressFormPropsType) => {
    const [shippingCountries, setShippingCountries] = useState<ShippingCountriesType>({})
    const [shippingCountry, setShippingCountry] = useState('')
    const [shippingSubdivisions, setShippingSubdivisions] = useState<ShippingSubDivisionsType>({})
    const [shippingSubdivision, setShippingSubdivision] = useState('')
    const [shippingOptions, setShippingOptions] = useState<ShippingOptionsType[]>([])
    const [shippingOption, setShippingOption] = useState('')
    const methods = useForm();

    const countries = Object.entries(shippingCountries).map(([code, name]) => ({id: code, label: name}));
    const subDivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({id: code, label: name}));
    console.log(shippingSubdivision)
    const options = shippingOptions.map((sO) => ({
        id: sO.id,
        label: `${sO.description} - ${sO.price.formatted_with_symbol}`
    }))

    const fetchShippingCountries = async (checkoutTokenId: string) => {
        const {countries} = await commerce.services.localeListShippingCountries(checkoutTokenId)
        setShippingCountries(countries)
        setShippingCountry(Object.keys(countries)[0])
    }

    const fetchSubDivisions = async (checkoutTokenId: string, countryCode: string) => {
        if (checkoutToken) {
            const {subdivisions} = await commerce.services.localeListShippingSubdivisions(checkoutTokenId, countryCode)
            setShippingSubdivisions(subdivisions)
            setShippingSubdivision(Object.keys(subdivisions)[0])
        }
    }

    const fetchShippingOptions = async (checkoutTokenId: string, country: string, region: string) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, {country, region})
        setShippingOptions(options)
        setShippingOption(options[0].id)
    }

    useEffect(() => {
        if (checkoutToken) {
            fetchShippingCountries(checkoutToken.id)
        }
    }, [])

    useEffect(() => {
        if (checkoutToken) {
            fetchSubDivisions(checkoutToken.id, shippingCountry)
        }
    }, [shippingCountry])

    useEffect(() => {
        if (checkoutToken) {
            fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision)
        }
    }, [shippingSubdivision])

    return (
        <>
            <Typography variant='h6' gutterBottom>Shipping Address</Typography>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data) => next({...data, shippingSubdivision, shippingOption}))}>
                    <Grid container spacing={3}>
                        <FormInput label='First Name' name='firstName'/>
                        <FormInput label='Last Name' name='lastName'/>
                        <FormInput label='Address' name='address'/>
                        <FormInput label='Email' name='email'/>
                        <FormInput label='City' name='city'/>
                        <FormInput label='ZIP/Postal code' name='zip'/>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={shippingCountry} fullWidth
                                    onChange={(e) => setShippingCountry(e.target.value as string)}>
                                {countries.map((country) => (
                                    <MenuItem key={country.id} value={country.id}>
                                        {country.label}
                                    </MenuItem>
                                ))}

                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Subdivision</InputLabel>
                            <Select value={shippingSubdivision} fullWidth
                                    onChange={(e) => setShippingSubdivision(e.target.value as any)}>
                                {subDivisions.map((subdivision) => (
                                    <MenuItem key={subdivision.id} value={subdivision.id}>
                                        {subdivision.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select value={shippingOption} fullWidth
                                    onChange={(e) => setShippingOption(e.target.value as string)}>
                                {options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                    <br/>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button component={Link} to='/cart' variant={'outlined'} color='secondary'>Back to Cart</Button>
                        <Button type='submit' variant={'contained'} color='primary'>Next step</Button>

                    </div>
                </form>
            </FormProvider>
        </>
    );
};

