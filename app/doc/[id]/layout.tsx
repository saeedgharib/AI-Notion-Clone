import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server"
import React from "react"

function layout({children,params:{id}}:{children:React.ReactNode;params:{id:string}}) {


    auth.protect()

  return (
    <RoomProvider roomId={id}>
      {children}
    </RoomProvider>
  )
}

export default layout