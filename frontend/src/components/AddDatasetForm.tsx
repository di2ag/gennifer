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

const AddDatasetFormSchema = z.object({
  zenodoId: z.string().nonempty(),
})

export function DatasetForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const { data: session, status, update } = useSession();

  const form = useForm<z.infer<typeof AddDatasetFormSchema>>({
    resolver: zodResolver(AddDatasetFormSchema),
    defaultValues: {
        zenodoId: "",
    }
  })

  function onSubmit(data: z.infer<typeof AddDatasetFormSchema>) {
    setIsLoading(true);
    update();
    const response = fetch(getGenniferUrl() + 'datasets/', {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + session?.user.access_token,
        },
        body: JSON.stringify({
            zenodo_id: data.zenodoId,
        }),
        method: "POST",
    }).then((resp) => resp.json());
    revalidate('datasets');
    setIsLoading(false);
    setOpen(false);
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
        <Button isLoading={isLoading}
        variant="outline"
        size="sm"
        >
        Add Dataset
        </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
        <DialogTitle>Add Dataset</DialogTitle>
        </DialogHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="zenodoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zenodo ID</FormLabel>
              <FormControl>
                <Input placeholder="Your Zenodo ID..." {...field} />
              </FormControl>
              <FormDescription>
                This is the ID of the dataset you want to add.
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
