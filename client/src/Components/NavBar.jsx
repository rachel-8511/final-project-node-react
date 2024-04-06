import React, { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { OrderList } from 'primereact/orderlist';
import Basket from '../features/basket/Basket';
import useAuth from '../hooks/useAuth';
import { removeToken } from '../features/auth/authSlice';
import { useDispatch } from 'react-redux';

export default function NavBar({visibleRight,setVisibleRight}) {
    const { firstName, isAdmin, isUser, _id } = useAuth()

    // const [visibleRight, setVisibleRight] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userItems = [
        // {
        //     label: 'אודות',
        //     url: '/P'
        // },
        {
            label: 'חנות',
            url: '/products'
        },
        // {
        //     label: 'גלריה'

        // },
        // {
        //     label: 'המלצות'

        // },
        // {
        //     label: 'מאמרים'

        // },
        // {
        //     label: 'צור קשר'

        // },
        // {
        //     label: 'שאלות נפוצות'
        // },
        {
            label: `hello ${firstName ? firstName : 'ישראל'}`,

            items: [
                {
                    label: 'התחברות / רישום',
                    url: '/login'
                },
                {
                    label: <Button style={{ color: 'white', opacity: "100%" }} text severity='info' onClick={() => { navigate("/"); dispatch(removeToken()) }}>התנתקות</Button>,

                },
                {
                    label: 'עריכת פרטים אישיים',
                    url: '/update'
                },
                {
                    label: 'ההזמנות שלי',
                    url: `/orders/${_id}`
                },
                {
                    separator: true
                }
            ]

        }
    ];
    const adminItems = [

        {
            label: 'מוצרים',
            url: '/adminProducts'
        },
        {
            label: 'משתמשים',
            url: '/adminUsers'
        },
        // {
        //     label: 'הזמנות',
        //     url: '/adminProducts'
        // },
        {
            label: `hello ${firstName ? firstName : 'ישראל'}`,

            items: [
                {
                    label: 'התחברות / רישום',
                    url: '/login'
                },
                {
                    label: <Button style={{ color: 'white', opacity: "100%" }} text severity='info' onClick={() => { navigate("/"); dispatch(removeToken()) }}>התנתקות</Button>,

                },
                {
                    label: 'עריכת פרטים אישיים',
                    url: '/update'
                },
                {
                    separator: true
                }
            ]

        }

    ];
    const simpleUserItems = [

        {
            label: 'חנות',
            url: '/products'
        },
        {
            label: `hello ${firstName ? firstName : 'ישראל'}`,

            items: [
                {
                    label: 'התחברות / רישום',
                    url: '/login'
                },
                {
                    separator: true
                }
            ]

        }
    ];
    const start = <img alt="logo" src="logo.png" height="60" className="mr-2"></img>
    const end = (
        <div className="flex align-items-center gap-2">
            <Button icon="pi pi-shopping-cart" rounded text severity="info" onClick={() => setVisibleRight(true)} ></Button>
        </div>
    );
    const items = isAdmin ? adminItems : isUser ? userItems : simpleUserItems
    return (
        <>

            <div className="card">
                <Menubar model={items} start={start} end={isAdmin ? null : end} />
            </div>

                <Basket setVisibleRight={setVisibleRight} visibleRight={visibleRight}/>

        </>
    )
}
