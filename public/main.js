const submit = document.getElementById('clickMe');
const stockUp = document.getElementsByClassName('stockBtn');

//adding stock from owner page
Array.from(stockUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.childNodes[1].childNodes[1].innerText
        const code = this.parentNode.childNodes[3].childNodes[1].innerText
        const stock = parseInt(this.parentNode.childNodes[7].childNodes[1].innerText, 10)
        const newStock = parseInt(this.parentNode.childNodes[11].value, 10)
        fetch('items', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'code': code,
            'stock': stock,
            'newStock':newStock
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

//clicking submit button on index.ejs
  submit.addEventListener('click', function(){
    const code = document.getElementById('vendNum').value;
    // let price = ""
    // //conditional for what the user enters
    // switch(code) {
    //   case "ITEMCODE":
    //     price = 0;
    //   case "ITEMCODE":
    //     price = 0;
    //   case "ITEMCODE":
    //     price = 0;
    //   case "ITEMCODE":
    //     price = 0;
    //   case "ITEMCODE":
    //     price = 0;
    //   case "ITEMCODE":
    //     price = 0;
    //   default:
    //     alert("You have entered an invalid item code")
    // }
    console.log("wazzzzzzzup" + code);
    fetch('item', {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'code': code
      })
    })
    .then(response => {
      if (response.ok) return response.json();
      console.log("hi")
    })
    .then(data => {
      console.log(data)
    })
    // fetch('bank', {
    //   method: 'put',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify({
    //     'price': price,
    //   })
    // })
    // .then(response => {
    //   if (response.ok) return response.json()
    // })
    // .then(data => {
    //   console.log(data)
    // })
    // fetch('items', {
    //   method: 'put',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify({
    //     'code': code,
    //   })
    // })
    // .then(response => {
    //   if (response.ok) return response.json()
    // })
    // .then(data => {
    //   console.log(data)
    // })
  // });
})
