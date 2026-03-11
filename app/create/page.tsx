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
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { generateAi, enhancePrompt} from "./submitHandling";
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner";
import { StarsIcon } from "lucide-react";
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item";
// import { retrieveDocs
//  } from "./submitHandling";
export default function Create() {
  const [textField, setTextField] = useState("");
  const [mode, setMode] = useState('gemini-2.5-flash')
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [promptBtnDisabled, setPromptBtnDisabled] = useState(false)
  const[textFieldDisabled, setTextFieldDisabled] = useState(false)
  const [useUrlMode, setUseUrlMode ] = useState('none')
  const [url, setUrl] = useState('')


  // const router = useRouter();

  const handleGenerate = async () => {
    try {
      const urlstate = useUrlMode === 'pic-url' ? true:false
      const checkurl = urlstate && !url ? true: false
      if(!textField || checkurl){
        // const errorReason = {
        //   textField
        // }
        toast.error('km blm input prompt mu ATAU km blm input url foto !', {
          position: 'top-center'
        })
        return;
      }

      // if(urlstate){
      //   if(!url){
      //     toast.error('km belum input foto !', {
      //       position: 'top-center'
      //     })
      //     return;
      //   }
      // }
      setBtnDisabled(true)
      const imagePrompt = urlstate ? `Also give this image to be shown  ${url} ` : ''
      const input = {
        prompt: `${textField} ${imagePrompt}`,
        mode: mode,
      }
      const res = await generateAi(input.prompt, input.mode)
      if (res.status){
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
    } else {
      toast.error("Failed to Generate Code:  Backend Error")
      console.log(res.errorstack)
    }
    } catch (e) {
      toast.error("Failed to Generate Code: Client Error" + e)
    } finally {
      setBtnDisabled(false)
    }
  }

  const handlePrompt = async () => {
    try {

      setPromptBtnDisabled(true)
      setTextFieldDisabled(true)
      const prompt = await enhancePrompt(textField)
      // check internal
      if (prompt.status) {
        setTextField(prompt.output as string)
        toast.success("Prompt Enhanced Successfully")

      } else {
        toast.error(`Internal backend error !`)
        console.log(prompt.output)
      }
      
    } catch (e){
      toast.error("Failed to Enhance Prompt: " + e)
  
    } finally {
      setPromptBtnDisabled(false)
      setTextFieldDisabled(false)
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
            <Textarea placeholder="Buatkan saya game tentang simulasi menjadi presiden" className="" value={textField} onChange={(e) => setTextField(e.target.value)} disabled={textFieldDisabled} />
          </Field>
          <Button variant='ghost' onClick={handlePrompt} disabled={promptBtnDisabled} className='mt-2 dark:text-white text-black '> <StarsIcon/>Bantu ngeprompt dong ! {promptBtnDisabled && <Spinner />}</Button>
          <Field className='mt-4'>
            <FieldLabel>Kasih Foto (Optional)</FieldLabel>
            <FieldDescription>Upload foto biar tambil di web juga !</FieldDescription>
            <Select value={useUrlMode} onValueChange={(e) => setUseUrlMode(e)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Gk pake gambar</SelectItem>
                <SelectSeparator></SelectSeparator>
                <SelectItem value="pic-url">Pake Link Url</SelectItem>
                <SelectItem value="pic-upload" disabled={true} >Upload Gambar (Coming Soon)</SelectItem>
              </SelectContent>
              {useUrlMode === 'pic-url' && (
                  <Input placeholder="Contoh: https://prabogo.com/sawit.jpg" value={url} onChange={(e) => setUrl(e.target.value)} />
              )}
            </Select>
          </Field>
          
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
          <Button className="w-full text-white" variant='secondary'  type='submit' onClick={handleGenerate} disabled={btnDisabled} >Generate ! {btnDisabled && <Spinner />}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
