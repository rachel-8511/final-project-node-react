import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { useAddProductItemMutation, useDeleteProductItemMutation, useGetProductsQuery, useUpdateProductItemMutation } from './productsApiSlice';
import { useSearchParams } from 'react-router-dom';
import Search from '../../Components/Search';
import IsLoading from '../../Components/IsLoading';

const AdminProducts = () => {
    const [searchParams]=useSearchParams()
    const search =searchParams.get("search")
    const {isLoading, data, isSuccess} = useGetProductsQuery()
    const [addProduct, {  isSuccess: is, data: addProductdData }] = useAddProductItemMutation()
    const [updateProduct, { isSuccess: updateIsSuccess, data: updateProductdData }] = useUpdateProductItemMutation()
    const [deleteProductItem, { isSuccess: deleteIsSuccess}] = useDeleteProductItemMutation()

    let emptyProduct = {
        _id: null,
        name: '',
        image: null,
        description: '',
        category: null,
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK'
    };
    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        let a=[]
        for (let index = 0; index < event.target.files.length; index++) {
            a.push(event.target.files[index])
        }
        setSelectedFile(a);
    };

    useEffect(() => {
        if (isSuccess) {
            const filterData=!search? data:data.filter(p=>(p.name.indexOf(search)>-1)||(p.description.indexOf(search)>-1))
            setProducts(filterData)
        }
    }, [isSuccess]);

    useEffect(()=>{
        const filterData=!search? data:data.filter(p=>(p.name.indexOf(search)>-1)||(p.description.indexOf(search)>-1))
        setProducts(filterData)
    }, [search])

    useEffect(() => {
        if (is) {
            let _products = [...products];
            _products.push(addProductdData)
            setProducts(_products);
            setProduct(emptyProduct);
            setIsAdd(false)
        }
    }, [is]);

    useEffect(() => {
        if (updateIsSuccess) {
            let _products = products.map(p => {
                if (p._id === updateProductdData._id) {
                    return updateProductdData
                }
                return p
            })

            setProducts(_products);
            setProduct(emptyProduct);
            setIsUpdate(false)
        }
    }, [updateIsSuccess]);

    useEffect(() => {
        if (deleteIsSuccess) {
            let _products = products.filter((val) => val._id !== product._id);
            setProducts(_products);
            setProduct(emptyProduct);
        }
    }, [deleteIsSuccess]);
    if (isLoading ) return <IsLoading/>;

    const saveProduct = () => {
        if (isAdd) {
            setSubmitted(true);
            if (product.name.trim() && product.price && selectedFile) {
                const formData = new FormData();
                formData.append('name', product.name);
                formData.append('price', product.price);
                formData.append('description', product.description);
                formData.append('quantity', product.quantity);
                selectedFile.forEach((e)=>
                {
                    formData.append('imageURL', e);
                })
                addProduct(formData)
                setProductDialog(false);
                setSelectedFile(null);
            }
        }
        if (isUpdate) {

            setSubmitted(true);
            if (product.name.trim() && product.price) {
                const formData = new FormData();
                formData.append('_id',product._id);
                formData.append('name', product.name);
                formData.append('price', product.price);
                formData.append('description', product.description);
                formData.append('quantity', product.quantity);
                selectedFile?.forEach((e)=>
                {
                    formData.append('imageURL', e);
                })
                updateProduct(formData)
                setProductDialog(false);
                setSelectedFile(null);
            }
        }
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'ILS' });
    };

    const openNew = () => {
        setIsAdd(true)
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const editProduct = (product) => {
        setIsUpdate(true)
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        deleteProductItem({ _id: product._id })
        setDeleteProductDialog(false);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const imageBodyTemplate = (rowData) => {
        if (rowData.imageURL)
            return <img src={"http://localhost:1234/uploads/" + rowData.imageURL[0].split("\\")[2]} alt={rowData.image} className="shadow-2 border-round" style={{ width: '80px' }} />;
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={getStatus(rowData)} severity={getSeverity(rowData)}></Tag>;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

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

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Products</h4>
         <Search/>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );


    return (
        <>
         <br></br>
        <div className="card" style={{marginTop:"100px"}}>

            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    <Column field="name" header="Name" sortable style={{ minWidth: '10rem',maxWidth:'10rem' }}></Column>
                    <Column field="description" header="Description" sortable style={{ minWidth:'17rem',maxWidth: '17rem' }}></Column>                    <Column field="imageURL" header="Image" body={imageBodyTemplate}></Column>
                    <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="quantity" header="Quantity" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Name
                    </label>
                    <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !product.name && <small className="p-error">Name is required.</small>}
                </div>

                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Description
                    </label>
                    <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                </div>

              <input type="file" name="imageURL" multiple onChange={handleFileChange} />
              {submitted && isAdd && !selectedFile && <small className="p-error">Image is required.</small>}

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">
                            Price
                        </label>
                        <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} required autoFocus mode="currency" currency="ILS" locale="en-US" className={classNames({ 'p-invalid': submitted && !product.price })} />
                        {submitted && !product.price && <small className="p-error">Price is required.</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity" className="font-bold">
                            Quantity
                        </label>
                        <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

        </div>
        </>
    );
}
export default AdminProducts