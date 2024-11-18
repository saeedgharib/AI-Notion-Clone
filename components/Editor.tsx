"use client"
import { useRoom, useSelf } from '@liveblocks/react/suspense'
import React, { useEffect, useState } from 'react'
import * as Y from 'yjs'
import {LiveblocksYjsProvider} from '@liveblocks/yjs'
import { Button } from './ui/button'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import '@blocknote/shadcn/style.css'
import '@blocknote/core/fonts/inter.css'
import { BlockNoteEditor } from '@blocknote/core'
import stringToColor from '@/lib/stringToColor'
import TranslateDocument from './TranslateDocument'
import ChatToDocument from './ChatToDocument'
type EditorProps={
    doc:Y.Doc
    provider:any
    darkMode:boolean

}

function BlockNote({doc,provider,darkMode}:EditorProps){
    const userInfo =useSelf((me)=>me.info)

    const editor:BlockNoteEditor=useCreateBlockNote({
        collaboration:{
            provider,

            fragment:doc.getXmlFragment('document-store'),

            user:{
                name:userInfo.name,
                color:stringToColor(userInfo?.email)
            }
        }
    })
    return(
        <div className='relative max-w-6xl mx-auto'>
            <BlockNoteView
                className='min-h-screen'
                editor={editor}
                theme={darkMode?"dark":"light"}
            />
        </div>
    )
}

function Editor() {

const room =useRoom()
const [doc, setDoc] = useState<Y.Doc>()
const [provider, setProvider] = useState<LiveblocksYjsProvider>()
const [darkMode, setDarkMode] = useState(false)


useEffect(() => {
    const YDoc = new Y.Doc()
    const YProvider = new LiveblocksYjsProvider(room,YDoc)
    setDoc(YDoc)
    setProvider(YProvider)


    return ()=>{
        YDoc.destroy()
        YProvider.destroy()

    }

}, [room])

if(!doc || !provider) return null

const style = `hover:text-white ${
    darkMode
    ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
    : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
}`


    return (
    <div className='max-w-6xl mx-auto'>
      <div className='flex items-center gap-2 justify-end mb-10'>
        {/* TRANSLATE DOCUMENT */}

        <TranslateDocument doc={doc}/>
        {/* CHAT TO DOCUMENT AI */}
        <ChatToDocument doc={doc}/>
        {/* DARK MODE */}
        <Button className={style} onClick={()=>setDarkMode(!darkMode)}>
            {darkMode? <SunIcon/>:<MoonIcon/>}
        </Button>
      </div>

      {/* BLOCKNOTE */}
      <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
    </div>
  )
}

export default Editor
