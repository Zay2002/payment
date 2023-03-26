require("dotenv").config()

const express = require("express");
const paypal = require("@paypal/checkout-server-sdk");
const app = express();

app.set("view-engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

const environment = process.env.ENV ==="production" 
? paypal.core.LiveEnvironment 
: paypal.core.SandboxEnvironment

const paypalClient = new paypal.core.PayPalHttpClient(
    new environment(
        process.env.CLIENT_ID,
        process.env.SECRET_ID
    )
);

const Ecommerce = new Map ([
    [1, {price: 100, name: "food"}],
    [2, {price: 200, name: "electronics"}]
]);

app.get("/", (req, res) => {
    res.render("test.ejs")
});


app.post("/create-order", async(req, res) => {
    const request = new paypal.orders.OrdersCreateRequest();

    const tottal = req.body.items.reduce((sum, item) => {
        return sum + (Ecommerce.get(item.id).price * item.quantity);
    },0) 
    request.prefer("return-representation");
    request.requestBody({
       intent: "CAPTURE",
       purchase_units:[
        {
            amount: {
                currency_code: "USD",
                value: tottal,
                breakdown: {
                    item_total: {
                        currency_code: "USD",
                        value: tottal
                    }
                }
                
            },
            items: req.body.items.Map(item =>{
                const product = Ecommerce.get(item.id);
                return {
                    name: thing.name,
                    unit_amount: {
                        currency_code: "USD",
                        value: thing.price
                    },
                    quantity: item.quantity
                }
        }),
        },  
        ],
    });
    try{
        const order = await paypalClient.execute(request)
        res.json({ id: order.result.id})
    } catch(err){
        console.log(err);
    }
});

app.listen(3000, ()=>{
    console.log("server is running at http://localhost:3000");
})