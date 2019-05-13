CREATE OR REPLACE VIEW geki_view.participants
AS SELECT participants.id,
    participants.username,
    participants.avatar_url,
    participants.elo,
    count(ranked_results.winner_id) AS wins,
    count(ranked_results.loser_id) AS losses
   FROM geki_data.participants
     LEFT JOIN geki_data.ranked_results ON participants.id = ranked_results.winner_id
  GROUP BY participants.id;