import apiSlice from "../../app/apiSlice";

const userApiSlice = apiSlice.injectEndpoints({

    endpoints: (build) => ({
        getUsers: build.query({
            query: () => ({
                url: '/api/user'
            }),
            providesTags: ["user"]
        }),
        updateUser: build.mutation({
            query: (user) => ({
                url: '/api/user',
                method: "PUT",
                body: user
            }),
            invalidatesTags: ["users"]
        }),
        updateBasket: build.mutation({
            query: (basket) => ({
                url: '/api/user/updateBasket',
                method: "PUT",
                body: basket
            }),
            invalidatesTags: ["users"]
        }),
        cleaningBasket: build.mutation({
            query: ({_id}) => ({
                url: '/api/user/cleaningBasket',
                method: "PUT",
                body: {_id}
            }),
           invalidatesTags: ["users"]
        }),
        addDefaultAddress: build.mutation({
            query: (user) => ({
                url: '/api/user/addDefaultAddress',
                method: "PUT",
                body: user
            }),
            invalidatesTags: ["users"]
        })
    })

})

export const {useGetUsersQuery, useUpdateUserMutation,useAddDefaultAddressMutation,useCleaningBasketMutation,useUpdateBasketMutation} = userApiSlice