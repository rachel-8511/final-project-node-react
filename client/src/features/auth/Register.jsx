import React, { useRef } from "react";
import { useFormik } from 'formik';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { AutoComplete } from "primereact/autocomplete";
import { useRegisterMutation } from "./authApiSlice";
import { useEffect, useState } from 'react';
import { useLoginMutation } from './authApiSlice';
import { setToken } from './authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const [registerFunc, { isError, isSuccess, isLoading, data, error }] = useRegisterMutation()

    const toast = useRef(null);

    const show = () => {
        toast.current.show({ severity: 'success', summary: 'Form Submitted' });
    };
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (isSuccess) {
            dispatch(setToken(data))
            navigate("/login")
        }
    }, [isSuccess])

    const formik = useFormik({
        initialValues: {
            password: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            user_id: ''
        },
        validate: (data) => {
            let errors = {};

            if (!data.firstName) {
                errors.firstName = 'FirstName is required.';
            }
            if (!data.lastName) {
                errors.lastName = 'LastName is required.';
            }
            if (!data.password) {
                errors.password = 'password is required.';
            }
            if (!data.email) {
                errors.email = 'Email is required.';
            }


            return errors;
        },
        onSubmit: (data) => {
            data && show();
            formik.resetForm();
            registerFunc(data)
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


                <label htmlFor="value">Password</label>
                <Password
                    inputId="in_password"
                    name="password"
                    rows={5}
                    cols={30}
                    className={classNames({ 'p-invalid': isFormFieldInvalid('password') })}
                    value={formik.values.password}
                    feedback={false}
                    onChange={(e) => {
                        formik.setFieldValue('password', e.target.value);
                    }}
                />
                {getFormErrorMessage('password')}


                <label htmlFor="value">Email</label>
                <AutoComplete
                    inputId="ac_email"
                    name="email"
                    value={formik.values.email}
                    //  suggestions={items}
                    //  completeMethod={search}
                    className={classNames({ 'p-invalid': isFormFieldInvalid('email') })}
                    onChange={(e) => {
                        formik.setFieldValue('email', e.value);
                    }}
                />
                {getFormErrorMessage('email')}

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

export default Register