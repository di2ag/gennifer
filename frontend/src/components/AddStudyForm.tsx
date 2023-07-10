"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import Button from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { getGenniferUrl } from "@/lib/utils"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { revalidate } from "@/actions/revalidate"
import { DialogClose } from "@radix-ui/react-dialog"
import { useRouter } from 'next/navigation';
import { postStudy } from "@/actions/post"
import { StudyProps } from "@/const"


const AddStudyFormSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
})

export function StudyForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const { data: session, status, update } = useSession();
  const { push } = useRouter()

  const form = useForm<z.infer<typeof AddStudyFormSchema>>({
    resolver: zodResolver(AddStudyFormSchema),
    defaultValues: {
        name: "",
        description: "",
    }
  })

  async function onSubmit(data: z.infer<typeof AddStudyFormSchema>) {
    setIsLoading(true);
    update();
    const response = await fetch(getGenniferUrl() + 'studies/', {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + session?.user.access_token,
        },
        body: JSON.stringify({
            name: data.name,
            description: data.description,
            tasks: [],
        }),
        method: "POST",
    }).then((resp) => resp.json());
    console.log(response);
    revalidate('studies');
    setIsLoading(false);
    setOpen(false);
    if (!response.hasOwnProperty('error')) {
       push('/studies/' + response.pk);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
        <Button isLoading={isLoading}
        variant="outline"
        size="sm"
        >
        Add Study
        </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
        <DialogTitle>Create Study</DialogTitle>
        </DialogHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Study Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Study Name..." {...field} />
              </FormControl>
              <FormDescription>
                This is the name of your study.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Study Description</FormLabel>
              <FormControl>
                <Input placeholder="A description of your study..." {...field} />
              </FormControl>
              <FormDescription>
                This is a description of your study.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          {/* <DialogClose asChild> */}
            <Button type="submit">Submit</Button>
          {/* </DialogClose> */}
        </DialogFooter>
        </form>
    </Form>
    </DialogContent>
    </Dialog>
  )
}
