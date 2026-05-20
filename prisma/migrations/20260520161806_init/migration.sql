-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Province" AS ENUM ('Federal', 'Punjab', 'Sindh', 'KPK', 'Balochistan', 'AJK', 'Gilgit-Baltistan');

-- CreateEnum
CREATE TYPE "Session" AS ENUM ('annual', 'supplementary', 'model');

-- CreateEnum
CREATE TYPE "PaperStatus" AS ENUM ('DRAFT', 'LIVE', 'PROCESSING');

-- CreateEnum
CREATE TYPE "QuestionSection" AS ENUM ('short_questions', 'long_questions', 'mcq', 'practical');

-- CreateEnum
CREATE TYPE "AnalyticEvent" AS ENUM ('view', 'download');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('web', 'mobile');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('create', 'update', 'delete');

-- CreateTable
CREATE TABLE "boards" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "province" "Province" NOT NULL,
    "description" TEXT,
    "website_url" TEXT,
    "color" TEXT NOT NULL DEFAULT '#CF6679',
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'book-open',
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_compulsory" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "board_class_subjects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "board_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "class_level" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "board_class_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "papers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "board_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "class_level" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "session" "Session" NOT NULL,
    "title" TEXT NOT NULL,
    "storage_path" TEXT,
    "pdf_url" TEXT,
    "file_size_bytes" BIGINT,
    "status" "PaperStatus" NOT NULL DEFAULT 'DRAFT',
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "papers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common_questions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subject_id" UUID NOT NULL,
    "board_id" UUID NOT NULL,
    "class_level" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "chapter_name" TEXT NOT NULL,
    "chapter_id" TEXT NOT NULL,
    "section" "QuestionSection",
    "marks" INTEGER,
    "frequency" INTEGER NOT NULL DEFAULT 2,
    "years_appeared" INTEGER[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "common_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_paper_links" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "question_id" UUID NOT NULL,
    "paper_id" UUID NOT NULL,
    "page_number" INTEGER,
    "year" INTEGER NOT NULL,

    CONSTRAINT "question_paper_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paper_analytics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "paper_id" UUID NOT NULL,
    "event_type" "AnalyticEvent" NOT NULL,
    "platform" "Platform" NOT NULL,
    "board_id" UUID,
    "subject_id" UUID,
    "class_level" INTEGER,
    "year" INTEGER,
    "event_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "paper_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "flag_name" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_audit_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "admin_user_id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" UUID,
    "old_value" JSONB,
    "new_value" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "boards_short_name_key" ON "boards"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_name_key" ON "subjects"("name");

-- CreateIndex
CREATE UNIQUE INDEX "board_class_subjects_board_id_subject_id_class_level_key" ON "board_class_subjects"("board_id", "subject_id", "class_level");

-- CreateIndex
CREATE INDEX "papers_board_id_idx" ON "papers"("board_id");

-- CreateIndex
CREATE INDEX "papers_subject_id_idx" ON "papers"("subject_id");

-- CreateIndex
CREATE INDEX "papers_class_level_year_idx" ON "papers"("class_level", "year" DESC);

-- CreateIndex
CREATE INDEX "papers_status_idx" ON "papers"("status");

-- CreateIndex
CREATE INDEX "papers_board_id_subject_id_class_level_idx" ON "papers"("board_id", "subject_id", "class_level");

-- CreateIndex
CREATE UNIQUE INDEX "papers_board_id_subject_id_class_level_year_session_key" ON "papers"("board_id", "subject_id", "class_level", "year", "session");

-- CreateIndex
CREATE INDEX "common_questions_subject_id_board_id_class_level_idx" ON "common_questions"("subject_id", "board_id", "class_level");

-- CreateIndex
CREATE INDEX "common_questions_frequency_idx" ON "common_questions"("frequency" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "question_paper_links_question_id_paper_id_key" ON "question_paper_links"("question_id", "paper_id");

-- CreateIndex
CREATE INDEX "paper_analytics_event_date_idx" ON "paper_analytics"("event_date" DESC);

-- CreateIndex
CREATE INDEX "paper_analytics_paper_id_event_date_idx" ON "paper_analytics"("paper_id", "event_date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "paper_analytics_paper_id_event_type_platform_event_date_key" ON "paper_analytics"("paper_id", "event_type", "platform", "event_date");

-- CreateIndex
CREATE UNIQUE INDEX "app_settings_key_key" ON "app_settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_flag_name_key" ON "feature_flags"("flag_name");

-- CreateIndex
CREATE INDEX "admin_audit_log_entity_type_entity_id_idx" ON "admin_audit_log"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "admin_audit_log_admin_user_id_idx" ON "admin_audit_log"("admin_user_id");

-- AddForeignKey
ALTER TABLE "board_class_subjects" ADD CONSTRAINT "board_class_subjects_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_class_subjects" ADD CONSTRAINT "board_class_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "papers" ADD CONSTRAINT "papers_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "papers" ADD CONSTRAINT "papers_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "common_questions" ADD CONSTRAINT "common_questions_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "common_questions" ADD CONSTRAINT "common_questions_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_paper_links" ADD CONSTRAINT "question_paper_links_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "common_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_paper_links" ADD CONSTRAINT "question_paper_links_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "papers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paper_analytics" ADD CONSTRAINT "paper_analytics_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "papers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paper_analytics" ADD CONSTRAINT "paper_analytics_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paper_analytics" ADD CONSTRAINT "paper_analytics_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
