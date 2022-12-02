// replace YOUR_G_ID with the pixel ID provided in your GA4 property data stream (AKA Measurement ID)
const gtagID = 'YOUR-G-ID'; //G-XXYYYYXYYX

const script = document.createElement('script');

script.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=' + gtagID);
script.setAttribute('async', '');
document.head.appendChild(script);

window.dataLayer = window.dataLayer || [];

function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', gtagID);


// Fire on add to cart
analytics.subscribe("product_added_to_cart", async (event) => {

    //get item from Shopify event
    const sItem = event.data.cartLine.merchandise;

    //re-shape to fit GA4 item schema
    const gItem = {
        item_id:  sItem.id,
        item_name:  sItem.product.title,
        currency: "USD",
        item_variant:  sItem.title,
        price: event.data.cartLine.cost.totalAmount.amount,
        quantity: event.data.cartLine.quantity
    }

    //pass to GA4
    gtag("event", "add_to_cart", {
        currency: "USD",
        value: event.data.cartLine.cost.totalAmount.amount,
        items: [gItem]
    });

});

// Fire on initiate checkout
analytics.subscribe("checkout_started", async (event) => {
    const gtagItems     = [];

    //get items from Shopify event
    const shopifyItems  = event.data.checkout.lineItems;

    //loop through items, re-shape each one to fit GA4 item schema, and push into array
    if (shopifyItems) {
        shopifyItems.forEach(sItem => {
            const gItem = {
                item_id: sItem.variant.id,
                item_name: sItem.title,
                currency: event.data.checkout.currencyCode,
                item_variant: sItem.variant.title,
                price: sItem.variant.price.amount,
                quantity: sItem.quantity
            }
            gtagItems.push(gItem);
        });
    }
  
    //pass to GA4
    gtag("event", "begin_checkout", {
        value: event.data.checkout.totalPrice.amount,
        currency: event.data.checkout.currencyCode,
        items: gtagItems
    });
});

// Fire on purchase
analytics.subscribe("checkout_completed", async (event) => {
    const gtagItems = [];

    //get items from Shopify event
    const shopifyItems = event.data.checkout.lineItems;

    //loop through items, re-shape each one to fit GA4 item schema, and push into array
    if (shopifyItems) {
        shopifyItems.forEach(sItem => {
            const gItem = {
                item_id: sItem.variant.id,
                item_name: sItem.title,
                currency: event.data.checkout.currencyCode,
                item_variant: sItem.variant.title,
                price: sItem.variant.price.amount,
                quantity: sItem.quantity
            }
            gtagItems.push(gItem);
        });
    }
  
    //pass to GA4
    gtag("event", "purchase", {
        transaction_id: event.data.checkout.order.id,
        value: event.data.checkout.totalPrice.amount,
        tax: event.data.checkout.totalTax.amount,
        shipping: event.data.checkout.shippingPrice.amount,
        currency: event.data.checkout.currencyCode,
        items: gtagItems
    });

});
