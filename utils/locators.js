export const getLocatorSubstringFromProductName = (productName) => {
    return productName.trim().toLowerCase().replaceAll(' ', '-');
}
