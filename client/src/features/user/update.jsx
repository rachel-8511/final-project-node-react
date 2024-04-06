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
import { useUpdateUserMutation } from "./userApiSlice";
import { setToken } from "../auth/authSlice";
import useAuth from "../../hooks/useAuth";

const Update = () => {

    const [updateUser, { isError, isSuccess, isLoading, data, error }] = useUpdateUserMutation()
    const user =useAuth()
    const toast = useRef(null);

    const dispatch = useDispatch()
    const navigate = useNavigate()


    useEffect(() => {

        if (isSuccess) {

            dispatch(setToken(data))
            navigate('/')
        }

    }, [isSuccess])
    const show = () => {
        toast.current.show({ severity: 'success', summary: 'Form Submitted' });
    };


    const formik = useFormik({
        initialValues: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            user_id: user.user_id
        },
        validate: (data) => {
            let errors = {};

            if (!data.firstName) {
                errors.firstName = 'FirstName is required.';
            }
            if (!data.lastName) {
                errors.lastName = 'LastName is required.';
            }


            return errors;
        },
        onSubmit: (data) => {
            data && show();
            updateUser(data)

        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };

    return (
        <div className="card flex justify-content-center">
            <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2">
                <Toast ref={toast} />
                <label htmlFor="value">FirstName</label>
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


                <label htmlFor="value">LastName</label>
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


                {/* <label htmlFor="value">Email</label>
                <AutoComplete
                    inputId="ac_email"
                    name="email"
                    value={formik.values.email}
                    className={classNames({ 'p-invalid': isFormFieldInvalid('email') })}
                    onChange={(e) => {
                        formik.setFieldValue('email', e.value);
                    }}
                />
                {getFormErrorMessage('email')} */}

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

                <label htmlFor="value">User_id</label>
                <AutoComplete
                    inputId="ac_user_id"
                    name="user_id"
                    value={formik.values.user_id}
                    className={classNames({ 'p-invalid': isFormFieldInvalid('user_id') })}
                    onChange={(e) => {
                        formik.setFieldValue('user_id', e.value);

                    }}
                />
                {getFormErrorMessage('user_id')}

                <Button label="Submit" type="submit" icon="pi pi-check" />
            </form>
        </div>

    )
}

export default Update