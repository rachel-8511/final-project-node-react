import apiSlice from "../../app/apiSlice";

const basketApiSlice = apiSlice.injectEndpoints({

    endpoints: (build) => ({

        addProduct: build.mutation({
            query: (data) => ({
                url: '/api/user/addProduct',
                method: "PUT",
                body: data
            }),
            //  invalidatesTags: ["user"]
        }),

        deleteProduct: build.mutation({
            query: ({ _id, product_id }) => ({
                url: '/api/user/deleteProduct',
                method: "PUT",
                body: { _id: _id, product_id: product_id }
            })
            // invalidatesTags: ["products"]
        }),
        updateProductQuantity: build.mutation({
            query: ({ _id, product_id,quantity }) => ({
                url: '/api/user/updateProductQuantity',
                method: "PUT",
                body: { _id: _id, product_id: product_id,quantity:quantity }
            })
            // invalidatesTags: ["products"]
        }),
    })
})

export const { useAddProductMutation,useDeleteProductMutation,useUpdateProductQuantityMutation } = basketApiSlice