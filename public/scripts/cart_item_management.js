const cartItemUpdateFormElement=document.querySelectorAll('.cart-item-management');
async function updateCartItem(event){
    event.preventDefault();
    const form=event.target;
    const productId=form.dataset.productid;
    const csrfToken=form.dataset.csrf;
    const quantity=form.firstElementChild.value;
    let response;
   try{
       response=await fetch('/cart/items',{
            method:'PATCH',
            body:JSON.stringify({
                productId:productId,
                quantity:quantity
            }),
            headers:{
                'Content-Type':'application/json',
                "csrf-token":csrfToken
            }
        })
   }catch(error){
    alert('Something went Wrong');
    return;
   }
   if(!response.ok){
    alert('Something went Wrong');
    return;
   }
   const responseData=await response.json();
   
}
for (const formElement of cartItemUpdateFormElement){
    formElement.addEventListener('submit',updateCartItem)
}