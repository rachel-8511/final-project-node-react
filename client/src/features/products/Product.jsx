import { useParams } from "react-router-dom"
import { Button } from 'primereact/button';
import React, { useEffect, useState } from "react";
import { InputNumber } from 'primereact/inputnumber';
import { useAddProductMutation } from "../basket/basketApiSlice";
import { useDispatch } from "react-redux";
import { setToken } from "../auth/authSlice";
import useAuth from "../../hooks/useAuth";
import { useGetProductByIdQuery } from "./productsApiSlice";
import { Galleria } from 'primereact/galleria';
import { Divider } from "primereact/divider";
import IsLoading from "../../Components/IsLoading";

const Product = ({setVisibleRight}) => {

    const { id } = useParams();
    const { data: product, isLoading } = useGetProductByIdQuery(id)
    const responsiveOptions = [
        {
            breakpoint: '991px',
            numVisible: 4
        },
        {
            breakpoint: '767px',
            numVisible: 3
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ];


    const user = useAuth()

    const [value, setValue] = useState(1);
    const [addProduct, { isSuccess: addProductIsSuccess, data }] = useAddProductMutation()
    const dispath = useDispatch()

    useEffect(() => {
        if (addProductIsSuccess) {
            dispath(setToken(data))
            setVisibleRight(true)  
              }
    }, [addProductIsSuccess,data, dispath,setVisibleRight]);

    if (isLoading ) return <IsLoading/>;


    const itemTemplate = (item) => {
        return <img src={"http://localhost:1234/uploads/" + item.split("\\")[2]} alt={item.alt} style={{ width: '100%', maxHeight: '420px' }} />;
    }

    const thumbnailTemplate = (item) => {
        return <img src={"http://localhost:1234/uploads/" + item.split("\\")[2]} alt={item.alt} style={{ width: '50px' }} />;
    }
    const addProductToBasket = () => {
        if (localStorage.getItem("token")) {
            addProduct({ _id: user._id, product_id: product._id, quantity: value, imageURL: product.imageURL[0], description: `${product.name}, ${product.description}, ${product.price}` })
        }
        else {
            const basket = JSON.parse(localStorage.getItem("basket"))

            if (basket) {
                const basket = JSON.parse(localStorage.getItem("basket"))
                const productFind = basket.products.find(p => p.product_id === product._id)
                if (!productFind) {
                    basket.products.push({ product_id: product._id, quantity: value, imageURL: product.imageURL[0], description: `${product.name}, ${product.description}, ${product.price}` })
                    localStorage.setItem("basket", JSON.stringify({
                        products: basket.products,
                        payment: basket.payment + value * product.price
                    }))
                }
                else {
                    const index = basket.products.indexOf(productFind)
                    basket.products[index].quantity = basket.products[index].quantity + value
                    basket.payment = basket.payment + value * product.price
                    localStorage.setItem("basket", JSON.stringify(basket))
                   
                }
            }
            else {
                localStorage.setItem("basket", JSON.stringify({
                    products: [{ product_id: product._id, quantity: value, imageURL: product.imageURL[0], description: `${product.name}, ${product.description}, ${product.price}` }],
                    payment: value * product.price
                }))
            }
            setVisibleRight(true)  
        }
    }
    return (
        <>
            <br></br>
            <div style={{ direction: 'rtl', marginTop: '150px', width: '70%', marginLeft: '5%' ,minHeight:'57vh'}}>
                <div className="flex flex-column md:flex-row" >
                    <div className="flex-column md:flex-row" style={{ maxWidth: '500px', minWidth: '300px' }}>
                        <h1><b>{product.name}</b></h1>
                        <h3><b>{product.description}</b></h3>
                        <h3><b>₪{product.price}</b></h3>
                        <InputNumber inputId="minmax-buttons" value={value} onValueChange={(e) => setValue(e.value)} mode="decimal" showButtons min={0} max={product.quantity} /><br></br><br></br>
                        <Button icon="pi pi-shopping-cart" className="p-button-rounded" onClick={addProductToBasket} disabled={product.quantity === 0}></Button>
                        <br></br><br></br>
                    </div>
                    <Divider layout="vertical" className="hidden md:flex"> </Divider>
                    <div className="flex flex-column md:flex-row" style={{ maxWidth: '500px', minWidth: '300px' }}>
                        <Galleria value={product.imageURL} responsiveOptions={responsiveOptions} numVisible={5} circular style={{ maxWidth: '500px' }}
                            showItemNavigators showItemNavigatorsOnHover item={itemTemplate} thumbnail={thumbnailTemplate} />
                    </div>
                </div>
            </div>      
         </>

    )
}
export default Product