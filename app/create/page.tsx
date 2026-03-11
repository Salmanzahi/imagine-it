'use client'
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { generateAi, enhancePrompt} from "./submitHandling";
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner";
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item";
// import { retrieveDocs
//  } from "./submitHandling";
export default function Create() {
  const [textField, setTextField] = useState("");
  const [mode, setMode] = useState('gemini-2.5-flash')
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [promptBtnDisabled, setPromptBtnDisabled] = useState(false)


  // const router = useRouter();

  const handleGenerate = async () => {
    try {
      setBtnDisabled(true)
      await generateAi(textField, mode)
      const toastId = toast.success(`Code Generated Successfully,\nTo see the result please back to home !`, {
        action: (
          <Button variant="ghost" size="sm" onClick={() => { toast.dismiss(toastId); window.location.href = '/' }}>
            <ArrowLeft className="h-4 w-4" /> <p>
              Back
            </p>
          </Button>
        ),
        position: 'top-center'
      })
    } catch (e) {
      toast.error("Failed to Generate Code: " + e)
    } finally {
      setBtnDisabled(false)
    }
  }

  const handlePrompt = async () => {
    try {
      setPromptBtnDisabled(true)
      const prompt = await enhancePrompt(textField)
      setTextField(prompt as string)
      toast.success("Prompt Enhanced Successfully")
    } catch (e){
      toast.error("Failed to Enhance Prompt: " + e)
    } finally {
      setPromptBtnDisabled(false)
    }
  }

  return (
    <div className="p-4">
     
  {btnDisabled && 
  <>
   <Item className="justify-center w-3/4 md:w-1/2 mx-auto mt-12 p-2" variant='muted'>
  <ItemContent>
    <ItemTitle className="text-center">Let him cook 👨‍🍳 Dont Close This Page pls....</ItemTitle>
  </ItemContent>
  <ItemActions>
    <Spinner></Spinner>
  </ItemActions>
  </Item>
  </>
  }

      <Card className=" md:w-1/2 mx-auto justify-center mt-24">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Imagine It</CardTitle>
          <CardDescription className="text-center">Imagine ur imagination through AI</CardDescription>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldLabel>Prompt</FieldLabel>
            <FieldDescription>Tulis Prompt Mu !</FieldDescription>
            <Textarea placeholder="Buatkan saya game tentang simulasi menjadi presiden" className="" value={textField} onChange={(e) => setTextField(e.target.value)} />
            
              
          </Field>
          <Button variant='secondary' onClick={handlePrompt} disabled={promptBtnDisabled} className='mt-2'>Bantu ngeprompt wok {promptBtnDisabled && <Spinner />}</Button>
          <Field className="mt-4">
            <FieldLabel>Mode AI</FieldLabel>
            <FieldDescription>Pilih Mode AI !</FieldDescription>
            <Select value={mode} onValueChange={(e) => setMode(e)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-2.5-flash">Advanced Model</SelectItem>
                <SelectItem value="gemini-2.5-flash-lite">Fast Model</SelectItem>
              </SelectContent>
            </Select>
          </Field>

        </CardContent>
        <CardFooter className=" justify-center">
          <Button className="w-full" type='submit' onClick={handleGenerate} disabled={btnDisabled} >Generate {btnDisabled && <Spinner />}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
