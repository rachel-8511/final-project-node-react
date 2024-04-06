import React, { useRef } from "react";
import { useFormik } from 'formik';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { AutoComplete } from "primereact/autocomplete";
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAddDefaultAddressMutation } from "../user/userApiSlice";
import { CascadeSelect } from 'primereact/cascadeselect';

import { Checkbox } from "primereact/checkbox";
import { setToken } from "../auth/authSlice";
import useAuth from "../../hooks/useAuth";

const Address = () => {
    const user = useAuth()
    const toast = useRef(null);
    const [checked, setChecked] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [AddDefaultAddress, { isSuccess, isError, isLoading, error, data }] = useAddDefaultAddressMutation()
    const dispatch = useDispatch()

    useEffect(() => {
        if (isSuccess) {
            dispatch(setToken(data))
        }
    }, [isSuccess])
    const show = () => {
        toast.current.show({ severity: 'success', summary: 'Form Submitted' });

    };

    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            city: '',
            street: '',
            houseNumber: '',
            apartment: '',
            postalCode: '',
            phone: user.phone,
        },
        validate: (data) => {
            let errors = {};

            if (!data.firstName) {
                errors.firstName = 'FirstName is required.';
            }
            if (!data.lastName) {
                errors.lastName = 'LastName is required.';
            }
            if (!data.city) {
                errors.city = 'City is required.';
            }
            if (!data.street) {
                errors.street = 'Street is required.';
            }
            if (!data.houseNumber) {
                errors.houseNumber = 'HouseNumber is required.';
            }
            if (!data.postalCode) {
                errors.postalCode = 'PostalCode is required.';
            }
            if (!data.phone) {
                errors.phone = 'Phone is required.';
            }
            return errors;
        },
        onSubmit: (data) => {
            data && show();
            if (checked) {
                AddDefaultAddress(data)
            }
            else{
                sessionStorage.setItem('address',JSON.stringify(data))
            }
            setSubmit(true)
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };
    return (

        <div className="card flex justify-content-center">
            {
                !submit ?
                    <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2">
                        <Toast ref={toast} />

                        <label htmlFor="value">firstName</label>
                        <AutoComplete
                            inputId="ac_FirstName"
                            name="firstName"
                            value={formik.values.firstName}
                            className={classNames({ 'p-invalid': isFormFieldInvalid('firstName') })}
                            onChange={(e) => {
                                formik.setFieldValue('firstName', e.value);
                            }}
                        />
                        {getFormErrorMessage('firstName')}


                        <label htmlFor="value">lastName</label>
                        <AutoComplete
                            inputId="ac_LastName"
                            name="lastName"
                            value={formik.values.lastName}
                            className={classNames({ 'p-invalid': isFormFieldInvalid('lastName') })}
                            onChange={(e) => {
                                formik.setFieldValue('lastName', e.value);
                            }}
                        />
                        {getFormErrorMessage('lastName')}


                        <label htmlFor="value">City</label>
                        <AutoComplete
                            inputId="ac_City"
                            name="city"
                            value={formik.values.city}
                            className={classNames({ 'p-invalid': isFormFieldInvalid('city') })}
                            onChange={(e) => {
                                formik.setFieldValue('city', e.value);
                            }}
                        />
                        {getFormErrorMessage('city')}


                        <label htmlFor="value">Street</label>
                        <AutoComplete
                            inputId="ac_Street"
                            name="street"
                            value={formik.values.street}
                            className={classNames({ 'p-invalid': isFormFieldInvalid('street') })}
                            onChange={(e) => {
                                formik.setFieldValue('street', e.value);
                            }}
                        />
                        {getFormErrorMessage('street')}

                        <label htmlFor="value">houseNumber</label>
                        <AutoComplete
                            inputId="ac_houseNumber"
                            name="houseNumber"
                            value={formik.values.houseNumber}
                            className={classNames({ 'p-invalid': isFormFieldInvalid('houseNumber') })}
                            onChange={(e) => {
                                formik.setFieldValue('houseNumber', e.value);
                            }}
                        />
                        {getFormErrorMessage('houseNumber')}

                        <label htmlFor="value">apartment</label>
                        <AutoComplete
                            inputId="ac_apartment"
                            name="houseNumber"
                            value={formik.values.apartment}
                            className={classNames({ 'p-invalid': isFormFieldInvalid('apartment') })}
                            onChange={(e) => {
                                formik.setFieldValue('apartment', e.value);
                            }}
                        />
                        {getFormErrorMessage('apartment')}

                        <label htmlFor="value">postalCode</label>
                        <AutoComplete
                            inputId="ac_postalCode"
                            name="postalCode"
                            value={formik.values.postalCode}
                            className={classNames({ 'p-invalid': isFormFieldInvalid('postalCode') })}
                            onChange={(e) => {
                                formik.setFieldValue('postalCode', e.value);
                            }}
                        />
                        {getFormErrorMessage('postalCode')}


                        <label htmlFor="value">Phone</label>
                        <AutoComplete
                            inputId="ac_Phone"
                            name="phone"
                            value={formik.values.phone}
                            className={classNames({ 'p-invalid': isFormFieldInvalid('phone') })}
                            onChange={(e) => {
                                formik.setFieldValue('phone', e.value);
                            }}
                        />
                        {getFormErrorMessage('phone')}

                        <Checkbox onChange={e => setChecked(e.checked)} checked={checked}>שמירה ככתובת דפולטיבית</Checkbox>


                        <Button label="שמירת כתובת" type="submit" />
                    </form> :
                    <div style={{ border: "1px solid white", padding: "20px" }}>
                        <h4>{formik.values.firstName} {formik.values.lastName}</h4>
                        <h4>{formik.values.street} {formik.values.houseNumber}, {formik.values.apartment}</h4>
                        <h4>{formik.values.city}</h4>
                        <h4>Israel</h4>
                        <h4>{formik.values.phone}</h4>

                    </div>
            }

        </div>
    )
}
export default Address