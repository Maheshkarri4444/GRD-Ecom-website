const backapi = "http://localhost:4000";

const Allapi = {
    signup: {
        url: `${backapi}/api/signup`,
        method: "POST",
      },
    login: {
      url: `${backapi}/api/login`,
      method: "POST",
    },
    logout: {
      url: `${backapi}/logout`,
      method: "POST",
    },
    editPorfile: {
      url: `${backapi}/api/edit-profile`,
      method:"PUT",
    },
    getAllCategories:{
      url: `${backapi}/api/admin/category/all`,
      method:"GET",
    },
    editCategory:{
      url:(id)=> `${backapi}/api/admin/category/edit/${id}`,
      method:"PUT",
    },
    deleteCategory:{
      url:(id)=> `${backapi}/api/admin/category/delete/${id}`,
      method:"DELETE",
    },
    addCategory:{
      url: `${backapi}/api/admin/category/add`,
      method:"POST",
    },
    addProduct:{
      url: `${backapi}/api/admin/product/add`,
      method:"POST",
    },
    getAllProducts:{
      url: `${backapi}/api/admin/product/all`,
      method:"GET",
    },
    getProductById:{
      url:(id)=> `${backapi}/api/admin/admin/product/${id}`,
      method:"GET",
    },
    editProduct:{
      url:(id)=> `${backapi}/api/admin/product/update/${id}`,
      method:"PUT",
    },
    deleteProduct:{
      url:(id)=> `${backapi}/api/admin/product/delete/${id}`,
      method:"DELETE",
    },
    getCart:{
      url: `${backapi}/api/cart/`,
      method: "GET",
    },
    updateCart:{
      url: `${backapi}/api/cart/`,
      method: "PUT",
    },
    getAllBanners:{
      url: `${backapi}/api/admin/banner/banners`,
      method:"GET",
    },
    addBanner:{
      url: `${backapi}/api/admin/banner/banners`,
      method:"POST",
    },
    editBanner:{
      url:(id)=> `${backapi}/api/admin/banner/banners/${id}`,
      method:"PUT",
    },
    deleteBanner:{
      url:(id)=> `${backapi}/api/admin/banner/banners/${id}`,
      method:"DELETE",
    },
    getAllBlobs:{
      url: `${backapi}/api/admin/blob/blobs`,
      method:"GET",
    },
    createBlob:{
      url: `${backapi}/api/admin/blob/blobs`,
      method:"POST",
    },
    updateBlob:{
      url: `${backapi}/api/admin/blob/blobs`,
      method:"PUT",
    },
    deleteBlob:{
      url: `${backapi}/api/admin/blob/blobs`,
      method:"DELETE",
    },
}

export default Allapi;
