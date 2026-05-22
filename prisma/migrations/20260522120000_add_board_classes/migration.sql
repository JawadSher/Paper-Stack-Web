-- Add supported class levels to boards.
ALTER TABLE "boards"
ADD COLUMN "classes" INTEGER[] NOT NULL DEFAULT ARRAY[9, 10, 11, 12];
