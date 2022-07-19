import React from 'react';
import {TextField, Grid} from '@material-ui/core';
import {useFormContext, Controller} from "react-hook-form";
export type CustomTextFieldPropsType = {
    name: string
    label: string
}


export const FormInput = ({name, label}: CustomTextFieldPropsType) => {

    const {control} = useFormContext()

    return (
        <Grid item xs={12} sm={6}>
            <Controller
                control={control}
                name={name}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                    <TextField onChange={onChange} value={value} label={label} />
                )}
            />
        </Grid>
    );
};

