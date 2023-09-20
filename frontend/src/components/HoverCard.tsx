"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    } from "@/components/ui/sheet"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    } from "@/components/ui/accordion"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    } from "@/components/ui/table"

import { FilterTable } from '@/components/ui/FilterTable';
import { evidenceFilterColumns } from "@/app/explore/columns";

import Button from "@/components/ui/Button";
import { AnyMxRecord } from "dns";
import Paragraph from "./ui/Paragraph";
import LargeHeading from "./ui/LargeHeading";
import { AnnotationProps } from "@/const";
import React from "react";

interface GeneHoverCardProps {
    name: string;
    curie: string;
    chp_preffered_curie: string;
}

interface EdgeHoverCardProps {
    weight: string;
    algorithm: string;
    dataset: string;
    tr_annotations: AnnotationProps[];
}

export function GeneHoverCard({ name, curie, chp_preffered_curie }: GeneHoverCardProps) {
  return (
  <Card className="flex flex-col w-min-full bg-slate-100">
  <CardHeader>
    <CardTitle>{name}</CardTitle>
    <CardDescription>
    <div>
    <Table>
    <TableCaption>Gene Properties.</TableCaption>
    <TableHeader>
        <TableRow>
        <TableHead className="text-sm">Properties</TableHead>
        <TableHead className="text-right text-sm">Values</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        <TableRow>
        <TableCell className="font-medium text-sm">Curie</TableCell>
        <TableCell className="text-right text-sm">{curie}</TableCell>
        </TableRow>
        <TableRow>
        <TableCell className="font-medium text-sm">CHP Preferred Curie</TableCell>
        <TableCell className="text-right text-sm">{chp_preffered_curie}</TableCell>
        </TableRow>
    </TableBody>
    </Table>
    </div>
    </CardDescription>
  </CardHeader>
  </Card>
  )
}

export function EdgeHoverCard({ weight, algorithm, dataset, tr_annotations }: EdgeHoverCardProps) {
    const [rowSelection, setRowSelection] = React.useState({})

    return (
    <Card className="w-[350px] bg-slate-100">
    <CardContent>
        <div className="flex flex-col pt-4">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Properties</TableHead>
            <TableHead className="text-right">Values</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
            <TableCell className="font-medium">Weight</TableCell>
            <TableCell className="text-right">{Math.round(parseFloat(weight) * 1000) / 1000}</TableCell>
            </TableRow>
            <TableRow>
            <TableCell className="font-medium">Algorithm</TableCell>
            <TableCell className="text-right">{algorithm}</TableCell>
            </TableRow>
            <TableRow>
            <TableCell className="font-medium">Dataset</TableCell>
            <TableCell className="text-right">{dataset}</TableCell>
            </TableRow>
            <TableRow>
            <TableCell className="font-medium">Evidence Count</TableCell>
            <TableCell className="text-right">{tr_annotations.length}</TableCell>
            </TableRow>
        </TableBody>
        </Table>
        </div>
    </CardContent>
    <CardFooter>
        <Sheet>
        <SheetTrigger asChild>
            <Button className="w-full justify-center"
            variant={"ghost"}>
                View Evidence
            </Button>
        </SheetTrigger>
        <SheetContent position="right" className="w-min-[50%]">
            <SheetHeader>
                <SheetTitle>Translator Evidence</SheetTitle>
                <SheetDescription>
                    Annotated evidence for this edge.
                </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col text-justify py-4">
                { tr_annotations.length === 0 &&
                    <Paragraph size="sm">No evidence found.</Paragraph>
                }
                <Accordion type="single" collapsible className="w-full pb-4">
                { tr_annotations.map((a: AnnotationProps, i: number) => (
                    <AccordionItem value={`${a.name}-${i}`}>
                      <AccordionTrigger>{a.name}</AccordionTrigger>
                      <AccordionContent>
                      <div className="grid gap-4 py-4">
                        <FilterTable
                        columns={evidenceFilterColumns} 
                        data={a.evidence} 
                        searchPlaceholderText={'Search by Resource...'}
                        searchValue={'resource_id'}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                        pageCount={5}
                        />
                      </div>
                      </AccordionContent>
                    </AccordionItem>
                )
                )}
                </Accordion>
            <SheetFooter>
                <SheetClose asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        type="submit"
                        >
                        Close
                    </Button>
                </SheetClose>
            </SheetFooter>
            </div>
        </SheetContent>
        </Sheet>
    </CardFooter>
    </Card>
    )
  }
