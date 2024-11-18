"use client"
import React, { useState, useTransition } from 'react'
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
import { deleteDocument } from '@/actions/actions'

function DeleteDocument() {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition() 
    const pathname = usePathname()
    const router=useRouter()

    const handleDelete = async() => {
        const roomId =pathname.split("/").pop()
        if(!roomId) return

        startTransition(async()=>{
            const {success}= await deleteDocument(roomId)

            if (success) {
                setIsOpen(false)
                router.replace("/")
                toast.success("Room deleted successfully")
            } else {
                toast.success("Failed to delete room")
                
            }
        })


    }
         
  return (
      
    <Dialog open={isOpen} onOpenChange={setIsOpen} >
  <Button asChild variant='destructive'>
  <DialogTrigger>Delete</DialogTrigger>
  </Button>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure you want to Delete?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will delete the document
        ,removing all users from the document
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="sm: justify-end gap-2 ">
<Button
className='gap-2'
type="button"
variant="destructive"
onClick={handleDelete}
disabled={isPending}
>
{isPending ? "Deleting .. " : "Delete"}
</Button>
<DialogClose asChild>
<Button type="button" variant="secondary">
Close
</Button>
</DialogClose>
</DialogFooter>
  </DialogContent>
</Dialog>

  )
}

export default DeleteDocument
