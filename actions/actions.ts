"use server"

import { adminDB } from "@/database/firebase-admin"
import liveblocks from "@/lib/liveblocks"
import { auth } from "@clerk/nextjs/server"

export async function createNewDocument(){
    auth.protect()

    const {sessionClaims}=await auth()
    
    const collectionRef=adminDB.collection("documents")
    const docRef= await collectionRef.add({
        title: "New Doc"
    })

    await adminDB.collection("users").doc(sessionClaims?.email!).collection("rooms").doc(docRef.id).set({
        userId:sessionClaims?.email,
        role:"owner",
        createdAt:new Date(),
        roomId:docRef.id,
    })

    return {docId:docRef.id}

}

export async function deleteDocument(roomId:string){
    auth.protect() //Ensuring user is logged in
    console.log("Deleting document"+roomId+"...")

    try {
        
        await adminDB.collection("documents").doc(roomId).delete()
        const query=await adminDB
        .collectionGroup("rooms")
        .where("roomId","==",roomId)
        .get()

        // DELETING ROOM FROM USERS COLLECTION
        const batch=adminDB.batch()
        query.docs.forEach((doc) => {
            batch.delete(doc.ref)
        })

        await batch.commit()
        await liveblocks.deleteRoom(roomId)

        return {success:true}

    } catch (error) {
        console.error("Error deleting document"+error)
        return {success:false}
    }
    
}

export async function inviteUserToDocument(roomId: string, email: string){
        auth.protect()
        console.log("Inviting user to document"+roomId+email);

        try {
            await adminDB
            .collection('users')
            .doc(email)
            .collection('rooms')
            .doc(roomId)
            .set({
                userId:email,
                role:"editor",
                createdAt:new Date(),
                roomId
            })

            return {success:true}
        } catch (error) {
            console.log(error);
            return {success:false}
        }
        
}
export async function removeUserFromDocument(roomId: string, userId: string){
        auth.protect()
        console.log("Removing user to document"+roomId+userId);

        try {
            await adminDB
            .collection('users')
            .doc(userId)
            .collection('rooms')
            .doc(roomId)
            .delete();

            return {success:true}
        } catch (error) {
            console.log(error);
            return {success:false}
        }
        
}