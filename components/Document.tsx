"use client"

import React, { FormEvent, useEffect, useState, useTransition } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { updateDoc,doc } from 'firebase/firestore'
import { db } from '@/database/firebase'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import Editor from './Editor'
import useOwner from '@/lib/useOwner'
import DeleteDocument from './DeleteDocument'
import InviteUser from './InviteUser'
import ManageUsers from './ManageUsers'
import Avatars from './Avatars'

function Document({id}:{id:string}) {
    const [input,setInput]=useState("")
    const [isUpdating,startTrasition]=useTransition()
    const [data,loading,error]=useDocumentData(doc(db,"documents",id))
    const isOwner =useOwner()
   
    useEffect(()=>{
      if(data){
        setInput(data.title)
      }
    },[data])

    const updateTitle=(e:FormEvent) => {
      e.preventDefault()
      if(input.trim()){
        startTrasition(async () => {
            await updateDoc(doc(db,"documents",id),{
              title:input  
            })

        })
      }      
    }
  return (
    <div className='flex-1 h-4 bg-white p-5'>
      
      <div className='flex max-w-7xl mx-auto justify-between pb-5'>
        {/* FORM DIV */}
        <form onSubmit={updateTitle} className='flex flex-1 space-x-2'>
            <Input
            value={input}
            className='bg-white'
            onChange={(e)=>setInput(e.target.value)}
            />
            <Button disabled={isUpdating} type='submit'>{isUpdating?"Updating":"Update"}</Button>
          {isOwner&&(
            <>
              {/* INVITE USER */}
              <InviteUser/>
            {/* DELETE DOCUMENT */}
              <DeleteDocument/>
            </>
          )}
        </form>


      </div>

      <div className='flex max-w-6xlvmx-auto justify-between items-center mb-5'>
        
        {/* MANAGE USERS */}
          <ManageUsers/>

        {/* AVATARS */}
        <Avatars/>
      </div>
     
      <hr className='pb-10'/>
      <Editor/>
    </div>
  )
}

export default Document
 