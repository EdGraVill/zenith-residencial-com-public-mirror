CREATE SCHEMA "private";
--> statement-breakpoint
CREATE TABLE "private"."contact_information" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" text NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "contact_information_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "private"."contact_information" ADD CONSTRAINT "contact_information_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;