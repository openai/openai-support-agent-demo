"use client";
import { Link } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import ImageModal from "./ImageModal";
import ChatImage from "./ChatImage";
import { ImageProps } from "next/image";
import type { Components } from "react-markdown";

const markdownComponents: Components = {
  img: (props) => (
    <ImageModal src={(props.src as string) ?? ''}>
      <ChatImage
        {...(props as unknown as ImageProps)}
        alt={props.alt || 'image'}
        className="object-cover rounded-md cursor-pointer"
      />
    </ImageModal>
  ),
  a: ({ node, ...props }) => {
    void node;
    return (
      <a {...props} target="_blank" rel="noopener noreferrer">
        {props.children}
      </a>
    );
  },
};

export default function ListArticles({
  title,
  page,
  folder,
}: {
  title: string;
  page: string;
  folder: string;
}) {
  const [contents, setContents] = useState<
    { id: string; title: string; content: string }[]
  >([]);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(
    null
  );

  const getLink = (section: string) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/${page}?section=${section}`
    );
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`/api/list_files?folder=${folder}`);
        const files = await response.json();

        const fetchContentPromises = files.map(async (file: string) => {
          const fileName = file.split(".")[0];
          const fileResponse = await fetch(`/${folder}/${file}`);
          const text = await fileResponse.text();
          const [firstLine, ...rest] = text.split("\n");
          const title = firstLine.replaceAll("#", ""); // Remove markdown header syntax
          return { id: fileName, title, content: rest.join("\n") };
        });

        const allContents = await Promise.all(fetchContentPromises);
        setContents(allContents);
      } catch (error) {
        console.error("Error fetching files or contents:", error);
      }
    };

    fetchFiles();
  }, [folder]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get("section");

    if (section) {
      setHighlightedSection(section);
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [contents]);

  return (
    <div className="p-4 bg-white w-full">
      <h1 className="text-2xl font-bold mb-4 p-4">{title}</h1>
      {contents.map(({ id, title, content }, index) => (
        <div
          key={index}
          id={id}
          className={`my-8 p-4 md:w-1/2 ${
            highlightedSection === id ? "bg-orange-50 rounded-lg" : ""
          }`}
        >
          <h2 className="text-lg font-semibold mb-2 text-zinc-800 flex items-center gap-2">
            {title}
            <Link
              size={16}
              className="text-[#2B83F6] cursor-pointer hover:size-[18px] transition-all duration-100"
              onClick={() => {
                getLink(id);
              }}
            />
          </h2>
          <ReactMarkdown
            components={markdownComponents}
            className="text-zinc-600 prose prose-zinc text-justify"
          >
            {content}
          </ReactMarkdown>
        </div>
      ))}
    </div>
  );
}
