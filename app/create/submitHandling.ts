'use server'

import  { db } from '@/services/firebase'
import { collection, setDoc, doc } from 'firebase/firestore'
import { genai } from '@/services/gemini'




export async function generateAi(prompt: string, mode: string){

    const res = genai.getGenerativeModel({model: mode})
    const text = await res.generateContent(`

        ### ROLE: Pure HTML Generator
### TASK: Generate valid HTML code based on user requirements.

### STRICT OPERATING CONSTRAINTS:
1. OUTPUT FORMAT: Output ONLY the raw HTML code including css and javascript on html code.
2. NO MARKDOWN: Do not use markdown code blocks 
3. NO NATURAL LANGUAGE: Do not include introductory text, explanations, or concluding remarks.
4. NO COMMENTS: Do not include HTML comments () or CSS/JS comments within the code.
5. NO PLACEHOLDERS: Generate full, functional code without "// add more here" or "" markers.
6. VALIDITY: Ensure the code is syntactically correct and includes the <!DOCTYPE html> declaration unless specified otherwise.

### VIOLATION TRIGGER:
If you include any text that is not valid HTML, you have failed the task. Start the response immediately with the first tag.

YOU MUST FOLLOW THIS THEME ${prompt}
        `)
    const response = text.response.text()
    console.log(response)
    pushDB(response)

}


async function pushDB(response: string){
    const ref = doc(db, 'code', 'wonderhoy')
    await setDoc(ref, {
        code: response
    })

}

