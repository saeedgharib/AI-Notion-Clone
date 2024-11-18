"use client"

import LiveBlocksProvider from "@/components/LiveblocksProvider"


function layout({children}:{
    children:React.ReactNode
}) {
  return (
    <LiveBlocksProvider>
        {children}
    </LiveBlocksProvider>
  )
}

export default layout
