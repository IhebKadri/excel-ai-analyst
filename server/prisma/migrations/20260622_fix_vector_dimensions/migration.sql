DROP INDEX IF EXISTS chunks_embedding_idx;
ALTER TABLE chunks ALTER COLUMN embedding TYPE vector(768);
CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);