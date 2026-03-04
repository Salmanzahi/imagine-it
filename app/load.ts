'use server'

import  { db } from '@/services/firebase'
import { getDoc, doc } from 'firebase/firestore'



export async function loadCode(): Promise<string | null> {
    const ref = doc(db, 'code', 'wonderhoy')
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return snap.data()?.code ?? null
}