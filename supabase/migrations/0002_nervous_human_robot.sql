CREATE SCHEMA "hidden";
--> statement-breakpoint
CREATE TYPE "private"."water_tanker_request_status" AS ENUM('pending', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "private"."water_tanker_request_list" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"description" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "water_tanker_request_list_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "private"."water_tanker_request" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"request_status" "private"."water_tanker_request_status" DEFAULT 'pending' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"water_tanker_request_list_id" integer NOT NULL,
	CONSTRAINT "water_tanker_request_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "hidden"."water_tanker_request_hr" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"request_status" "private"."water_tanker_request_status" DEFAULT 'pending' NOT NULL,
	"user_id" integer NOT NULL,
	"water_tanker_request_list_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "private"."contact_information" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "private"."contact_information" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "private"."water_tanker_request" ADD CONSTRAINT "water_tanker_request_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "private"."water_tanker_request" ADD CONSTRAINT "water_tanker_request_water_tanker_request_list_id_water_tanker_request_list_id_fk" FOREIGN KEY ("water_tanker_request_list_id") REFERENCES "private"."water_tanker_request_list"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE VIEW "private"."v_water_tanker_request" AS (select "users"."house", "private"."water_tanker_request_list"."name" as "list", "private"."water_tanker_request"."request_status", "private"."water_tanker_request"."uuid" from "private"."water_tanker_request" inner join "private"."water_tanker_request_list" on "private"."water_tanker_request"."water_tanker_request_list_id" = "private"."water_tanker_request_list"."id" inner join "users" on "private"."water_tanker_request"."user_id" = "users"."id" where ("private"."water_tanker_request"."request_status" = 'pending' or "private"."water_tanker_request"."updated_at" between now() - interval '2 hours' and now()) order by "private"."water_tanker_request"."created_at" desc);