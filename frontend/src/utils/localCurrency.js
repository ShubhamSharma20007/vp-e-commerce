export const localCurrency = (price) => {
    if (typeof price === 'number' && price > 0) {
        return price.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    }
}