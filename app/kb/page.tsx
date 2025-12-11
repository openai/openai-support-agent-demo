"use client";
import ListArticles from "@/components/ListArticles";
import { AppPageShell } from "@/components/app-page-shell";

// Page showing all knowledge base articles in /knowledge_base folder
export default function KnowledgeBasePage() {
  return (
    <AppPageShell>
      <ListArticles
        page="kb"
        folder="knowledge_base"
        title="Internal Knowledge Base"
      />
    </AppPageShell>
  );
}
