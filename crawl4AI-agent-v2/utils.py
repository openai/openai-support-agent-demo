"""Utility functions for text processing and ChromaDB operations."""

import os
import pathlib
from typing import List, Dict, Any, Optional

import chromadb
from chromadb.utils import embedding_functions
from more_itertools import batched


def get_chroma_client(persist_directory: str) -> chromadb.PersistentClient:
    """Get a ChromaDB client with the specified persistence directory.
    
    Args:
        persist_directory: Directory where ChromaDB will store its data
        
    Returns:
        A ChromaDB PersistentClient
    """
    # Create the directory if it doesn't exist
    os.makedirs(persist_directory, exist_ok=True)
    
    # Return the client
    return chromadb.PersistentClient(persist_directory)


def get_or_create_collection(
    client: chromadb.PersistentClient,
    collection_name: str,
    embedding_model_name: str = "all-MiniLM-L6-v2",
    distance_function: str = "cosine",
) -> chromadb.Collection:
    """Get an existing collection or create a new one if it doesn't exist.
    
    Args:
        client: ChromaDB client
        collection_name: Name of the collection
        embedding_model_name: Name of the embedding model to use
        distance_function: Distance function to use for similarity search
        
    Returns:
        A ChromaDB Collection
    """
    # Create embedding function
    embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=embedding_model_name
    )
    
    # Try to get the collection, create it if it doesn't exist
    try:
        return client.get_collection(
            name=collection_name,
            embedding_function=embedding_func
        )
    except Exception:
        return client.create_collection(
            name=collection_name,
            embedding_function=embedding_func,
            metadata={"hnsw:space": distance_function}
        )


def add_documents_to_collection(
    collection: chromadb.Collection,
    ids: List[str],
    documents: List[str],
    metadatas: Optional[List[Dict[str, Any]]] = None,
    batch_size: int = 100,
) -> None:
    """Add documents to a ChromaDB collection in batches.
    
    Args:
        collection: ChromaDB collection
        ids: List of document IDs
        documents: List of document texts
        metadatas: Optional list of metadata dictionaries for each document
        batch_size: Size of batches for adding documents
    """
    # Create default metadata if none provided
    if metadatas is None:
        metadatas = [{}] * len(documents)
    
    # Create document indices
    document_indices = list(range(len(documents)))
    
    # Add documents in batches
    for batch in batched(document_indices, batch_size):
        # Get the start and end indices for the current batch
        start_idx = batch[0]
        end_idx = batch[-1] + 1  # +1 because end_idx is exclusive
        
        # Add the batch to the collection
        collection.add(
            ids=ids[start_idx:end_idx],
            documents=documents[start_idx:end_idx],
            metadatas=metadatas[start_idx:end_idx],
        )


def query_collection(
    collection: chromadb.Collection,
    query_text: str,
    n_results: int = 5,
    where: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Query a ChromaDB collection for similar documents.
    
    Args:
        collection: ChromaDB collection
        query_text: Text to search for
        n_results: Number of results to return
        where: Optional filter to apply to the query
        
    Returns:
        Query results containing documents, metadatas, distances, and ids
    """
    # Query the collection
    return collection.query(
        query_texts=[query_text],
        n_results=n_results,
        where=where,
        include=["documents", "metadatas", "distances"]
    )


def format_results_as_context(query_results: Dict[str, Any]) -> str:
    """Format query results as a context string for the agent.
    
    Args:
        query_results: Results from a ChromaDB query
        
    Returns:
        Formatted context string
    """
    context = "CONTEXT INFORMATION:\n\n"
    
    for i, (doc, metadata, distance) in enumerate(zip(
        query_results["documents"][0],
        query_results["metadatas"][0],
        query_results["distances"][0]
    )):
        # Add document information
        context += f"Document {i+1} (Relevance: {1 - distance:.2f}):\n"
        
        # Add metadata if available
        if metadata:
            for key, value in metadata.items():
                context += f"{key}: {value}\n"
        
        # Add document content
        context += f"Content: {doc}\n\n"
    
    return context
