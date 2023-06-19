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

const AddDatasetFormSchema = z.object({
  zenodoId: z.string().nonempty(),
})

export function DatasetForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof AddDatasetFormSchema>>({
    resolver: zodResolver(AddDatasetFormSchema),
    defaultValues: {
        zenodoId: "",
    }
  })

  function onSubmit(data: z.infer<typeof AddDatasetFormSchema>) {
    setIsLoading(true);
    const response = fetch(getGenniferUrl() + 'datasets/', {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            zenodo_id: data.zenodoId,
        }),
        method: "POST",
    }).then((resp) => resp.json());
    console.log(response);
    toast({
      title: "You received this response:",
      code: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(response, null, 2)}</code>
        </pre>
      ),
    })
    setIsLoading(false);
    }

  return (
    <Dialog>
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
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
            <Button type="submit">Submit</Button>
        </DialogFooter>
        </form>
    </Form>
    </DialogContent>
    </Dialog>
  )
}
