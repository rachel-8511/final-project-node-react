import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useGetProductsQuery } from '../products/productsApiSlice';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from 'primereact/sidebar';
import { Badge } from 'primereact/badge';

const Basket = ({ setVisibleRight, visibleRight }) => {
    const user = useAuth();
    let basket = localStorage.getItem('token') ?
        user.basket :
        localStorage.getItem('basket') ?
            JSON.parse(localStorage.getItem('basket')) : undefined;

    if (!basket) {
        localStorage.setItem("basket", JSON.stringify({ products: [], payment: 0 }));
        basket = JSON.parse(localStorage.getItem("basket"));
    }
    const { data: allproducts, isLoading, isSuccess} = useGetProductsQuery();
    const navigate = useNavigate();
    const full_basket = basket.products?.map((p) => { return ({ product: allproducts?.find(pr => pr._id === p.product_id), quantity: p.quantity }) });
    useEffect(() => {
        if (isSuccess) {
            // const full_basket = basket.products?.map((p) => { return ({ product: allproducts?.find(pr => pr._id === p.product_id), quantity: p.quantity }) });
            // setProducts(full_basket)
        }
    }, [isSuccess]);

    if (isLoading ) return <></>;

    const imageBodyTemplate = (p) => {
        return (
            <div className='flex p-overlay-badge'>
                <img src={"http://localhost:1234/uploads/" + p.product.imageURL[0].split("\\")[2]} alt={p.product.name} className="w-6rem shadow-2 border-round" />
                <Badge value={p.quantity} style={{ backgroundColor: 'white' }} ></Badge>
            </div>
        );
    };

    const priceBodyTemplate = (p) => {
        return p.product.price;
    };

    const nameBodyTemplate = (p) => {
        return p.product.name;
    };

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-4">
            <span className="text-xl text-900 font-bold">Products</span>
        </div>
    );

    return (
        <Sidebar visible={visibleRight} position="right" onHide={() => setVisibleRight(false)} style={{ width: '330px' }}>
            {full_basket.length === 0 ?
                <>
                    <img className=" xl:w-15rem  xl:block mx-auto" src={'emptyCart.png'} alt={'emptyCart'} style={{ marginTop: '100px' }} />
                    <h2 style={{ textAlign: 'center' }}>Oups! Your cart is empty,</h2>
                    <Button onClick={() => { setVisibleRight(false); navigate('/products') }} style={{ marginLeft: '75px', color: 'white', backgroundColor: 'transparent', border: 'none' }}>continue shopping</Button>
                </>
                : <div >
                    <DataTable header={header} value={full_basket} scrollable scrollHeight="70vh" tableStyle={{ minWidth: '80px', minHeight: '70vh' }}>
                        <Column field="name" body={nameBodyTemplate} header="Name"></Column>
                        <Column header="Image" body={imageBodyTemplate}></Column>
                        <Column field="price" header="Price" body={priceBodyTemplate}></Column>
                    </DataTable>
                    <div className="mt-auto">
                        <hr className="flex flex-wrap align-items-center justify-content-between gap-2" />
                        <h3 style={{ textAlign: 'center' }}>Total payment {basket.payment} ₪</h3>
                        <Button onClick={() => { setVisibleRight(false); navigate('/basket') }} style={{ marginLeft: '85px', color: 'white', backgroundColor: 'transparent', border: 'none', position: 'fixed', Button: '0', zIndex: '100', fontSize: '200' }}><b>to full basket</b></Button>
                    </div>
                </div>
            }
        </Sidebar>
    );
}
export default Basket