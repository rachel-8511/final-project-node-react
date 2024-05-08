import { useGetProductsQuery } from "../products/productsApiSlice"
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { useDeleteProductMutation, useUpdateProductQuantityMutation } from "./basketApiSlice";
import { InputNumber } from "primereact/inputnumber";
import { Divider } from 'primereact/divider';
import useAuth from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { setToken } from "../auth/authSlice";
import IsLoading from "../../Components/IsLoading";


const FullBasket = ({setToCheckout}) => {
    let user = useAuth()
    let basket = localStorage.getItem('token') ?
        user.basket :
        localStorage.getItem('basket') ?
            JSON.parse(localStorage.getItem('basket')) : undefined
    if (!basket) {
        localStorage.setItem("basket", JSON.stringify({ products: [], payment: 0 }))
        basket = { products: [], payment: 0 }
    }
    const [singleProduct, setSingleProduct] = useState(null)
    const { data: allproducts, isLoading, isSuccess} = useGetProductsQuery()
    const [deleteProduct, { data: dt, isSuccess: deleteProductIsSuccess }] = useDeleteProductMutation()
    const [updateProductQuantity, { data, isSuccess: updateProductQuantityIsuccess }] = useUpdateProductQuantityMutation()


    const navigate = useNavigate()
    const [value, setValue] = useState(null);
    const dispatch = useDispatch()
    const full_basket = basket.products?.map((p) => { return ({ product: allproducts?.find(pr => pr._id === p.product_id), quantity: p.quantity }) })

    useEffect(() => {
        if (isSuccess) {
        }
        if (deleteProductIsSuccess) {
            dispatch(setToken(dt))
        }

        if (updateProductQuantityIsuccess) {
            dispatch(setToken(data))
        }

    }, [isSuccess, deleteProductIsSuccess, updateProductQuantityIsuccess]);

    if (isLoading ) return <IsLoading/>;

    const getSeverity = (product) => {
        if (product.quantity >= 100)
            return 'success'

        if (product.quantity < 100 && product.quantity > 0)
            return 'warning'
        if (product.quantity === 0)
            return 'danger'

        return null;

    };

    const getStatus = (product) => {
        if (product.quantity >= 100)
            return 'INSTOCK'

        if (product.quantity < 100 && product.quantity > 0)
            return 'LOWSTOCK'

        if (product.quantity === 0)
            return 'OUTOFSTOCK'

        return 'null';

    };
    const deleteProductFromBasket = (product) => {
        if (localStorage.getItem("token")) {
            setSingleProduct(product)
            deleteProduct({ _id: user._id, product_id: product.product._id })
        }
        else {

            const basket = JSON.parse(localStorage.getItem("basket"))
            localStorage.setItem("basket", JSON.stringify({
                products: basket.products.filter(p => p.product_id !== product.product._id),
                payment: basket.payment - product.quantity * product.product.price
            }))
        }
    }
    const updateBasketProductQuantity = (e, product) => {


        if (e.value === 0) {
            setValue(e.value)
            setSingleProduct(product)
            deleteProductFromBasket(product)
        }
        else {
            if (localStorage.getItem("token")) {
                updateProductQuantity({ _id: user._id, product_id: product.product._id, quantity: e.value })
                setValue(e.value)
            }
            else {
                setValue(e.value)
                let basket = JSON.parse(localStorage.getItem("basket"))

                const products = basket.products.map(p => {
                    if (p.product_id === product.product._id) {
                        basket.payment = basket.payment + (e.value - p.quantity) * product.product.price
                        p.quantity = e.value
                    }
                    return p;
                })

                localStorage.setItem("basket", JSON.stringify({
                    products: products,
                    payment: basket.payment
                }))
            }
        }
    }
    const listItem = (product, index) => {
        return (
            <div className="col-12" key={product._id}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                <img src={"http://localhost:1234/uploads/" + product.product.imageURL[0].split("\\")[2]} alt={product.product.name} className="w-6rem shadow-2 border-round" />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{product.product.name}</div>
                            <div className="text-2xl font-bold text-900">{product.quantity}</div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{product.category}</span>
                                </span>
                                <Tag value={getStatus(product)} severity={getSeverity(product)}></Tag>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">₪{product.product.price}</span>
                            <Button icon="pi pi-trash" className="p-button-rounded" disabled={product.inventoryStatus === 'OUTOFSTOCK'}
                                onClick={() => deleteProductFromBasket(product)
                                }></Button>

                            <div className="flex-auto">
                                <InputNumber inputId="minmax-buttons" value={product.quantity}
                                    onChange={(e) => { updateBasketProductQuantity(e, product) }}
                                    mode="decimal" showButtons min={0} max={product.quantity} />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (product, layout, index) => {
        if (!product) {
            return;
        }

        if (layout === 'list') return listItem(product, index);
    };

    const listTemplate = (products, layout) => {
        return <div className="grid grid-nogutter">{products.map((product, index) => itemTemplate(product, layout, index))}</div>;
    };




    const checkUser = () => {
        if (localStorage.getItem("token")) {
            navigate('/checkout')
        }
        else {
            setToCheckout(true)
            navigate('/login')
        }
    }


    return (
        <>
            <br></br>
            <div style={{ marginTop: '100px' }}>
                {basket.products.length === 0 ?
                    <>
                        <br></br><br></br><br></br>
                        <img className=" xl:w-15rem  xl:block mx-auto" src={'emptyCart.png'} alt={'emptyCart'} style={{ marginTop: '100px' }} />
                        <h2 style={{ textAlign: 'center' }}>Oups! Your cart is empty</h2>

                    </> :
                    <>
                        <h1 style={{ textAlign: 'center' }} >Basket:</h1>
                        <div className="card">
                            <div className="flex flex-column md:flex-row" >
                                <p className="flex flex-column md:flex-row" style={{ minWidth: '75%' }}>
                                    <DataView value={full_basket} listTemplate={listTemplate} header={null} />
                                </p>
                                <Divider layout="vertical" className="hidden md:flex"> </Divider>
                                <p style={{ minWidth: '25%', textAlign: "center" }}>
                                    <h3>{`₪${basket.payment} לתשלום`}</h3>
                                    <Button onClick={() => checkUser()} style={{ backgroundColor: '#C08F48', border: 'black' }}>להזמנה</Button>
                                </p>
                            </div>
                        </div></>
                }
            </div>
        </>
    )
}

export default FullBasket