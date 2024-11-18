"use client"
import React, { useEffect, useState } from 'react'
import NewDocumentButton from './NewDocumentButton'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "./ui/sheet"
import { MenuIcon } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import {useCollection} from 'react-firebase-hooks/firestore'
import { collectionGroup,  DocumentData, query, where } from 'firebase/firestore'
import { db } from '@/database/firebase'
import SidebarOption from './SidebarOption'

interface RoomDocument extends DocumentData {
  createdAt: string
  role:"owner"|"editor"
  roomId: string
  userId: string
}

function Sidebar() {
  const {user} = useUser()

const [groupedData, setGroupedData] = useState<{owner:RoomDocument[],editor:RoomDocument[]}>({
  owner:[],
  editor:[]
})

  const [data,loading,error]=useCollection(
    user &&(
      query(collectionGroup(db,"rooms"),
      where("userId","==",user.emailAddresses[0].toString()))
    ) 
  )
  console.log(error?.message);
   
  
  useEffect(() => {
  if(!data) {
    return
  }

    const grouped=data.docs.reduce<{
      owner:RoomDocument[]
      editor:RoomDocument[]
    }>(
      (acc,curr)=>{
        const roomData=curr.data() as RoomDocument
        if (roomData.role==="owner") {
          acc.owner.push({
            id:curr.id,
            ...roomData
          })
        }else{
          acc.editor.push({
            id:curr.id,
            ...roomData
          })

        }
        return acc
      },
      {
          owner:[],
          editor:[]
      }
    )
    setGroupedData(grouped)
  }, [data])


    const menuOptions=(
        <>
        <NewDocumentButton/>
        {/* MY DOCUMENTS */}

        <div className='flex py4 flex-col space-y-4 md:max-w-36'>

        {
          groupedData.owner.length ===0 ?(
            <h2 className='text-gray-500 font-semibold text-sm'>
              No Documents found
            </h2>
          )
          :
          (
            <>
            <h2 className='text-gray-500 font-semibold text-sm'> My Documents</h2>
            {
              groupedData.owner.map((doc) =>(
                // <p>{doc.roomId}</p>
                <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`}/>
              ))
            }
            </>

)
}
  {
    groupedData.editor.length > 0 &&(
      <>
      
      <h2 className='text-gray-500 font-semibold text-sm'>
      Shared With Me
    </h2>
     
      {groupedData.editor.map((doc) =>(
        
        <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`}/>
      ))}
      </>
    
  )
}
</div>

        </>
    )
  return (
    <div className='p-2 md:p-5 bg-gray-300 relative'>

    <div className='md:hidden'>

        <Sheet>
  <SheetTrigger>
    <MenuIcon
        className='p-2 hover:opacity-30 rounded-lg '
        size={40}
    />
  </SheetTrigger>
  <SheetContent side='left'>
    <SheetHeader>
      <SheetTitle>Menu</SheetTitle>
      <div>
      {menuOptions}
      </div>
      
    </SheetHeader>
  </SheetContent>
</Sheet>
        </div>


<div className='hidden md:inline'>

    {menuOptions}
</div>
    </div>
  )
}

export default Sidebar
