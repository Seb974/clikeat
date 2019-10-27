function getTotalTTC(cartItems)
{
    let totalTTC = 0;
    cartItems.forEach(item => {
        totalTTC += (item.product.price * item.quantity);
    });
    return totalTTC;
}

function getTotalTax(cartItems)
{
    let totalTax = 0;
    cartItems.forEach(item => {
        totalTax += ((item.product.price * item.quantity)/(item.product.tva.taux + 1));
    });
    return totalTax;
}

function getTotalHT(cartItems)
{
    return (getTotalTTC(cartItems) - getTotalTax(cartItems));
}

export { getTotalTTC, getTotalTax, getTotalHT };