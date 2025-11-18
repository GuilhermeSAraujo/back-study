CREATE TYPE "public"."difficulty" AS ENUM('iniciante', 'medio', 'dificil');--> statement-breakpoint
CREATE TABLE "auth_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"google_id" varchar NOT NULL,
	"image" varchar,
	"created_at" timestamp (2) with time zone DEFAULT now(),
	"updated_at" timestamp (2) with time zone,
	"deleted_at" timestamp (2) with time zone,
	CONSTRAINT "auth_users_email_idx" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "quiz_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"answers" jsonb NOT NULL,
	"total_questions" integer NOT NULL,
	"correct_answers" integer NOT NULL,
	"score" integer NOT NULL,
	"started_at" timestamp (2) with time zone,
	"completed_at" timestamp (2) with time zone,
	"created_at" timestamp (2) with time zone DEFAULT now(),
	"updated_at" timestamp (2) with time zone,
	"deleted_at" timestamp (2) with time zone
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" varchar NOT NULL,
	"course_name" varchar NOT NULL,
	"topic_id" varchar NOT NULL,
	"topic_name" varchar NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"questions" jsonb NOT NULL,
	"additional_info" varchar,
	"created_at" timestamp (2) with time zone DEFAULT now(),
	"updated_at" timestamp (2) with time zone,
	"deleted_at" timestamp (2) with time zone
);
--> statement-breakpoint
CREATE TABLE "user_quota" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"purchased" integer DEFAULT 0 NOT NULL,
	"consumed" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp (2) with time zone DEFAULT now(),
	"updated_at" timestamp (2) with time zone,
	"deleted_at" timestamp (2) with time zone
);
--> statement-breakpoint
ALTER TABLE "quiz_results" ADD CONSTRAINT "quiz_results_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_results" ADD CONSTRAINT "quiz_results_user_id_auth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_user_id_auth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quota" ADD CONSTRAINT "user_quota_user_id_auth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_users"("id") ON DELETE no action ON UPDATE no action;