CREATE TABLE "private"."admins" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hidden"."access_hr" (
	"client_user_agent" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"ip" text,
	"phone" text,
	"user_id" integer
);
--> statement-breakpoint
DROP VIEW "private"."v_water_tanker_request";--> statement-breakpoint
ALTER TABLE "hidden"."water_tanker_request_hr" RENAME COLUMN "water_tanker_request_list_id" TO "water_tanker_request_id";--> statement-breakpoint
ALTER TABLE "private"."water_tanker_request" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "private"."admins" ADD CONSTRAINT "admins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hidden"."water_tanker_request_hr" ADD CONSTRAINT "water_tanker_request_hr_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hidden"."water_tanker_request_hr" ADD CONSTRAINT "water_tanker_request_hr_water_tanker_request_id_water_tanker_request_id_fk" FOREIGN KEY ("water_tanker_request_id") REFERENCES "private"."water_tanker_request"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE VIEW "private"."v_water_tanker_request" AS (select "users"."house", "private"."water_tanker_request_list"."name" as "list", "private"."water_tanker_request"."request_status", "private"."water_tanker_request"."uuid" from "private"."water_tanker_request" inner join "private"."water_tanker_request_list" on "private"."water_tanker_request"."water_tanker_request_list_id" = "private"."water_tanker_request_list"."id" inner join "users" on "private"."water_tanker_request"."user_id" = "users"."id" where ("private"."water_tanker_request"."is_active" = true and ("private"."water_tanker_request"."request_status" = 'pending' or "private"."water_tanker_request"."updated_at" between now() - interval '2 hours' and now())) order by "private"."water_tanker_request"."created_at" desc);