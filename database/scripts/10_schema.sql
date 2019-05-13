CREATE SCHEMA geki_view;
CREATE SCHEMA geki_data;

CREATE TABLE geki_data.participants (
	id serial NOT NULL,
	username varchar(32) NOT NULL,
	avatar_url varchar(200) NOT NULL,
	is_team bool NOT NULL,
	elo real NOT NULL,
	CONSTRAINT participants_pk PRIMARY KEY (id)
);

CREATE TABLE geki_data.teams (
	id serial NOT NULL,
	team_id int NOT NULL,
	participant_id int NOT NULL,
	CONSTRAINT teams_pk PRIMARY KEY (id),
	CONSTRAINT teams_participant_fk FOREIGN KEY (team_id) REFERENCES geki_data.participants(id),
	CONSTRAINT teams_participant_fk_1 FOREIGN KEY (participant_id) REFERENCES geki_data.participants(id)
);

CREATE TABLE geki_data.events (
	id serial NOT NULL,
	title varchar(200) NOT NULL,
	date_start date NOT NULL,
	date_end date NOT NULL,
	CONSTRAINT events_pk PRIMARY KEY (id)
);

CREATE TABLE geki_data.match_statuses (
	id serial NOT NULL,
	title varchar(50) NOT NULL,
	CONSTRAINT match_statuses_pk PRIMARY KEY (id)
);

CREATE TABLE geki_data.match_types (
	id serial NOT NULL,
	title varchar(50) NOT NULL,
	CONSTRAINT match_types_pk PRIMARY KEY (id)
);

CREATE TABLE geki_data.matches (
	id serial NOT NULL,
	title varchar(200) NOT NULL,
	event_id integer NOT NULL,
	match_type_id integer NOT NULL,
	match_status_id integer NOT NULL,
	CONSTRAINT matches_pk PRIMARY KEY (id),
	CONSTRAINT matches_event_fk FOREIGN KEY (event_id) REFERENCES geki_data.events(id),
	CONSTRAINT matches_match_type_fk FOREIGN KEY (match_type_id) REFERENCES geki_data.match_types(id),
	CONSTRAINT matches_match_status_fk FOREIGN KEY (match_status_id) REFERENCES geki_data.match_statuses(id)
);

CREATE TABLE geki_data.series (
	id serial NOT NULL,
	title varchar(200) NOT NULL,
	alternative_title varchar(200) NOT NULL,
	CONSTRAINT series_pk PRIMARY KEY (id)
);

CREATE TABLE geki_data.submissions (
	id serial NOT NULL,
	match_id integer NOT NULL,
	participant_id integer NOT NULL,
	series_id integer NOT NULL,
	title varchar(200) NOT NULL,
	description varchar(2000) NOT NULL,
	submission_url varchar(300) NOT NULL,
	date_submitted timestamp NOT NULL,
	CONSTRAINT submissions_pk PRIMARY KEY (id),
	CONSTRAINT submissions_match_fk FOREIGN KEY (match_id) REFERENCES geki_data.matches(id),
	CONSTRAINT submissions_participant_fk FOREIGN KEY (participant_id) REFERENCES geki_data.participants(id),
	CONSTRAINT submissions_series_fk FOREIGN KEY (series_id) REFERENCES geki_data.series(id)
);

CREATE TABLE geki_data.ranked_results (
	id serial NOT NULL,
	match_id integer NOT NULL,
	winner_id integer NOT NULL,
	winner_new_elo real NOT NULL,
	winner_old_elo real NOT NULL,
	loser_id integer NOT NULL,
	loser_new_elo real NOT NULL,
	loser_old_elo real NOT NULL,
	date_submitted timestamp NOT NULL,
	CONSTRAINT ranked_results_pk PRIMARY KEY (id),
	CONSTRAINT ranked_results_match_fk FOREIGN KEY (match_id) REFERENCES geki_data.matches(id),
	CONSTRAINT ranked_results_participant_fk FOREIGN KEY (winner_id) REFERENCES geki_data.participants(id),
	CONSTRAINT ranked_results_participant_fk_1 FOREIGN KEY (loser_id) REFERENCES geki_data.participants(id)
);