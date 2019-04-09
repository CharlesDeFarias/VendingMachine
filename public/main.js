const btn = document.getElementsByClassName('clickable');
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
Array.from(btn).forEach(function(element) {
  element.addEventListener('click', function(){
    const input = document.getElementById('vendNum')
    if(this.id!=="clickMe"){
      input.value=this.innerText
    }
    let code = input.value;
    const dispImg = document.getElementById('dispImg');
    const dispPrice= document.getElementById('dispPrice');
    const dispName= document.getElementById('dispName');
    console.log(code)
    fetch('item', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'code': code
      })
    })
    .then((result, err) => {
      return result.json();
    })
    .then((response, err) => {
      console.log(response)
      dispImg.src= response.value.pic;
      dispPrice.innerText= response.value.price;
      dispName.innerText = response.value.name;
      let priceAdd = parseInt(dispPrice.innerText, 10)
      console.log(priceAdd)
      moMoney(priceAdd)
    })
  })
})

function moMoney(price){
  fetch('bank', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'price': price
    })
  })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      // window.location.reload(true)
    })
}
