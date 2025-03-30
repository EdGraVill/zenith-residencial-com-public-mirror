DROP VIEW "private"."v_water_tanker_request";--> statement-breakpoint
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
      ) as "comments", "private"."water_tanker_request"."created_at", "users"."house", "private"."water_tanker_request_list"."name" as "list", "private"."water_tanker_request"."request_status", "private"."house_information"."street", "private"."water_tanker_request"."updated_at", "private"."water_tanker_request"."uuid" from "private"."water_tanker_request" inner join "private"."water_tanker_request_list" on "private"."water_tanker_request"."water_tanker_request_list_id" = "private"."water_tanker_request_list"."id" inner join "users" on "private"."water_tanker_request"."user_id" = "users"."id" inner join "private"."house_information" on "private"."water_tanker_request"."user_id" = "private"."house_information"."user_id" left join "private"."water_tanker_request_comments" on "private"."water_tanker_request"."id" = "private"."water_tanker_request_comments"."water_tanker_request_id" where ("private"."water_tanker_request"."is_active" = true and ("private"."water_tanker_request"."request_status" = 'pending' or "private"."water_tanker_request"."updated_at" between now() - interval '15 minutes' and now())) group by "private"."water_tanker_request"."created_at", "users"."house", "private"."water_tanker_request_list"."name", "private"."water_tanker_request"."request_status", "private"."house_information"."street", "private"."water_tanker_request"."updated_at", "private"."water_tanker_request"."uuid" order by "private"."water_tanker_request"."created_at" asc);