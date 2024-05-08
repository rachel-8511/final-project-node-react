
import React from "react";
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {useNavigate } from 'react-router-dom';
import { useCleaningBasketMutation, useUpdateUserMutation } from "../user/userApiSlice";
import { Accordion, AccordionTab } from 'primereact/accordion';
import Address from "./Address";
import { useAddOrderMutation } from "../order/orderApiSlice";
import { setToken } from "../auth/authSlice";
import useAuth from "../../hooks/useAuth";
import Error from "../../Components/Error";

const Checkout = () => {
    const user =useAuth()
    const [addAddress, setAddAddress] = useState(false);
    const [addOrder, {  isSuccess ,isError,error}] = useAddOrderMutation()
    const [cleaningBasket, { data, isSuccess:cleaningBasketIsSuccess}] = useCleaningBasketMutation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [flag,setFlag]=useState(false)

    useEffect(() => {

        if (isSuccess) {
            if(!flag){
                setFlag(true) 
               cleaningBasket({_id:user._id})
            }
           
            if (cleaningBasketIsSuccess) {
                dispatch(setToken(data))
                sessionStorage.removeItem("address")
                navigate("/")
            } 
        }
  
    }, [isSuccess,cleaningBasketIsSuccess])

    return (
        <>
        <br></br>
        <div className="card" style={{marginTop:'100px',width:'80%',marginLeft:'10%'}}>
            <Accordion activeIndex={0}>
                <AccordionTab header="שיטת משלוח">
                    <p className="m-0">
                        {user.basket.payment >= 200 ? <h3> זכאי למשלוח חינם בקניה מעל  200₪</h3> : <h3> עלות המשלוח 30₪</h3>}
                    </p>
                </AccordionTab>
                <AccordionTab header="פרטי משלוח">

                    <p className="m-0">
                        {user.defaultAddress ?
                            <><div style={{marginLeft:'20%', border: "5px solid #C08F48", padding: "", width: "60%",textAlign:'center'  }}>
                                <h4>{user.defaultAddress.firstName} {user.defaultAddress.lastName}</h4>
                                <h4>{user.defaultAddress.street} {user.defaultAddress.houseNumber}, {user.defaultAddress.apartment}</h4>
                                <h4>{user.defaultAddress.city}</h4>
                                <h4>Israel</h4>
                                <h4>{user.defaultAddress.phone}</h4>
                            </div><br />
                                {addAddress ? <Address /> : <Button label="הוספת כתובת + " style={{backgroundColor:'#C08F48',border:'black'}} onClick={() => {setAddAddress(true)}} />}

                            </> :
                            <><Address /></>}
                    </p>
                </AccordionTab>
                <AccordionTab header="שיטת תשלום" >
                    <p className="m-0">
                        {user.basket.payment>=200?<h3>₪{user.basket.payment} לתשלום </h3>:<h3>₪{user.basket.payment+30} לתשלום </h3>}
                        <Button label="לתשלום" style={{backgroundColor:'#C08F48',border:'black'}} onClick={() => addOrder({address:sessionStorage.getItem('address')?JSON.parse(sessionStorage.getItem('address')):user.defaultAddress})} />
                    </p>
                </AccordionTab>
            </Accordion>
            {isError&&<Error error={error.data.message}/>}   

        </div>
        </>


    )
}

export default Checkout