paypal.Buttons({
    createOrder() {
      return fetch("/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: json.stringify({
            items: [
                {id: 1, quantity: 2},
                {id: 2, quantity: 3}
            ]
        })
      }).then(res =>{
        if(res.ok) return res.json();
        return res.json().then(err => Promise.reject(err));
      }).then(( {id} ) =>{
        return id;
      })
    },
    onApprove(data , actions) {
      return actions.order.capture().then(function(){
        console.log("succsess");
      })
    }
  }).render('#paypal-button-container');