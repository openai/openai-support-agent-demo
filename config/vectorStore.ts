export interface TextSplitterConfig {
  chunkSize: number;
  chunkOverlap: number;
}

export const TEXT_SPLITTER_CONFIG: TextSplitterConfig = {
  chunkSize: Number(process.env.TEXT_SPLITTER_CHUNK_SIZE) || 500,
  chunkOverlap: Number(process.env.TEXT_SPLITTER_CHUNK_OVERLAP) || 50,
};
