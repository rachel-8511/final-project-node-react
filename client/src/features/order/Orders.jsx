import { useParams } from "react-router-dom"
import { useGetOrdersByIdQuery, useUpdateOrderMutation } from "./orderApiSlice"
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Steps } from 'primereact/steps';
import { Dialog } from "primereact/dialog";
import useAuth from "../../hooks/useAuth";
import IsLoading from "../../Components/IsLoading";

const Orders = () => {
    const { id } = useParams()
    const { isAdmin } = useAuth()
    let emptyOrder = {
        _id: null,
        status: ''
    };

    const { data: ordersData, isLoading, isSuccess} = useGetOrdersByIdQuery(id)
    const [orders, setOrders] = useState([]);
    const [updateOrder, { isSuccess: updateIsSuccess, data: updateOrderData }] = useUpdateOrderMutation()

    const [expandedRows, setExpandedRows] = useState(null);
    const [updateOrderDialog, setUpdateOrderDialog] = useState(false);
    const [order, setOrder] = useState(emptyOrder)
    const toast = useRef(null);


    const items = [
        {
            label: "Ordered"
        },
        {
            label: "In Process"
        },
        {
            label: "Shipped"
        },
        {
            label: "Delivered"
        }
    ];
    useEffect(() => {

        if (isSuccess) {
            setOrders(ordersData)
        }
    }, [isSuccess]);

    useEffect(() => {
        if (updateIsSuccess) {
            let _orders = orders.map(o => {
                if (o._id === updateOrderData._id) {
                    return updateOrderData
                }
                return o
            })
            setOrders(_orders);
            setOrder(emptyOrder);
        }
    }, [updateIsSuccess]);
    if (isLoading ) return <IsLoading/>;


    const expandAll = () => {
        let _expandedRows = {};

        orders.forEach((p) => (_expandedRows[`${p._id}`] = true));
        setExpandedRows(_expandedRows);
    };

    const collapseAll = () => {
        setExpandedRows(null);
    };

    const allowExpansion = (rowData) => {
        return rowData.products.length > 0;
    };
    const imageBodyTemplate = (rowData) => {

        if (rowData.imageURL)
            return <img src={"http://localhost:1234/uploads/" + rowData.imageURL.split("\\")[2]} alt={rowData.image} className="shadow-2 border-round" style={{ width: '80px' }} />;
    };
    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-3">
                <h5>Products list :</h5>
                <DataTable value={data.products}>
                    <Column field="_id" header="Id" sortable></Column>
                    <Column field="quantity" header="Quantity" sortable></Column>
                    <Column field="description" header="Description" sortable></Column>
                    <Column field="imageURL" header="Image" body={imageBodyTemplate}></Column>

                </DataTable>
                <div className="card">
                    <Steps model={items} activeIndex={
                        data.status === "Ordered" ? 0 :
                            data.status === "In Process" ? 1 :
                                data.status === "Shipped" ? 2 :
                                    3} />
                </div>

                <div style={{ marginLeft: '35%', border: "5px solid #C08F48", padding: "", width: "30%", textAlign: 'center' }}>
                    <h4>{data.address.firstName} {data.address.lastName}</h4>
                    <h4>{data.address.street} {data.address.houseNumber}, {data.address.apartment}</h4>
                    <h4>{data.address.city}</h4>
                    <h4>Israel</h4>
                    <h4>{data.address.phone}</h4>
                </div>
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap justify-content-end gap-2">
            <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
            <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} text />
        </div>
    );
    const editOrder = (order) => {
        setOrder({ _id: order._id, status: order.status })
        setUpdateOrderDialog(true)
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {rowData.status !== 'Delivered' && <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => { editOrder(rowData) }} />}
            </React.Fragment>
        );
    };
    const hideUpdateOrderDialog = () => {
        setUpdateOrderDialog(false);
    };
    const saveOrder = () => {

        let status = order.status === "Ordered" ? "In Process" :
            order.status === "In Process" ? "Shipped" : "Delivered"
        updateOrder({ _id: order._id, status: status })

        setUpdateOrderDialog(false);
    };

    const updateOrderDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideUpdateOrderDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={saveOrder} />
        </React.Fragment>
    );

    return (
        <>
            <br></br>
            <div style={{ minHeight:'63vh'}}>
            <div className="card" style={{ marginTop: "100px"}}>
                <Toast ref={toast} />
                <DataTable value={orders} expandedRows={expandedRows} onRowToggle={(e) => { setExpandedRows(e.data) }}
                    rowExpansionTemplate={rowExpansionTemplate}
                    dataKey="_id" header={header} tableStyle={{ minWidth: '40rem' }}>
                    <Column expander={allowExpansion} style={{ width: '5rem' }} />
                    <Column field="_id" header="Id" style={{ minWidth: '5rem' }} />
                    <Column field="payment" header="Payment" sortable style={{ minWidth: '5rem' }} />
                    <Column field="status" header="Status" sortable style={{ minWidth: '5rem' }} />
                    <Column field="createdAt" header="oreder date" sortable style={{ minWidth: '5rem' }} />
                    <Column field="updatedAt" header="oreder update" sortable style={{ minWidth: '5rem' }} />
                    {isAdmin ? <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column> : <></>}
                </DataTable>

                <Dialog visible={updateOrderDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={updateOrderDialogFooter} onHide={hideUpdateOrderDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {order && (
                            <span>
                                Are you sure this order <b>{order.status} </b>successfully?
                            </span>
                        )}
                    </div>
                </Dialog>
            </div></div>
        </>
    )
}
export default Orders