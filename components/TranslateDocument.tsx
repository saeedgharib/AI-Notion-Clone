"use client";
import React, { FormEvent, useState, useTransition } from "react";
import * as Y from "yjs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "./ui/button";
import { BotIcon, LanguagesIcon } from "lucide-react";
import { toast } from "sonner";
import Markdown from "react-markdown";
type Language =
  | "english"
  | "spanish"
  | "portuguese"
  | "french"
  | "german"
  | "chinese"
  | "arabic"
  | "hindi"
  | "russian"
  | "japanese"
  | "urdu"
  | "pashto";

const languages: Language[] = [
  "english",
  "spanish",
  "portuguese",
  "french",
  "german",
  "chinese",
  "arabic",
  "hindi",
  "russian",
  "japanese",
  "urdu",
  "pashto"
];

function TranslateDocument({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("");
  const [summary, setSummary] = useState();

  const [isPending, startTransition] = useTransition();

  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              documentData,
              targetLang: language,
            }),
          }
        );
        if (res.ok) {
          // const id=toast.loading("Translating")
          const { translated_text } = await res.json();
          setSummary(translated_text);
          toast.success("Translated Summary");
        }
      } catch (error) {
        console.log("error translating" + error);
      }
    });
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button asChild variant="outline">
          <DialogTrigger>
            {" "}
            <LanguagesIcon /> Translate
          </DialogTrigger>
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Translate the Document</DialogTitle>
            <DialogDescription>
              Select a Language and AI will translate a summary of the document
              in selected language
            </DialogDescription>
            <hr className="mt-5" />
            {/* {question && <p className="mt-5 text-gray-500">{question}</p>} */}
          </DialogHeader>
          {summary && (
            <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
              <div className="flex">
                <BotIcon className="w-10 flex-shrink-0" />
                <p className="font-bold">
                  GPT {isPending ? "is thinking ... " : "Says:"}
                </p>
              </div>
              <p>
                {/* {isPending ? "Thinking ... " : <Markdown>{summary}</Markdown>} */}
                {isPending ? (
                  <p>Thinking ... </p>
                ) : (
                  <Markdown>{summary}</Markdown>
                )}
              </p>
            </div>
          )}

          <form onSubmit={handleAskQuestion} className="flex gap-2">
            <Select
              value={language}
              onValueChange={(value) => setLanguage(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language.charAt(0).toUpperCase() + language.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button type="submit" disabled={!language || isPending}>
              {isPending ? "Translating..." : "Translate"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TranslateDocument;
