"use client";
import ListArticles from "@/components/ListArticles";
import { AppPageShell } from "@/components/app-page-shell";

// Page showing all FAQ articles in /faq folder
export default function KnowledgeBasePage() {
  return (
    <AppPageShell>
      <ListArticles page="faq" folder="faq" title="Public FAQ" />
    </AppPageShell>
  );
}
