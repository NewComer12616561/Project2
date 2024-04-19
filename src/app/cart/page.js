'use client';
import { CartContext, cartProductPrice } from "@/components/AppContext";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Trash from "@/components/icons/Trash";
import AddressInputs from "@/components/layout/AddressInputs";
import { useProfile } from "@/components/UseProfile";
import toast from "react-hot-toast";


export default function CartPage(){
    const {cartProducts, removeCartProducts} = useContext(CartContext);
    const {data:profileData} =useProfile();
    const [ address,setAddress] =useState({});



  useEffect(() => {
    if (profileData?.city) {
      const {phone, streetAddress, city, postalCode, country} = profileData;
      const addressFromProfile = {
        phone,
        streetAddress,
        city,
        postalCode,
        country
      };
      setAddress(addressFromProfile);
    }
  }, [profileData]);

    let subtotal =0;
    for(const p of cartProducts){
        console.log(p);
        subtotal += cartProductPrice(p);
    }

    function handleAddressChange(propName, value){
        setAddress(prevAddress => ({...prevAddress,[propName]:value})
        );
    }

    async function proceedToCheckout(ev){
        ev.preventDefault();
        //Grab address and cart items 
        const promise = new Promise((resolve,reject)=>{
            fetch('/api/checkout',{
                method: 'POST',
                headers: {'Content-Type':'appliction/json'},
                body: JSON.stringify({
                    address,
                    cartProducts,
                }),
    
            }). then(async(response) =>{
                if(response.ok){
                    resolve();
                    window.location  = await response.json();
                }
                else{
                    reject();
                }
               
            }); 
        });
        toast.promise(promise,{
            loading:'Preparing your order',
            success:'Redirecting to payment',
            error:'Something went wrong...'
        })

    }
    console.log({cartProducts});


    return (
        <section className="mt-8">
            <div className="text-center">
                <SectionHeaders mainHeader="Cart" />
            </div>
            <div className=" mt-8 grid gap-8 grid-cols-2">
                <div>
                   {cartProducts?.length === 0 &&(
                    <div>No items in your cart</div>
                   )}
                   {cartProducts?.length > 0 && cartProducts.map(
                    (product, index) =>(
                    <div className="flex items-center gap-4  
                    border-b py-4">
                        <div className="w-24">
                            <Image src={product.image} alt={''}
                            width={240} height={240} />
                        </div>
                        <div className="grow">
                        <h3 className="font-semibold">
                            {product.name}
                        </h3>
                        {product.size && (
                            <div className="txt-sm ">
                                Size: <span>{product.size.name}</span> </div>
                        )}
                        {product.extras?.length > 0 &&(
                            <div className="text-sm text-gray-500">
                                {product.extras.map(extra =>(
                                    <div>{extra.name}+ ${extra.price}</div>
                                ))}
                            </div>
                        )}
                        </div>
                       <div className="text-lg font-semibold">
                            ${cartProductPrice(product)}
                        </div>
                        <div className="ml-2">
                            <button
                            onClick={()=> removeCartProducts(index)}
                            type="button"
                            className="p-2">
                                <Trash />
                            </button>
                        </div>
                    </div>
                   ))}
                
                   <div className="py-2 pr-16 flex justify-end items-center">
                    <div className="text-gray-500">
                        Total Price:<br />
                        Delivery: <br />
                        Total: 
                    </div>  
                    <div className=" font-semibold pl-2 text-right">
                        ${subtotal} <br />
                        $5<br />
                        ${subtotal + 5} <br/>
                    </div>
                   </div>

                  

                </div>  


                <div className="bg-gray-100 p-4 rounded-lg">
                    <h2>Checkout</h2>
                    <form onSubmit={proceedToCheckout}>
                       
                        <AddressInputs 
                            addressProps ={address}
                            setAddressProp ={ handleAddressChange}/>
                         <button type="submit">Pay ${subtotal+5}</button>
                    </form>
                    
                </div> 
            </div>
            
        </section>
    )
}