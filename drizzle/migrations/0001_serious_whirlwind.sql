CREATE TABLE IF NOT EXISTS "passwords" (
	"id" varchar(14) PRIMARY KEY NOT NULL,
	"hash" text NOT NULL,
	"user_id" varchar(14) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verifications" (
	"id" varchar(14) PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"secret" text NOT NULL,
	"target" text NOT NULL,
	"period" integer NOT NULL,
	"algorithm" text NOT NULL,
	"digits" integer NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "verifications_target_type_unique" UNIQUE("target","type")
);
--> statement-breakpoint
ALTER TABLE "user_profiles" RENAME COLUMN "full_name" TO "first_name";--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "last_name" text;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD COLUMN "user_agent" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD COLUMN "ip_address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "username" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passwords" ADD CONSTRAINT "passwords_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");