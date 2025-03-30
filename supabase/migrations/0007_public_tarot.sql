CREATE TYPE "private"."street" AS ENUM('Zenith Oriente', 'Zenith Norte', 'Meridiano', 'Zenith Poniente', 'Horizonte', 'Nadir Poniente', 'Nadir Sur', 'Nadir Oriente', 'Tropico', 'Ecuador');--> statement-breakpoint
CREATE TABLE "private"."house_information" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"street" "private"."street" NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "house_information_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "private"."water_tanker_request_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"comment" text NOT NULL,
	"user_id" integer NOT NULL,
	"water_tanker_request_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "private"."house_information" ADD CONSTRAINT "house_information_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "private"."water_tanker_request_comments" ADD CONSTRAINT "water_tanker_request_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "private"."water_tanker_request_comments" ADD CONSTRAINT "water_tanker_request_comments_water_tanker_request_id_water_tanker_request_id_fk" FOREIGN KEY ("water_tanker_request_id") REFERENCES "private"."water_tanker_request"("id") ON DELETE no action ON UPDATE no action;