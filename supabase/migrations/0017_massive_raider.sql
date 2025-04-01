-- First, drop the view
DROP VIEW "private"."v_water_tanker_request";--> statement-breakpoint

-- RENAME TABLE water_tanker_request_list to water_tanker

-- Then, drop fk from request to request_list
ALTER TABLE "private"."water_tanker_request" DROP CONSTRAINT "water_tanker_request_water_tanker_request_list_id_water_tanker_request_list_id_fk";--> statement-breakpoint
-- Rename the table water_tanker_request_list to water_tanker
ALTER TABLE "private"."water_tanker_request_list" RENAME TO "water_tanker";--> statement-breakpoint
-- Rename the comlumn water_tanker_request_list_id to water_tanker_id prior to renaming the table
ALTER TABLE "private"."water_tanker_request" RENAME COLUMN "water_tanker_request_list_id" TO "water_tanker_id";--> statement-breakpoint
-- Add the foreign key constraint to the water_tanker table with the new column name
ALTER TABLE "private"."water_tanker_request" ADD CONSTRAINT "water_tanker_request_water_tanker_id_water_tanker_id_fk" FOREIGN KEY ("water_tanker_id") REFERENCES "private"."water_tanker"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- Rename the column group to list
ALTER TABLE "private"."water_tanker_request" RENAME COLUMN "group" TO "list";--> statement-breakpoint
-- Drop the type of the recently renamed column list
ALTER TABLE "private"."water_tanker_request" ALTER COLUMN "list" SET DATA TYPE text;--> statement-breakpoint
-- Update the values of list to match the new enum values
UPDATE "private"."water_tanker_request" SET "list" = '1' WHERE "list" = 'A';--> statement-breakpoint
UPDATE "private"."water_tanker_request" SET "list" = '2' WHERE "list" = 'B';--> statement-breakpoint
UPDATE "private"."water_tanker_request" SET "list" = '3' WHERE "list" = 'C';--> statement-breakpoint
UPDATE "private"."water_tanker_request" SET "list" = '4' WHERE "list" = 'D';--> statement-breakpoint
UPDATE "private"."water_tanker_request" SET "list" = '5' WHERE "list" = 'E';--> statement-breakpoint
UPDATE "private"."water_tanker_request" SET "list" = '6' WHERE "list" = 'F';--> statement-breakpoint
UPDATE "private"."water_tanker_request" SET "list" = '7' WHERE "list" = 'G';--> statement-breakpoint
-- Drop the old enum type
DROP TYPE "private"."water_tanker_request_list_group";--> statement-breakpoint
-- Create the new enum type
CREATE TYPE "private"."water_tanker_request_list" AS ENUM('1', '2', '3', '4', '5', '6', '7');--> statement-breakpoint
-- Add the new enum type to the column list
ALTER TABLE "private"."water_tanker_request" ALTER COLUMN "list" SET DATA TYPE "private"."water_tanker_request_list" USING "list"::"private"."water_tanker_request_list";--> statement-breakpoint
-- Finally, rename the column request_status to status
ALTER TABLE "private"."water_tanker_request" RENAME COLUMN "request_status" TO "status";--> statement-breakpoint

-- ADD PENDING COLUMNS TO "hidden"."water_tanker_request_hr"

ALTER TABLE "hidden"."water_tanker_request_hr" RENAME COLUMN "request_status" TO "status";--> statement-breakpoint
ALTER TABLE "hidden"."water_tanker_request_hr" ADD COLUMN "is_testing" boolean;--> statement-breakpoint
ALTER TABLE "hidden"."water_tanker_request_hr" ADD COLUMN "list" "private"."water_tanker_request_list";--> statement-breakpoint

-- REGENERATE REQUEST VIEW

CREATE VIEW "private"."v_water_tanker_request" AS (select coalesce(
        json_agg(
          json_build_object(
            'author', "private"."water_tanker_request_comments"."user_id",
            'comment', "private"."water_tanker_request_comments"."comment",
            'createdAt', "private"."water_tanker_request_comments"."created_at",
            'id', "private"."water_tanker_request_comments"."id"
          )
        ) filter (where water_tanker_request_comments is not null),
        '[]'::json
      ) as "comments", "private"."water_tanker_request"."created_at", "users"."house", "private"."water_tanker_request"."is_testing", "private"."water_tanker_request"."list", "private"."water_tanker_request"."status", "private"."house_information"."street", "private"."water_tanker_request"."updated_at", "private"."water_tanker_request"."uuid", "private"."water_tanker"."name" as "water_tanker_name" from "private"."water_tanker_request" inner join "private"."water_tanker" on "private"."water_tanker_request"."water_tanker_id" = "private"."water_tanker"."id" inner join "users" on "private"."water_tanker_request"."user_id" = "users"."id" inner join "private"."house_information" on "private"."water_tanker_request"."user_id" = "private"."house_information"."user_id" left join "private"."water_tanker_request_comments" on "private"."water_tanker_request"."id" = "private"."water_tanker_request_comments"."water_tanker_request_id" where ("private"."water_tanker_request"."is_active" = true and ("private"."water_tanker_request"."status" = 'pending' or "private"."water_tanker_request"."updated_at" between now() - interval '6 hours' and now())) group by "private"."water_tanker_request"."created_at", "users"."house", "private"."water_tanker_request"."is_testing", "private"."water_tanker_request"."list", "private"."water_tanker_request"."status", "private"."house_information"."street", "private"."water_tanker_request"."updated_at", "private"."water_tanker_request"."uuid", "private"."water_tanker"."name" order by "private"."water_tanker_request"."created_at" asc);
