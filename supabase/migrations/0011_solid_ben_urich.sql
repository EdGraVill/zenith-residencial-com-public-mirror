ALTER TABLE "private"."water_tanker_request" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP VIEW "private"."v_water_tanker_request";--> statement-breakpoint
ALTER TABLE "private"."water_tanker_request" SET SCHEMA "public";
--> statement-breakpoint
ALTER TABLE "private"."water_tanker_request_comments" DROP CONSTRAINT "water_tanker_request_comments_water_tanker_request_id_water_tanker_request_id_fk";
--> statement-breakpoint
ALTER TABLE "hidden"."water_tanker_request_hr" DROP CONSTRAINT "water_tanker_request_hr_water_tanker_request_id_water_tanker_request_id_fk";
--> statement-breakpoint
ALTER TABLE "private"."water_tanker_request_comments" ADD CONSTRAINT "water_tanker_request_comments_water_tanker_request_id_water_tanker_request_id_fk" FOREIGN KEY ("water_tanker_request_id") REFERENCES "public"."water_tanker_request"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hidden"."water_tanker_request_hr" ADD CONSTRAINT "water_tanker_request_hr_water_tanker_request_id_water_tanker_request_id_fk" FOREIGN KEY ("water_tanker_request_id") REFERENCES "public"."water_tanker_request"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
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
      ) as "comments", "water_tanker_request"."created_at", "users"."house", "private"."water_tanker_request_list"."name" as "list", "water_tanker_request"."request_status", "private"."house_information"."street", "water_tanker_request"."updated_at", "water_tanker_request"."uuid" from "water_tanker_request" inner join "private"."water_tanker_request_list" on "water_tanker_request"."water_tanker_request_list_id" = "private"."water_tanker_request_list"."id" inner join "users" on "water_tanker_request"."user_id" = "users"."id" inner join "private"."house_information" on "water_tanker_request"."user_id" = "private"."house_information"."user_id" left join "private"."water_tanker_request_comments" on "water_tanker_request"."id" = "private"."water_tanker_request_comments"."water_tanker_request_id" where ("water_tanker_request"."is_active" = true and ("water_tanker_request"."request_status" = 'pending' or "water_tanker_request"."updated_at" between now() - interval '15 minutes' and now())) group by "water_tanker_request"."created_at", "users"."house", "private"."water_tanker_request_list"."name", "water_tanker_request"."request_status", "private"."house_information"."street", "water_tanker_request"."updated_at", "water_tanker_request"."uuid" order by "water_tanker_request"."created_at" asc);