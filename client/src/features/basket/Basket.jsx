import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { useGetProductsQuery } from '../products/productsApiSlice';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from 'primereact/sidebar';
// import { ProductService } from './service/ProductService';

const Basket = ({setVisibleRight,visibleRight}) => {

    const user = useAuth()

    let basket = localStorage.getItem('token') ?
        user.basket :
        localStorage.getItem('basket') ?
            JSON.parse(localStorage.getItem('basket')) : undefined
    if (!basket) {
        localStorage.setItem("basket", JSON.stringify({ products: [], payment: 0 }))
        basket = JSON.parse(localStorage.getItem("basket"))
    }

    const [products, setProducts] = useState([]);
    const { data: allproducts, isLoading, isSuccess, isError, error } = useGetProductsQuery()
    const navigate = useNavigate()
    useEffect(() => {

        if (isSuccess) {
            const full_basket = basket.products?.map((p) => { return ({ product: allproducts?.find(pr => pr._id === p.product_id), quantity: p.quantity }) })
            setProducts(full_basket)
        }

    }, [isSuccess]);

    if (isLoading) return <h1>Loading</h1>

    const imageBodyTemplate = (p) => {
        return <img src={"http://localhost:1234/uploads/" + p.product.imageURL[0].split("\\")[2]} alt={p.product.name} className="w-6rem shadow-2 border-round" />;
    };

    const priceBodyTemplate = (p) => {
        return p.product.price;
    };

    const nameBodyTemplate = (p) => {
        return p.product.name;
    };

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Products</span>
            {/* <Button icon="pi pi-refresh" rounded raised /> */}
        </div>
    );
    // const footer = `In total there are ${products ? products.length : 0} products.`;


    return (
        <Sidebar visible={visibleRight} position="right" onHide={() => setVisibleRight(false)} style={{ width: '330px' }}>

            <div className="card">
                <DataTable value={products} header={header} footer={null} tableStyle={{ maxWidth: '90px' }}>
                    <Column field="name" body={nameBodyTemplate} header="Name"></Column>
                    <Column header="Image" body={imageBodyTemplate}></Column>
                    <Column field="price" header="Price" body={priceBodyTemplate}></Column>
                    {/* <Column header="Status" body={statusBodyTemplate}></Column> */}
                </DataTable>
                <Button onClick={() => {setVisibleRight(false); navigate('/basket') }}>לסל המלא</Button>
            </div>

        </Sidebar>

    )
}
export default Basket