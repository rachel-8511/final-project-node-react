import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';
import { useGetUsersQuery, useUpdateUserMutation } from './userApiSlice';
import { CascadeSelect } from 'primereact/cascadeselect';
import { useSearchParams } from 'react-router-dom';
import Search from '../../Components/Search';
import { useGetAllOrdersQuery } from '../order/orderApiSlice';
import IsLoading from '../../Components/IsLoading';


const AdminUsers = () => {

    const { data, isSuccess,isLoading:GetUsersLoading } = useGetUsersQuery()
    const { data: orders,isLoading:GetOrdersLoading } = useGetAllOrdersQuery()

    const [updateUser, { isSuccess: updateUserSuccess, data: updateUserData }] = useUpdateUserMutation()
    const [searchParams] = useSearchParams()
    const search = searchParams.get("search")
    let emptyUser = {
        _id: null,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        roles: '',
        active: '',
        user_id: ''
    };
    const navigate = useNavigate()

    const [users, setUsers] = useState(null);
    const [userDialog, setUserDialog] = useState(false);
    const [user, setUser] = useState(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedActive, setSelectedActive] = useState(null);

    const roles = [
        {
            name: 'user',
            code: 'US',
        },
        {
            name: 'admin',
            code: 'AD',
        }
    ]
    const actives = [
        {
            name: 'true',
            code: 'T',
        },
        {
            name: 'false',
            code: 'F',
        }
    ]
    useEffect(() => {
        if (isSuccess) {
            const filterData = !search ? data : data.filter(u => (u.firstName.indexOf(search) > -1) || (u.lastName.indexOf(search) > -1) || (u.email.indexOf(search) > -1))
            setUsers(filterData)
        }
    }, [isSuccess]);

    useEffect(() => {
        const filterData = !search ? data : data.filter(u => (u.firstName.indexOf(search) > -1) || (u.lastName.indexOf(search) > -1) || (u.email.indexOf(search) > -1))
        setUsers(filterData)
    }, [search])

    useEffect(() => {
        if (updateUserSuccess) {
            let _users = users.map(p => {
                if (p._id === updateUserData.updatedUser._id) {
                    return updateUserData.updatedUser
                }
                return p
            })
            setUsers(_users);
            setUser(emptyUser);

        }
    }, [updateUserSuccess]);

    if (GetUsersLoading||GetOrdersLoading ) return <IsLoading/>;


    const saveUser = () => {
        setSubmitted(true);
        updateUser({ _id: user._id, firstName: user.firstName, lastName: user.lastName, active: selectedActive ? selectedActive.name : user.active, roles: selectedRole ? selectedRole.name : user.roles })
        setUserDialog(false);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
        setSelectedRole(null)
        setSelectedActive(null);
    };

    const editUser = (user) => {
        setUser({ ...user });
        setUserDialog(true);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (

            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUser(rowData)} />
            </React.Fragment>
        );
    };

    const viewOrder = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-box" rounded outlined severity="danger"
                    onClick={() => { navigate(`/orders/${rowData._id}`) }} disabled={(rowData.firstName, orders.filter(o => o.customer_id === rowData._id)).length === 0} />

            </React.Fragment>
        );
    }

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Users</h4>
            <Search />
        </div>
    );
    const userDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveUser} />
        </React.Fragment>
    );

    return (
        <>
            <br></br>
            <div className="card" style={{ marginTop: "100px" }}>
                <Toast ref={toast} />

                <div className="card">
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={users} selection={selectedUsers} onSelectionChange={(e) => setSelectedUsers(e.value)}
                        dataKey="_id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users" globalFilter={globalFilter} header={header}>
                        <Column field="firstName" header="FirstName" sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="lastName" header="LastName" sortable style={{ maxWidth: '12rem' }}></Column>
                        <Column field="email" header="Email" sortable></Column>
                        <Column field="phone" header="Phone" sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="roles" header="Roles" sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="active" header="Active" sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="user_id" header="User_id" sortable style={{ minWidth: '10rem' }}></Column>
                        <Column body={viewOrder} header="Orders" style={{ maxWidth: '5rem' }}></Column>
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                    </DataTable>
                </div>

                <Dialog visible={userDialog} style={{ width: '20rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>

                    <div className="field justify-content-center">
                        <label htmlFor="name" className="font-bold">
                            Role
                        </label>
                        <CascadeSelect value={!selectedRole ? user.roles : selectedRole} onChange={(e) => setSelectedRole(e.value)} options={roles}
                            optionLabel="name" optionGroupLabel='name' optionGroupChildren={[]}
                            className="w-full md:w-14rem" breakpoint="767px" placeholder="Select a Role" style={{ minWidth: '16.5rem' }} />
                    </div>

                    <div className="field justify-content-center">
                        <label htmlFor="name" className="font-bold">
                            Active
                        </label>
                        <CascadeSelect value={selectedActive ? selectedActive : user.active} onChange={(e) => setSelectedActive(e.value)} options={actives}
                            optionLabel="name" optionGroupLabel='name' optionGroupChildren={[]}
                            className="w-full md:w-14rem" breakpoint="767px" placeholder="Select if user Active" style={{ minWidth: '16.5rem' }} />
                    </div>
                </Dialog>
            </div>
        </>
    );
}
export default AdminUsers