'use server'

import {
  searchKnowledgeBase,
  type SearchKnowledgeBaseArgs,
  type SearchKnowledgeBaseResult,
} from "@/lib/knowledgeBase/searchKnowledgeBase";

/**
 * Server action wrapper around the shared knowledge base search helper.
 */
export async function search_knowledge_base(
  args: SearchKnowledgeBaseArgs
): Promise<SearchKnowledgeBaseResult> {
  return searchKnowledgeBase(args);
}
