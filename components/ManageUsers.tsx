


"use client"
import React, { FormEvent, useState, useTransition } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  } from "@/components/ui/dialog"
import { Button } from './ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { deleteDocument, inviteUserToDocument, removeUserFromDocument } from '@/actions/actions'
import { Input } from './ui/input'
import { useUser } from '@clerk/nextjs'
import useOwner from '@/lib/useOwner'
import { useRoom } from '@liveblocks/react/suspense'
import { useCollection } from 'react-firebase-hooks/firestore'
import { collectionGroup, query, where } from 'firebase/firestore'
import { db } from '@/database/firebase'

function ManageUsers() {
    const {user}=useUser()
    const isOwner=useOwner()
    const room =useRoom()
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition() 
   
    const [usersInRoom]=useCollection(
        user && query(collectionGroup(db,"rooms"),where("roomId","==",room.id))
    )
    
    const handleDelete = async(userId:string) => {
       startTransition(async() => {
        if(!user) return

        const{success}=await removeUserFromDocument(room.id,userId)
        if(success){
            toast.success("User removed from room successfully")
        }else{
            toast.success("Failed to remove user from room ")

        }
       })

    }
      
    
  return (
      
    <Dialog open={isOpen} onOpenChange={setIsOpen} >
  <Button asChild variant='outline'>
  <DialogTrigger>Users ({usersInRoom?.docs.length})</DialogTrigger>
  </Button>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Users with Access</DialogTitle>
      <DialogDescription>
        List of users who have access to this document
      </DialogDescription>
    </DialogHeader>
       <hr className='my-2'/>

       <div className='flex flex-col space-y-2'>
        {usersInRoom?.docs.map((doc)=>(
                <div key={doc.data().userId} className='flex items-center justify-between'>
                      <p className='font-loght'>
                        {
                            doc.data().userId===user?.emailAddresses[0].toString()
                            ? `You ${doc.data().userId}`
                            : doc.data().userId
                        }
                        
                        </p>  
                        <div className='flex items-center gap-2'>
                            <Button variant='outline'>
                                {doc.data().role}
                            </Button>
                            {
                                isOwner && doc.data().userId !== user?.emailAddresses[0].toString() &&
                                (
                                    <Button
                                    variant='destructive'
                                    onClick={() =>handleDelete(doc.data().userId)}
                                    disabled={isPending}
                                    size="sm"
                                    >
                                        {isPending?"Removing...":"X"}
                                    </Button>
                                )
                            }
                        </div>
                </div>

        ))}
       </div>
  </DialogContent>
</Dialog>

  )
}

export default ManageUsers
