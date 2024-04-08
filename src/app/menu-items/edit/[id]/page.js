'use client';

import { useProfile } from "../../../../components/UseProfile";
import { useEffect, useState } from "react";
import { UserTabs } from "../../../../components/layout/UserTabs";
import MenuItemForm from "@/components/layout/MenuItemForm";


import Link from "next/link";
import Left from "@/components/icons/Left";
import toast from "react-hot-toast";
import { redirect, useParams } from 'next/navigation';


export default function EditMenuItemPage(){
    
    const {id} = useParams();
    const [menuItem, setMenuItem] =useState(null);
    const [redirectToItems, setRedirectToItems] = useState(false);
    const{loading, data} = useProfile();

    useEffect(()=>{
        fetch('/api/menu-items').then(res =>{
            res.json().then(items =>{
                const item = items.find(i => i._id === id);
                setMenuItem(item);
            });
        })
    }, []);
    
    
    async function handleFormSubmit(ev, data){
        ev.preventDefault();
        data= {...data,_id:id};
        const savingPromise = new Promise(async (resolve, reject)=>{
            const response = await fetch('/api/menu-items',{
                method:'PUT',
                body: JSON.stringify(data),
                headers: {'Content-type':'appliation/json'},
        });
        if (response.ok)
        resolve();
        else
        reject();
        });
        await toast.promise(savingPromise,{
            loading:'Saving this tasty item',
            success:'Saved',
            error:'Error',
        });

        setRedirectToItems(true);
    }

    async function handleDeleteClick(){
        const promise = new Promise(async(resolve, reject) => {
            const res = await fetch('/api/menu-items?_id='+id, {
                method:'DELETE',
            });
            if(res.ok){
                resolve();
            } else {
                    reject();
                }            
        });

         await toast.promise(promise,{
            loading:'Deleting menu item...',
            success:'Menu item deleted',
            error:'Error',
        })
        setRedirectToItems(true);
    }
  
    if (redirectToItems) {
      return redirect('/menu-items');
    }

    if(loading){
        return 'loading user info...'
    }

    if(!data.admin){
        return 'Not an admin'
    }

    return (
        <section className="mt-8">
        <UserTabs isAdmin={true}/>
        <div className="max-w-md mx-auto mt-8">
            <Link href={'/menu-items'} className="button">
                <Left/><span>Return to Menu items </span> 
            </Link>
        </div>
        <MenuItemForm menuItem={menuItem} onSubmit={handleFormSubmit}/>
        <div className="max-w-md mx-auto mt-2">
        <div className="max-w-xs ml-auto pl-4">
          <button onClick={handleDeleteClick}>Delete this item</button>
        </div>
      </div>
    </section>
    );
}