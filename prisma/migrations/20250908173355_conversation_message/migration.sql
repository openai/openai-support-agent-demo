CREATE TABLE "ConversationMessage" (
    "id" INTEGER NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "inboxId" INTEGER NOT NULL,
    "sender" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConversationMessage_pkey" PRIMARY KEY ("id")
);
