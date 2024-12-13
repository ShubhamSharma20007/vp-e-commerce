//  const
export const HOST =
    import.meta.env.VITE_BACKEND_URL;
export const VERSION_ROUTE =
    import.meta.env.VITE_VERSION_URL;

export const IMAGE_PATH = `${HOST}/uploads` //  endpoint should be imagePath


//  Users
export const USER_LOGIN = `${VERSION_ROUTE}/user/login`;
export const USER_REGISTER = `${VERSION_ROUTE}/user/register`;
export const USER_PROFILE = `${VERSION_ROUTE}/user/profile`;
export const USER_LOGOUT = `${VERSION_ROUTE}/user/logout`;


//  Products
export const PRODUCT_LIST = `${VERSION_ROUTE}/product/product-list`;
export const PRODUCT_ADD = `${VERSION_ROUTE}/product/add-product`;
export const PRODUCT_GROUP_WISE = `${VERSION_ROUTE}/product/product-group-wise`;
export const PRODUCT_GET = `${VERSION_ROUTE}/product/get-product`; // :id in params
export const PRODUCT_UPDATE = `${VERSION_ROUTE}/product/update-product`; // :id in params
export const PRODUCT_CATEGORY_WISE = `${VERSION_ROUTE}/product/get-category-product`; // :category in params
export const PRODUCT_CATEGORIES = `${VERSION_ROUTE}/product/categories`;
export const PRODUCT_COUNT = `${VERSION_ROUTE}/product/total-product-count`;
export const PRODUCT_DELETE = `${VERSION_ROUTE}/product/delete-product`; // :id in params

// export const PRODUCT_QUERY_FILTER = `${VERSION_ROUTE}/product/filter-product`;



//  Carts
export const CART_ADD = `${VERSION_ROUTE}/cart/add-to-cart`;
export const CART_GET = `${VERSION_ROUTE}/cart/get-cart-item`;
export const CART_LENGTH = `${VERSION_ROUTE}/cart/cart-item-length`
export const CART_UPDATE = `${VERSION_ROUTE}/cart/update-cart-item`
export const CART_DELETE = `${VERSION_ROUTE}/cart/delete-cart-item` // :id or :qty in params



// payments
export const PAYMENT_ADD = `${VERSION_ROUTE}/payment`;