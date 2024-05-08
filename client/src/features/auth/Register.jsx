import React from "react";
import { useFormik } from 'formik';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { AutoComplete } from "primereact/autocomplete";
import { useRegisterMutation } from "./authApiSlice";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Error from "../../Components/Error";

const Register = () => {

    const [registerFunc, { isError, isSuccess, data, error }] = useRegisterMutation()
    const navigate = useNavigate()

    useEffect(() => {
        if (isSuccess) {
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
            formik.resetForm();
            registerFunc(data)
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };



    return (<>
        <br></br>
        <div style={{ marginTop: '200px' }}>
            <form onSubmit={formik.handleSubmit} className="flex flex-wrap  gap-3 p-fluid" style={{ width: '50%', marginLeft: '25%' }}>
                <h1 style={{ textAlign: 'center', width: '100%' }}>Register:</h1>
                <div className="flex-auto">
                    <label htmlFor="firstName" className="block">
                        FirstName
                    </label>
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
                </div>
                <div className="flex-auto">
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
                </div>
                <div className="flex-auto">
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
                </div>
                <div className="flex-auto">
                    <label htmlFor="value">Email</label>
                    <AutoComplete
                        inputId="ac_email"
                        name="email"
                        value={formik.values.email}
                        className={classNames({ 'p-invalid': isFormFieldInvalid('email') })}
                        onChange={(e) => {
                            formik.setFieldValue('email', e.value);
                        }}
                    />
                    {getFormErrorMessage('email')}
                </div>
                <div className="flex-auto">

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
                </div>
                <div className="flex-auto">

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
                </div>
                <Button label="Submit" type="submit" icon="pi pi-check" style={{ backgroundColor: '#C08F48', border: 'black' }} />
            </form>
            {isError&&<Error error={error.data.message}/>}   

        </div>
    </>

    )
}

export default Register