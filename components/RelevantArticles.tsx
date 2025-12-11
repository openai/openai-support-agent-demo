import useDataStore from "@/stores/useDataStore";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

function Article({
  title,
  content,
  type,
  link,
}: {
  title: string;
  content: string;
  type: "knowledge_base" | "faq";
  link: string;
}) {
  return (
    <div className="space-y-1 text-sm">
      <div className="flex items-baseline gap-2">
        <div className=" text-black font-bold">{title}</div>
        <Link href={link} target="_blank">
          <div className="flex items-center  text-[#2B83F6] gap-1">
            <div className="text-xs font-medium">
              {type === "knowledge_base" ? "INTERNAL" : "PUBLIC FAQ"}
            </div>
            <SquareArrowOutUpRight size={16} />
          </div>
        </Link>
      </div>
      <div className=" text-zinc-500 line-clamp-4">{content}</div>
    </div>
  );
}

function ArticleSkeleton() {
  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="h-4 w-24 bg-zinc-200 rounded-md animate-pulse" />
      <div className="flex flex-col gap-1">
        <div className="h-4 w-full bg-zinc-200 rounded-md animate-pulse" />
        <div className="h-4 w-32 bg-zinc-200 rounded-md animate-pulse" />
      </div>
    </div>
  );
}

export default function RelevantArticles() {
  const FAQExtracts = useDataStore((s) => s.FAQExtracts);
  const relevantArticlesError = useDataStore((s) => s.relevantArticlesError);
  const relevantArticlesLoading = useDataStore(
    (s) => s.relevantArticlesLoading
  );

  return (
    <div className="flex flex-col gap-4 py-2">
      {relevantArticlesLoading ? (
        <>
          <ArticleSkeleton />
          <ArticleSkeleton />
        </>
      ) : relevantArticlesError ? (
        <div className="text-sm text-zinc-500">{relevantArticlesError}</div>
      ) : (
        FAQExtracts?.map((article, index) => (
          <Article
            key={index}
            title={article.title}
            content={article.content}
            type={article.type}
            link={article.link}
          />
        ))
      )}
    </div>
  );
}
