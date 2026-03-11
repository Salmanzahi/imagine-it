'use server'

import  { db } from '@/services/firebase'
import { collection, setDoc, doc } from 'firebase/firestore'
import { genai } from '@/services/gemini'




export async function generateAi(prompt: string, mode: string){


    try {
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
    return { status: true} 

    } catch (e){
        console.log(e)
        return { errorstack: e, status: false}
    }

    

}


async function pushDB(response: string){
    const ref = doc(db, 'code', 'wonderhoy')
    await setDoc(ref, {
        code: response
    })

}



export async function enhancePrompt (prompt: string){
    try {
     const res = genai.getGenerativeModel({model: 'gemini-2.5-flash'})
    const text = await res.generateContent(`
   ### ROLE
You are a senior Prompt Engineer specializing in optimizing prompts for large language models (LLMs).  
Your responsibility is to transform vague, short, or poorly structured user prompts into highly effective, precise, and context-rich prompts that produce expert-level outputs.

---

### OBJECTIVE
Rewrite the user's prompt so that any advanced LLM can clearly understand the intent, context, constraints, and expected output format.

The enhanced prompt must be significantly clearer, more structured, and more actionable than the original.

---

### PROCESS

Follow these steps internally before generating the enhanced prompt:

1. **Identify the Core Intent**
   Determine the user's primary objective.  
   Classify the task type if possible (e.g., coding, explanation, research, strategy, writing, analysis).

2. **Infer Missing Context**
   If the user prompt lacks context, infer reasonable assumptions to make the prompt usable.

3. **Add Expert Persona**
   Assign a suitable expert role to the AI that matches the task domain  
   (e.g., software engineer, data scientist, historian, technical writer).

4. **Clarify the Task**
   Rewrite the user's request using precise verbs and well-defined goals.

5. **Add Constraints**
   Specify rules that guide the output quality, such as:
   - depth of explanation
   - style
   - accuracy requirements
   - things to avoid

6. **Define Output Structure**
   Clearly define the format the AI should follow (bullet points, code blocks, step-by-step explanation, tables, etc).

---

### PROMPT STRUCTURE

The enhanced prompt MUST use the following structure:

Role:
Define the expert persona the AI should adopt.

Context:
Provide background information and clarify the situation.

Task:
Describe the exact task the AI must perform.

Constraints:
Define rules, boundaries, or things to avoid.

Output Format:
Specify exactly how the answer should be structured.

---

### OUTPUT REQUIREMENTS

- Do NOT answer the user's request.
- ONLY produce the improved prompt.
- Keep the prompt concise but highly informative.
- Ensure the prompt is suitable for use with any advanced LLM.

---

### OUTPUT FORMAT

Return the enhanced prompt inside a copyable block: ${prompt}

        `)
    const parseres = text.response.text()
    return {output: parseres, status: true}
    } catch (e) {
        console.log(e)
        return {output: e, status: false}
    }
   
}