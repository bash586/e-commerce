CREATE TABLE "admin_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"invited_by" uuid NOT NULL,
	"email" varchar NOT NULL,
	"token_hash" varchar NOT NULL UNIQUE,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "admin_invites" ADD CONSTRAINT "admin_invites_invited_by_users_id_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("id") ON DELETE CASCADE;