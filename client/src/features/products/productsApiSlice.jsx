import apiSlice from "../../app/apiSlice";

const productApiSlice = apiSlice.injectEndpoints({

    endpoints: (build) => ({
        getProducts: build.query({
            query: () => ({
                url: '/api/product'
            }),
            providesTags: ["product"]
        }),
        getProductById: build.query({
            query: (id) => ({
                url: `/api/product/${id}`
            }),
            providesTags: ["product"]
        }),
        addProductItem: build.mutation({
            query: (product) => ({
                url: '/api/product',
                method: "POST",
                body: product
            }),
            invalidatesTags: ["products"]
        }),
        updateProductItem: build.mutation({
            query: (product) => ({
                url: '/api/product',
                method: "PUT",
                body: product
            }),
            invalidatesTags: ["products"]
        }),
        deleteProductItem: build.mutation({
            query: ({_id}  ) => ({
                url: `/api/product`,
                method: "DELETE",
                body: { _id: _id }
            }),
            invalidatesTags: ["products"]
        })
    })

})

export const {useGetProductByIdQuery, useGetProductsQuery, useAddProductItemMutation,useDeleteProductItemMutation,useUpdateProductItemMutation } = productApiSlice