DROP VIEW "private"."v_water_tanker_request";--> statement-breakpoint
CREATE VIEW "private"."v_best_list" AS (select case
        when count(case when "private"."water_tanker_request"."list" = '1' THEN 1 END) < 6 then '1'
        when count(case when "private"."water_tanker_request"."list" = '2' THEN 1 END) < 6 then '2'
        when count(case when "private"."water_tanker_request"."list" = '3' THEN 1 END) < 6 then '3'
        when count(case when "private"."water_tanker_request"."list" = '4' THEN 1 END) < 6 then '4'
        when count(case when "private"."water_tanker_request"."list" = '5' THEN 1 END) < 6 then '5'
        when count(case when "private"."water_tanker_request"."list" = '6' THEN 1 END) < 6 then '6'
        else '7'
      end as "best_list", "private"."water_tanker_request"."id", "private"."water_tanker"."name" from "private"."water_tanker_request" inner join "private"."water_tanker" on "private"."water_tanker_request"."water_tanker_id" = "private"."water_tanker"."id" where ("private"."water_tanker_request"."is_active" = true and "private"."water_tanker"."is_active" = true and ("private"."water_tanker_request"."status" = 'pending' or "private"."water_tanker_request"."updated_at" between now() - interval '6 hours' and now())) group by "private"."water_tanker_request"."id", "private"."water_tanker"."name");--> statement-breakpoint
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
      ) as "comments", "private"."water_tanker_request"."created_at", "users"."house", "private"."water_tanker_request"."is_testing", "private"."water_tanker_request"."list", "private"."water_tanker_request"."status", "private"."house_information"."street", "private"."water_tanker_request"."updated_at", "private"."water_tanker_request"."uuid", "private"."water_tanker"."name" as "water_tanker_name" from "private"."water_tanker_request" inner join "private"."water_tanker" on "private"."water_tanker_request"."water_tanker_id" = "private"."water_tanker"."id" inner join "users" on "private"."water_tanker_request"."user_id" = "users"."id" inner join "private"."house_information" on "private"."water_tanker_request"."user_id" = "private"."house_information"."user_id" left join "private"."water_tanker_request_comments" on "private"."water_tanker_request"."id" = "private"."water_tanker_request_comments"."water_tanker_request_id" where ("private"."water_tanker_request"."is_active" = true and "private"."water_tanker"."is_active" = true and ("private"."water_tanker_request"."status" = 'pending' or "private"."water_tanker_request"."updated_at" between now() - interval '6 hours' and now())) group by "private"."water_tanker_request"."created_at", "users"."house", "private"."water_tanker_request"."is_testing", "private"."water_tanker_request"."list", "private"."water_tanker_request"."status", "private"."house_information"."street", "private"."water_tanker_request"."updated_at", "private"."water_tanker_request"."uuid", "private"."water_tanker"."name" order by "private"."water_tanker_request"."created_at" asc);