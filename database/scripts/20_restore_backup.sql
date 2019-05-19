--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2
-- Dumped by pg_dump version 11.3

-- Started on 2019-05-19 11:33:08

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 16386)
-- Name: geki_data; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA geki_data;


ALTER SCHEMA geki_data OWNER TO postgres;

--
-- TOC entry 7 (class 2615 OID 16387)
-- Name: geki_view; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA geki_view;


ALTER SCHEMA geki_view OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 198 (class 1259 OID 16388)
-- Name: events; Type: TABLE; Schema: geki_data; Owner: postgres
--

CREATE TABLE geki_data.events (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    date_start date NOT NULL,
    date_end date NOT NULL
);


ALTER TABLE geki_data.events OWNER TO postgres;

--
-- TOC entry 199 (class 1259 OID 16391)
-- Name: events_id_seq; Type: SEQUENCE; Schema: geki_data; Owner: postgres
--

CREATE SEQUENCE geki_data.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geki_data.events_id_seq OWNER TO postgres;

--
-- TOC entry 3038 (class 0 OID 0)
-- Dependencies: 199
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: geki_data; Owner: postgres
--

ALTER SEQUENCE geki_data.events_id_seq OWNED BY geki_data.events.id;


--
-- TOC entry 200 (class 1259 OID 16393)
-- Name: match_statuses; Type: TABLE; Schema: geki_data; Owner: postgres
--

CREATE TABLE geki_data.match_statuses (
    id integer NOT NULL,
    title character varying(50) NOT NULL
);


ALTER TABLE geki_data.match_statuses OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 16396)
-- Name: match_statuses_id_seq; Type: SEQUENCE; Schema: geki_data; Owner: postgres
--

CREATE SEQUENCE geki_data.match_statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geki_data.match_statuses_id_seq OWNER TO postgres;

--
-- TOC entry 3041 (class 0 OID 0)
-- Dependencies: 201
-- Name: match_statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: geki_data; Owner: postgres
--

ALTER SEQUENCE geki_data.match_statuses_id_seq OWNED BY geki_data.match_statuses.id;


--
-- TOC entry 202 (class 1259 OID 16398)
-- Name: match_types; Type: TABLE; Schema: geki_data; Owner: postgres
--

CREATE TABLE geki_data.match_types (
    id integer NOT NULL,
    title character varying(50) NOT NULL
);


ALTER TABLE geki_data.match_types OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 16401)
-- Name: match_types_id_seq; Type: SEQUENCE; Schema: geki_data; Owner: postgres
--

CREATE SEQUENCE geki_data.match_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geki_data.match_types_id_seq OWNER TO postgres;

--
-- TOC entry 3044 (class 0 OID 0)
-- Dependencies: 203
-- Name: match_types_id_seq; Type: SEQUENCE OWNED BY; Schema: geki_data; Owner: postgres
--

ALTER SEQUENCE geki_data.match_types_id_seq OWNED BY geki_data.match_types.id;


--
-- TOC entry 204 (class 1259 OID 16403)
-- Name: matches; Type: TABLE; Schema: geki_data; Owner: postgres
--

CREATE TABLE geki_data.matches (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    event_id integer NOT NULL,
    match_type_id integer NOT NULL,
    match_status_id integer NOT NULL
);


ALTER TABLE geki_data.matches OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 16406)
-- Name: matches_id_seq; Type: SEQUENCE; Schema: geki_data; Owner: postgres
--

CREATE SEQUENCE geki_data.matches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geki_data.matches_id_seq OWNER TO postgres;

--
-- TOC entry 3047 (class 0 OID 0)
-- Dependencies: 205
-- Name: matches_id_seq; Type: SEQUENCE OWNED BY; Schema: geki_data; Owner: postgres
--

ALTER SEQUENCE geki_data.matches_id_seq OWNED BY geki_data.matches.id;


--
-- TOC entry 206 (class 1259 OID 16408)
-- Name: participants; Type: TABLE; Schema: geki_data; Owner: postgres
--

CREATE TABLE geki_data.participants (
    id integer NOT NULL,
    username character varying(32) NOT NULL,
    avatar_url character varying(200) NOT NULL,
    is_team boolean NOT NULL,
    elo real NOT NULL
);


ALTER TABLE geki_data.participants OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 16411)
-- Name: participants_id_seq; Type: SEQUENCE; Schema: geki_data; Owner: postgres
--

CREATE SEQUENCE geki_data.participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geki_data.participants_id_seq OWNER TO postgres;

--
-- TOC entry 3050 (class 0 OID 0)
-- Dependencies: 207
-- Name: participants_id_seq; Type: SEQUENCE OWNED BY; Schema: geki_data; Owner: postgres
--

ALTER SEQUENCE geki_data.participants_id_seq OWNED BY geki_data.participants.id;


--
-- TOC entry 208 (class 1259 OID 16413)
-- Name: ranked_results; Type: TABLE; Schema: geki_data; Owner: postgres
--

CREATE TABLE geki_data.ranked_results (
    id integer NOT NULL,
    match_id integer NOT NULL,
    winner_id integer NOT NULL,
    winner_new_elo real NOT NULL,
    winner_old_elo real NOT NULL,
    loser_id integer NOT NULL,
    loser_new_elo real NOT NULL,
    loser_old_elo real NOT NULL,
    datetime_submitted timestamp without time zone NOT NULL
);


ALTER TABLE geki_data.ranked_results OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16416)
-- Name: ranked_results_id_seq; Type: SEQUENCE; Schema: geki_data; Owner: postgres
--

CREATE SEQUENCE geki_data.ranked_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geki_data.ranked_results_id_seq OWNER TO postgres;

--
-- TOC entry 3053 (class 0 OID 0)
-- Dependencies: 209
-- Name: ranked_results_id_seq; Type: SEQUENCE OWNED BY; Schema: geki_data; Owner: postgres
--

ALTER SEQUENCE geki_data.ranked_results_id_seq OWNED BY geki_data.ranked_results.id;


--
-- TOC entry 210 (class 1259 OID 16418)
-- Name: series; Type: TABLE; Schema: geki_data; Owner: postgres
--

CREATE TABLE geki_data.series (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    alternative_title character varying(200) NOT NULL
);


ALTER TABLE geki_data.series OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 16421)
-- Name: series_id_seq; Type: SEQUENCE; Schema: geki_data; Owner: postgres
--

CREATE SEQUENCE geki_data.series_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geki_data.series_id_seq OWNER TO postgres;

--
-- TOC entry 3056 (class 0 OID 0)
-- Dependencies: 211
-- Name: series_id_seq; Type: SEQUENCE OWNED BY; Schema: geki_data; Owner: postgres
--

ALTER SEQUENCE geki_data.series_id_seq OWNED BY geki_data.series.id;


--
-- TOC entry 212 (class 1259 OID 16423)
-- Name: submissions; Type: TABLE; Schema: geki_data; Owner: postgres
--

CREATE TABLE geki_data.submissions (
    id integer NOT NULL,
    match_id integer NOT NULL,
    participant_id integer NOT NULL,
    series_id integer NOT NULL,
    title character varying(200) NOT NULL,
    description character varying(2000) NOT NULL,
    submission_url character varying(300) NOT NULL,
    datetime_submitted timestamp without time zone NOT NULL
);


ALTER TABLE geki_data.submissions OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 16429)
-- Name: submissions_id_seq; Type: SEQUENCE; Schema: geki_data; Owner: postgres
--

CREATE SEQUENCE geki_data.submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geki_data.submissions_id_seq OWNER TO postgres;

--
-- TOC entry 3059 (class 0 OID 0)
-- Dependencies: 213
-- Name: submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: geki_data; Owner: postgres
--

ALTER SEQUENCE geki_data.submissions_id_seq OWNED BY geki_data.submissions.id;


--
-- TOC entry 214 (class 1259 OID 16431)
-- Name: team_members; Type: TABLE; Schema: geki_data; Owner: postgres
--

CREATE TABLE geki_data.team_members (
    id integer NOT NULL,
    participant_id integer NOT NULL,
    team_id integer NOT NULL
);


ALTER TABLE geki_data.team_members OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16434)
-- Name: team_members_id_seq; Type: SEQUENCE; Schema: geki_data; Owner: postgres
--

CREATE SEQUENCE geki_data.team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geki_data.team_members_id_seq OWNER TO postgres;

--
-- TOC entry 3062 (class 0 OID 0)
-- Dependencies: 215
-- Name: team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: geki_data; Owner: postgres
--

ALTER SEQUENCE geki_data.team_members_id_seq OWNED BY geki_data.team_members.id;


--
-- TOC entry 216 (class 1259 OID 16436)
-- Name: events; Type: VIEW; Schema: geki_view; Owner: postgres
--

CREATE VIEW geki_view.events AS
SELECT
    NULL::integer AS id,
    NULL::character varying(200) AS title,
    NULL::bigint AS num_matches,
    NULL::date AS date_start,
    NULL::date AS date_end;


ALTER TABLE geki_view.events OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16440)
-- Name: match_statuses; Type: VIEW; Schema: geki_view; Owner: postgres
--

CREATE VIEW geki_view.match_statuses AS
 SELECT match_statuses.id,
    match_statuses.title
   FROM geki_data.match_statuses;


ALTER TABLE geki_view.match_statuses OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16444)
-- Name: match_types; Type: VIEW; Schema: geki_view; Owner: postgres
--

CREATE VIEW geki_view.match_types AS
 SELECT match_types.id,
    match_types.title
   FROM geki_data.match_types;


ALTER TABLE geki_view.match_types OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16448)
-- Name: matches; Type: VIEW; Schema: geki_view; Owner: postgres
--

CREATE VIEW geki_view.matches AS
SELECT
    NULL::integer AS id,
    NULL::character varying(200) AS title,
    NULL::bigint AS num_submissions,
    NULL::integer AS event_id,
    NULL::character varying(200) AS event_title,
    NULL::integer AS match_type_id,
    NULL::character varying(50) AS match_type,
    NULL::integer AS match_status_id,
    NULL::character varying(50) AS match_status;


ALTER TABLE geki_view.matches OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16452)
-- Name: participants; Type: VIEW; Schema: geki_view; Owner: postgres
--

CREATE VIEW geki_view.participants AS
SELECT
    NULL::integer AS id,
    NULL::character varying(32) AS username,
    NULL::character varying(200) AS avatar_url,
    NULL::real AS elo,
    NULL::bigint AS ranked_battles,
    NULL::bigint AS wins,
    NULL::bigint AS losses;


ALTER TABLE geki_view.participants OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16456)
-- Name: ranked_results; Type: VIEW; Schema: geki_view; Owner: postgres
--

CREATE VIEW geki_view.ranked_results AS
SELECT
    NULL::integer AS id,
    NULL::integer AS match_id,
    NULL::character varying(200) AS match_title,
    NULL::integer AS winner_id,
    NULL::character varying(32) AS winner,
    NULL::real AS winner_new_elo,
    NULL::real AS winner_old_elo,
    NULL::integer AS loser_id,
    NULL::character varying(32) AS loser,
    NULL::real AS loser_new_elo,
    NULL::real AS loser_old_elo,
    NULL::timestamp without time zone AS datetime_submitted;


ALTER TABLE geki_view.ranked_results OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16460)
-- Name: series; Type: VIEW; Schema: geki_view; Owner: postgres
--

CREATE VIEW geki_view.series AS
 SELECT series.id,
    series.title,
    series.alternative_title
   FROM geki_data.series;


ALTER TABLE geki_view.series OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16464)
-- Name: submissions; Type: VIEW; Schema: geki_view; Owner: postgres
--

CREATE VIEW geki_view.submissions AS
SELECT
    NULL::integer AS id,
    NULL::integer AS match_id,
    NULL::character varying(200) AS match_title,
    NULL::integer AS participant_id,
    NULL::character varying(32) AS participant,
    NULL::integer AS series_id,
    NULL::character varying(200) AS series,
    NULL::character varying(200) AS title,
    NULL::character varying(2000) AS description,
    NULL::character varying(300) AS submission_url,
    NULL::timestamp without time zone AS datetime_submitted;


ALTER TABLE geki_view.submissions OWNER TO postgres;

--
-- TOC entry 2845 (class 2604 OID 16468)
-- Name: events id; Type: DEFAULT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.events ALTER COLUMN id SET DEFAULT nextval('geki_data.events_id_seq'::regclass);


--
-- TOC entry 2846 (class 2604 OID 16469)
-- Name: match_statuses id; Type: DEFAULT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.match_statuses ALTER COLUMN id SET DEFAULT nextval('geki_data.match_statuses_id_seq'::regclass);


--
-- TOC entry 2847 (class 2604 OID 16470)
-- Name: match_types id; Type: DEFAULT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.match_types ALTER COLUMN id SET DEFAULT nextval('geki_data.match_types_id_seq'::regclass);


--
-- TOC entry 2848 (class 2604 OID 16471)
-- Name: matches id; Type: DEFAULT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.matches ALTER COLUMN id SET DEFAULT nextval('geki_data.matches_id_seq'::regclass);


--
-- TOC entry 2849 (class 2604 OID 16472)
-- Name: participants id; Type: DEFAULT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.participants ALTER COLUMN id SET DEFAULT nextval('geki_data.participants_id_seq'::regclass);


--
-- TOC entry 2850 (class 2604 OID 16473)
-- Name: ranked_results id; Type: DEFAULT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.ranked_results ALTER COLUMN id SET DEFAULT nextval('geki_data.ranked_results_id_seq'::regclass);


--
-- TOC entry 2851 (class 2604 OID 16474)
-- Name: series id; Type: DEFAULT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.series ALTER COLUMN id SET DEFAULT nextval('geki_data.series_id_seq'::regclass);


--
-- TOC entry 2852 (class 2604 OID 16475)
-- Name: submissions id; Type: DEFAULT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.submissions ALTER COLUMN id SET DEFAULT nextval('geki_data.submissions_id_seq'::regclass);


--
-- TOC entry 2853 (class 2604 OID 16476)
-- Name: team_members id; Type: DEFAULT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.team_members ALTER COLUMN id SET DEFAULT nextval('geki_data.team_members_id_seq'::regclass);


--
-- TOC entry 3012 (class 0 OID 16388)
-- Dependencies: 198
-- Data for Name: events; Type: TABLE DATA; Schema: geki_data; Owner: postgres
--

COPY geki_data.events (id, title, date_start, date_end) FROM stdin;
1	Arrangement Competition	2018-11-01	2018-11-30
2	Christmas Edition	2018-12-01	2018-12-31
3	Elite Seat Challenges	2019-01-01	2019-01-31
4	Free-For-All Challenges	2019-02-01	2019-02-28
6	Ranked Battles (2019)	2019-03-01	2019-12-31
7	Miscellaneous	2019-01-01	2019-12-31
5	March/April 2019 Monthly	2019-03-01	2019-05-06
8	May/June 2019 Monthly	2019-05-17	2019-06-30
\.


--
-- TOC entry 3014 (class 0 OID 16393)
-- Dependencies: 200
-- Data for Name: match_statuses; Type: TABLE DATA; Schema: geki_data; Owner: postgres
--

COPY geki_data.match_statuses (id, title) FROM stdin;
1	Cancelled
2	In Progress
3	Judging
4	Completed
\.


--
-- TOC entry 3016 (class 0 OID 16398)
-- Dependencies: 202
-- Data for Name: match_types; Type: TABLE DATA; Schema: geki_data; Owner: postgres
--

COPY geki_data.match_types (id, title) FROM stdin;
1	None
2	Casual
3	Competition
4	Ranked
\.


--
-- TOC entry 3018 (class 0 OID 16403)
-- Dependencies: 204
-- Data for Name: matches; Type: TABLE DATA; Schema: geki_data; Owner: postgres
--

COPY geki_data.matches (id, title, event_id, match_type_id, match_status_id) FROM stdin;
1	November 2018 Arrangement Competition	1	3	4
2	December 2018 Christmas Edition	2	3	4
3	Nagi no Asukara OP1 - lull ~Soshite Bokura wa~	3	4	4
4	Fireworks - Uchiage Hanabi	3	4	4
5	Samurai Champloo ED - Shiki no Uta	3	4	4
6	OreGairu S2 ED - Everyday World	3	4	4
7	Digimon - Butterfly	3	4	4
8	Original Composition	3	4	4
9	Irozuku Sekai no Ashita kara OP - 17-sai	4	4	4
10	Aria the Natural OP - Euforia	4	4	4
11	Original Composition	4	4	4
12	Your Name - Nandemonaiya	4	4	4
13	Original Composition	4	4	4
14	The Rising of the Shield Hero ED - Kimi no Namae	4	4	4
15	Guilty Crown OP - My Dearest	4	4	4
16	Digimon Adventure 2 - Break Up!	4	4	4
17	Fullmetal Alchemist: Brotherhood OP3 - Golden Time Lover	4	2	4
18	GReeeeN - Kiseki	4	4	4
19	Domestic na Kanojo OP - Kawaki wo Ameku	6	4	4
20	Gotoubun no Hanayome OP - Gotoubun no Kimochi	6	4	4
21	Pokemon: The Johto Journeys Theme	6	4	4
23	A Silent Voice - Lit	6	4	4
24	Black Clover OP3 - Black Rover	6	4	4
25	Happy Birthday	6	4	4
26	Attack on Titan S3 Part 2 OP - Shoukei to Shikabane no Michi	6	4	4
27	SWEET vs Spicy - Maquia - viator	7	2	4
22	Kaguya-sama: Love Is War ED - Sentimental Crisis	6	4	4
30	Black Clover ED - Aoi Honoo	6	4	2
31	Re:Zero OST - Wish of the Stars	6	4	2
32	Highschool of the Dead OP - Highschool of the Dead	6	4	2
29	Doki Doki Literature Club - Your Reality	6	4	2
28	March/April 2019 Monthly	5	3	4
33	May/June 2019 Monthly	8	3	2
\.


--
-- TOC entry 3020 (class 0 OID 16408)
-- Dependencies: 206
-- Data for Name: participants; Type: TABLE DATA; Schema: geki_data; Owner: postgres
--

COPY geki_data.participants (id, username, avatar_url, is_team, elo) FROM stdin;
1	GEKI		f	-1
2	Admin		f	-1
3	thaorem		f	1400
4	Quan		f	1400
5	Kurosara		f	1400
6	Seranot		f	1400
7	MasagoYaki		f	1400
8	Bob		f	1400
9	wasuke		f	1400
10	dundun		f	1400
11	H Chang		f	1400
12	Tommy		f	1400
13	Eren		f	1400
14	Vee		f	1400
15	phan		f	1400
16	Cy		f	1400
17	Sinh		f	1400
18	little		f	1400
19	Simooonii		f	1400
20	Feifei		f	1400
21	Mardekoya		f	1400
22	Bae-Kun & Egg		f	1400
23	Jerry	 	f	1400
\.


--
-- TOC entry 3022 (class 0 OID 16413)
-- Dependencies: 208
-- Data for Name: ranked_results; Type: TABLE DATA; Schema: geki_data; Owner: postgres
--

COPY geki_data.ranked_results (id, match_id, winner_id, winner_new_elo, winner_old_elo, loser_id, loser_new_elo, loser_old_elo, datetime_submitted) FROM stdin;
\.


--
-- TOC entry 3024 (class 0 OID 16418)
-- Dependencies: 210
-- Data for Name: series; Type: TABLE DATA; Schema: geki_data; Owner: postgres
--

COPY geki_data.series (id, title, alternative_title) FROM stdin;
1	Wotakoi: Love is Hard for Otaku	Wotaku ni Koi wa Muzukashii
2	Re:Zero	
3	Nagi no Asukara	Nagi-Asu: A Lull in the Sea
4	Uchiage Hanabi	Fireworks
5	Samurai Champloo	
6	OreGairu	My Teen Romantic Comedy SNAFU
7	Digimon	Irozuku Sekai no Ashita kara
8	Aria	
9	Your Name	Kimi no Na wa
10	Tate no Yuusha no Nariagari	The Rising of the Shield Hero
11	Guilty Crown	
12	Fullmetal Alchemist: Brotherhood	
13	GReeeeN	
14	Domestic na Kanojo	Domestic Girlfriend
15	Maquia: When the Promised Flower Blooms	
16	Pokemon	
17	Your Lie in April	Shigatsu wa Kimi no Uso
18	The Quintessential Quintuplets	5-Toubun no Hanayome
19	A Silent Voice	Koe no Katachi
20	Attack on Titan	
21	Original	
22	Miscellaneous	
23	Irozuku Sekai no Ashita kara	
24	Black Clover	
25	The Legend of Zelda	
\.


--
-- TOC entry 3026 (class 0 OID 16423)
-- Dependencies: 212
-- Data for Name: submissions; Type: TABLE DATA; Schema: geki_data; Owner: postgres
--

COPY geki_data.submissions (id, match_id, participant_id, series_id, title, description, submission_url, datetime_submitted) FROM stdin;
1	1	3	1	Fiction		https://drive.google.com/file/d/1-dYqBOjccdwf-WYz0rGQmdT8vA83hgcd/view?usp=drivesdk	2018-11-11 23:56:15.98
2	1	4	2	Stay Alive		https://streamable.com/vq0zg	2018-11-28 19:59:52.355
3	1	6	2	Stay Alive		https://youtu.be/MrufRcmbonc	2018-12-01 02:00:13.28
4	1	5	2	Stay Alive		https://cdn.discordapp.com/attachments/533877914194673685/540089962281041953/Interim_-_Phong_Bach.m4a	2018-12-01 07:25:31.591
5	2	8	21	Sleepless on Christmas Eve		https://youtu.be/LCAzavQthKg	2018-12-25 07:09:41.03
6	2	7	22	Have Yourself a Merry Little Christmas		https://youtu.be/L19xvtnBAbY	2018-12-29 04:46:51.573
7	2	9	22	Christmas Carol Medley		https://www.youtube.com/watch?v=ALaA9pgIB-o	2018-12-30 05:50:19.459
8	2	10	22	Jingle Bells		https://youtu.be/obMtxIa-9HQ	2019-01-05 07:40:32.717
9	3	11	3	lull ~Soshite Bokura wa~		https://cdn.discordapp.com/attachments/533877914194673685/533881918496964618/nagiasu_geki.mp3	2019-01-05 21:52:09.39
10	3	8	3	lull ~Soshite Bokura wa~		https://cdn.discordapp.com/attachments/533877914194673685/533882156519391242/Nagiop.mp3	2019-01-06 08:09:58.184
11	4	9	4	Uchiage Hanabi		https://cdn.discordapp.com/attachments/533877914194673685/533882665628205067/hanavagina.mp3	2019-01-11 05:36:18.214
12	4	10	4	Uchiage Hanabi		https://cdn.discordapp.com/attachments/533877914194673685/533882944079790080/Dundun_-_Hanabi.mp3	2019-01-11 05:50:43.07
13	5	7	5	Shiki no Uta		https://cdn.discordapp.com/attachments/533877914194673685/533883093728231424/Ramel_-_Shiki_no_Uta.mp3	2019-01-12 20:21:16.64
14	5	12	5	Shiki no Uta		https://cdn.discordapp.com/attachments/533877914194673685/533883032927600653/Tommy_-_Shiki_no_Uta.mp3	2019-01-12 20:24:00.594
15	6	8	6	Everyday World		https://cdn.discordapp.com/attachments/533877914194673685/534494225702584330/Bob_-_Everyday_World.mp3	2019-01-14 21:48:57.207
16	6	4	6	Everyday World		https://cdn.discordapp.com/attachments/533877914194673685/534494055795785728/Quan_-_Everyday_World.mp3	2019-01-14 22:07:32.384
17	7	8	7	Butterfly		https://youtu.be/fkkEicgkfKk	2019-01-21 01:15:46.063
18	7	10	7	Butterfly		https://youtu.be/6Dy4iWX77QQ	2019-01-21 05:50:43.254
19	8	8	21	Elevation		https://cdn.discordapp.com/attachments/502704652739936266/539648361259597834/Elevation_-_Bob_Ma.mp3	2019-01-29 03:29:55.701
20	8	5	21	Interim		https://cdn.discordapp.com/attachments/502704652739936266/540061136700178438/Interim_-_Phong_Bach.m4a	2019-01-30 06:50:08.961
21	9	8	23	17-sai		https://cdn.discordapp.com/attachments/502704652739936266/542251320325963787/17_sai.mp3	2019-02-05 07:53:09.46
22	9	9	23	17-sai		https://youtu.be/P4s_TEon4Zo	2019-02-05 07:59:55.41
23	10	12	8	Euforia		https://cdn.discordapp.com/attachments/502704652739936266/542813150173593636/Tommys_Euforia_New_Mix.mp3	2019-02-06 21:05:40.423
24	10	13	8	Euforia		https://cdn.discordapp.com/attachments/502704652739936266/542863231543410698/ariAH.mp3	2019-02-07 00:24:40.424
25	11	8	21	Hearts Chambers		https://cdn.discordapp.com/attachments/502704652739936266/543967096971853835/Hearts_Chambers.mp3	2019-02-10 01:31:02.74
26	11	5	21	Like Time		https://cdn.discordapp.com/attachments/502704652739936266/544071254936911882/Like_Time.mp3	2019-02-10 08:24:55.672
27	12	7	9	Nandemonaiya		https://cdn.discordapp.com/attachments/502704652739936266/544368787391119371/Nandemonaiya_-_Asswimps_mixed_and_assed.mp3	2019-02-11 04:07:12.976
28	12	14	9	Nandemonaiya		https://youtu.be/jU_WGoXsOV8	2019-02-11 06:21:10.388
29	13	15	21	phanime Opening		https://cdn.discordapp.com/attachments/502704652739936266/543616688973676544/phanimeopening.mp3	2019-02-09 02:18:38.561
30	13	8	21	Warm Winter Coat		https://cdn.discordapp.com/attachments/502704652739936266/544409432495226880/Warm_Winter_Coat.mp3	2019-02-11 06:48:43.518
31	14	12	10	Kimi no Namae		https://www.youtube.com/watch?v=Vqp9z9cK2JM	2019-02-11 17:18:37.342
32	14	16	10	Kimi no Namae		https://cdn.discordapp.com/attachments/502704652739936266/545747872096714762/Cy_-_Kimi_no_Namae_Guitargeki.mp3	2019-02-14 23:27:12.348
33	15	14	11	My Dearest		https://youtu.be/9zuASL8pyL4	2019-02-17 06:55:41.417
34	15	8	11	My Dearest		https://youtu.be/v2uiD0_kCVM	2019-02-17 07:56:32.246
35	16	8	7	Break Up!		https://youtu.be/vQIDb8--Pfc	2019-02-23 00:34:24.977
36	16	10	7	Break Up!		https://cdn.discordapp.com/attachments/502704652739936266/548954124406882314/Digimon_2-2.m4a	2019-02-23 19:47:42.513
37	17	11	12	Golden Time Lover		https://cdn.discordapp.com/attachments/502704652739936266/546519162445365248/WHY_YALL_MAKE_ME_PLAY_34_GUITAR_AND_SCREW_RECORDING_AND_MIXING.mp3	2019-02-17 02:32:02.356
38	17	12	12	Golden Time Lover		https://cdn.discordapp.com/attachments/502704652739936266/549325018320994322/Tommys_Golden_ASS_Lover.mp3	2019-02-24 20:21:30.486
39	17	7	12	Golden Time Lover		https://cdn.discordapp.com/attachments/502704652739936266/549463789427490836/CRAPYOURHANDS_Masago.mp3	2019-02-25 05:32:56.1
40	17	10	12	Golden Time Lover		https://cdn.discordapp.com/attachments/502704652739936266/549470117017419806/Voice_014-1.m4a	2019-02-25 05:58:04.671
41	18	17	13	Kiseki		https://cdn.discordapp.com/attachments/502704652739936266/550942884569022474/kiseki_recorded_in_vc.m4a	2019-03-01 07:30:19.705
42	18	8	13	Kiseki		https://cdn.discordapp.com/attachments/502704652739936266/550947785843802123/Kiseki_Geki.mp3	2019-03-01 07:49:48.442
43	19	18	14	Kawaki wo Ameku		https://cdn.discordapp.com/attachments/502704652739936266/559395218735235113/domestic_no_kanojo_x_kanojo_x_kanojo__.mp3	2019-03-24 15:16:53.322
44	19	19	14	Kawaki wo Ameku		https://cdn.discordapp.com/attachments/502704652739936266/559878885072830475/Kawaki_wo_Ameku_I_give_up.mp3	2019-03-25 23:18:48.436
45	27	19	15	viator		https://cdn.discordapp.com/attachments/502704652739936266/566988540886515726/Maquia_Theme_1.mp3	2019-04-14 14:10:02.538
46	27	18	15	viator		https://cdn.discordapp.com/attachments/502704652739936266/567498275662462986/maquia_theme_credit_to_null_gaming_for_removing_some_of_the_background_noise.mp3	2019-04-15 23:55:32.652
47	27	8	15	viator		https://cdn.discordapp.com/attachments/502704652739936266/567577491808452618/viator_geki.wav	2019-04-16 05:10:19.551
48	21	12	16	Pokemon Johto		https://www.youtube.com/watch?v=oK8tfYHVlc0	2019-04-19 05:39:51.536
49	21	10	16	Pokemon Johto		https://cdn.discordapp.com/attachments/502704652739936266/570484303100641280/Pokemon_Johto_OP_MP3.mp3	2019-04-24 05:40:57.337
50	28	20	17	Orange		https://www.youtube.com/watch?v=ql0-KIV4KHg	2019-04-24 19:52:08.335
51	28	8	17	Kirameki		https://youtu.be/2O5FGP_sZ1g	2019-05-01 07:10:55.676
52	20	8	18	Gotoubun no Kimochi		https://youtu.be/8joZEu_m75k	2019-04-27 02:22:38.216
53	20	16	18	Gotoubun no Kimochi		https://cdn.discordapp.com/attachments/502704652739936266/571547518878482452/quinsentialofdisapointment.aac	2019-04-27 04:05:47.449
54	23	9	19	Lit		https://www.youtube.com/watch?v=JM_aq9_H20w	2019-04-28 22:47:30.692
55	23	10	19	Lit		https://cdn.discordapp.com/attachments/502704652739936266/572254663232192601/Wasukemode1.mp3	2019-04-29 02:55:43.851
56	25	21	22	Happy Birthday		https://youtu.be/tXN5VUM1WiU	2019-05-01 20:38:01.392
57	25	8	22	Happy Birthday		https://cdn.discordapp.com/attachments/502704652739936266/573286762902716416/Happy_Birthday_Geki.wav	2019-05-01 23:16:55.704
58	26	20	20	Shoukei to Shikabane no Michi		https://youtu.be/CCqe3D2WwKg	2019-05-02 17:20:45.892
59	26	10	20	Shoukei to Shikabane no Michi		https://cdn.discordapp.com/attachments/502704652739936266/575933306265272320/Nestor_Shoukei_to_Shikabane_no_michi.mp3	2019-05-09 06:33:20.65
60	24	9	24	Black Rover	 	https://youtu.be/5kX78miVF_k	2019-05-06 07:03:25.62
61	30	14	24	Aoi Honoo		https://cdn.discordapp.com/attachments/502704652739936266/579169041764057090/Vee_Black_Clover_ed_1_tv_size_ver_mp3.mp3	2019-05-18 04:50:59.997
\.


--
-- TOC entry 3028 (class 0 OID 16431)
-- Dependencies: 214
-- Data for Name: team_members; Type: TABLE DATA; Schema: geki_data; Owner: postgres
--

COPY geki_data.team_members (id, participant_id, team_id) FROM stdin;
\.


--
-- TOC entry 3072 (class 0 OID 0)
-- Dependencies: 199
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: geki_data; Owner: postgres
--

SELECT pg_catalog.setval('geki_data.events_id_seq', 8, true);


--
-- TOC entry 3073 (class 0 OID 0)
-- Dependencies: 201
-- Name: match_statuses_id_seq; Type: SEQUENCE SET; Schema: geki_data; Owner: postgres
--

SELECT pg_catalog.setval('geki_data.match_statuses_id_seq', 4, true);


--
-- TOC entry 3074 (class 0 OID 0)
-- Dependencies: 203
-- Name: match_types_id_seq; Type: SEQUENCE SET; Schema: geki_data; Owner: postgres
--

SELECT pg_catalog.setval('geki_data.match_types_id_seq', 4, true);


--
-- TOC entry 3075 (class 0 OID 0)
-- Dependencies: 205
-- Name: matches_id_seq; Type: SEQUENCE SET; Schema: geki_data; Owner: postgres
--

SELECT pg_catalog.setval('geki_data.matches_id_seq', 33, true);


--
-- TOC entry 3076 (class 0 OID 0)
-- Dependencies: 207
-- Name: participants_id_seq; Type: SEQUENCE SET; Schema: geki_data; Owner: postgres
--

SELECT pg_catalog.setval('geki_data.participants_id_seq', 23, true);


--
-- TOC entry 3077 (class 0 OID 0)
-- Dependencies: 209
-- Name: ranked_results_id_seq; Type: SEQUENCE SET; Schema: geki_data; Owner: postgres
--

SELECT pg_catalog.setval('geki_data.ranked_results_id_seq', 1, false);


--
-- TOC entry 3078 (class 0 OID 0)
-- Dependencies: 211
-- Name: series_id_seq; Type: SEQUENCE SET; Schema: geki_data; Owner: postgres
--

SELECT pg_catalog.setval('geki_data.series_id_seq', 25, true);


--
-- TOC entry 3079 (class 0 OID 0)
-- Dependencies: 213
-- Name: submissions_id_seq; Type: SEQUENCE SET; Schema: geki_data; Owner: postgres
--

SELECT pg_catalog.setval('geki_data.submissions_id_seq', 61, true);


--
-- TOC entry 3080 (class 0 OID 0)
-- Dependencies: 215
-- Name: team_members_id_seq; Type: SEQUENCE SET; Schema: geki_data; Owner: postgres
--

SELECT pg_catalog.setval('geki_data.team_members_id_seq', 1, false);


--
-- TOC entry 2855 (class 2606 OID 16478)
-- Name: events events_pk; Type: CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.events
    ADD CONSTRAINT events_pk PRIMARY KEY (id);


--
-- TOC entry 2857 (class 2606 OID 16480)
-- Name: match_statuses match_statuses_pk; Type: CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.match_statuses
    ADD CONSTRAINT match_statuses_pk PRIMARY KEY (id);


--
-- TOC entry 2859 (class 2606 OID 16482)
-- Name: match_types match_types_pk; Type: CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.match_types
    ADD CONSTRAINT match_types_pk PRIMARY KEY (id);


--
-- TOC entry 2861 (class 2606 OID 16484)
-- Name: matches matches_pk; Type: CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.matches
    ADD CONSTRAINT matches_pk PRIMARY KEY (id);


--
-- TOC entry 2863 (class 2606 OID 16486)
-- Name: participants participants_pk; Type: CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.participants
    ADD CONSTRAINT participants_pk PRIMARY KEY (id);


--
-- TOC entry 2865 (class 2606 OID 16488)
-- Name: ranked_results ranked_results_pk; Type: CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.ranked_results
    ADD CONSTRAINT ranked_results_pk PRIMARY KEY (id);


--
-- TOC entry 2867 (class 2606 OID 16490)
-- Name: series series_pk; Type: CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.series
    ADD CONSTRAINT series_pk PRIMARY KEY (id);


--
-- TOC entry 2869 (class 2606 OID 16492)
-- Name: submissions submissions_pk; Type: CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.submissions
    ADD CONSTRAINT submissions_pk PRIMARY KEY (id);


--
-- TOC entry 2871 (class 2606 OID 16494)
-- Name: team_members team_members_pk; Type: CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.team_members
    ADD CONSTRAINT team_members_pk PRIMARY KEY (id);


--
-- TOC entry 3004 (class 2618 OID 16439)
-- Name: events _RETURN; Type: RULE; Schema: geki_view; Owner: postgres
--

CREATE OR REPLACE VIEW geki_view.events AS
 SELECT events.id,
    events.title,
    count(matches.event_id) AS num_matches,
    events.date_start,
    events.date_end
   FROM (geki_data.events
     LEFT JOIN geki_data.matches ON ((events.id = matches.event_id)))
  GROUP BY events.id;


--
-- TOC entry 3007 (class 2618 OID 16451)
-- Name: matches _RETURN; Type: RULE; Schema: geki_view; Owner: postgres
--

CREATE OR REPLACE VIEW geki_view.matches AS
 SELECT matches.id,
    matches.title,
    count(submissions.match_id) AS num_submissions,
    matches.event_id,
    events.title AS event_title,
    matches.match_type_id,
    match_types.title AS match_type,
    matches.match_status_id,
    match_statuses.title AS match_status
   FROM ((((geki_data.matches
     LEFT JOIN geki_data.submissions ON ((matches.id = submissions.match_id)))
     LEFT JOIN geki_data.events ON ((matches.event_id = events.id)))
     LEFT JOIN geki_data.match_types ON ((matches.match_type_id = match_types.id)))
     LEFT JOIN geki_data.match_statuses ON ((matches.match_status_id = match_statuses.id)))
  GROUP BY matches.id, events.id, match_types.id, match_statuses.id;


--
-- TOC entry 3008 (class 2618 OID 16455)
-- Name: participants _RETURN; Type: RULE; Schema: geki_view; Owner: postgres
--

CREATE OR REPLACE VIEW geki_view.participants AS
 SELECT participants.id,
    participants.username,
    participants.avatar_url,
    participants.elo,
    count(submissions.participant_id) AS ranked_battles,
    count(ranked_results.winner_id) AS wins,
    count(ranked_results.loser_id) AS losses
   FROM (((geki_data.participants
     LEFT JOIN geki_data.ranked_results ON ((participants.id = ranked_results.winner_id)))
     LEFT JOIN geki_data.submissions ON ((participants.id = submissions.participant_id)))
     LEFT JOIN geki_data.matches ON ((submissions.match_id = matches.id)))
  WHERE (matches.match_type_id = 4)
  GROUP BY participants.id;


--
-- TOC entry 3009 (class 2618 OID 16459)
-- Name: ranked_results _RETURN; Type: RULE; Schema: geki_view; Owner: postgres
--

CREATE OR REPLACE VIEW geki_view.ranked_results AS
 SELECT ranked_results.id,
    ranked_results.match_id,
    matches.title AS match_title,
    ranked_results.winner_id,
    p1.username AS winner,
    ranked_results.winner_new_elo,
    ranked_results.winner_old_elo,
    ranked_results.loser_id,
    p2.username AS loser,
    ranked_results.loser_new_elo,
    ranked_results.loser_old_elo,
    ranked_results.datetime_submitted
   FROM (((geki_data.ranked_results
     LEFT JOIN geki_data.matches ON ((ranked_results.match_id = matches.id)))
     LEFT JOIN geki_data.participants p1 ON ((ranked_results.winner_id = p1.id)))
     JOIN geki_data.participants p2 ON ((ranked_results.loser_id = p2.id)))
  GROUP BY ranked_results.id, matches.id, p1.id, p2.id;


--
-- TOC entry 3011 (class 2618 OID 16467)
-- Name: submissions _RETURN; Type: RULE; Schema: geki_view; Owner: postgres
--

CREATE OR REPLACE VIEW geki_view.submissions AS
 SELECT submissions.id,
    submissions.match_id,
    matches.title AS match_title,
    submissions.participant_id,
    participants.username AS participant,
    submissions.series_id,
    series.title AS series,
    submissions.title,
    submissions.description,
    submissions.submission_url,
    submissions.datetime_submitted
   FROM (((geki_data.submissions
     LEFT JOIN geki_data.matches ON ((submissions.match_id = matches.id)))
     LEFT JOIN geki_data.participants ON ((submissions.participant_id = participants.id)))
     LEFT JOIN geki_data.series ON ((submissions.series_id = series.id)))
  GROUP BY submissions.id, matches.id, participants.id, series.id;


--
-- TOC entry 2872 (class 2606 OID 16499)
-- Name: matches matches_event_fk; Type: FK CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.matches
    ADD CONSTRAINT matches_event_fk FOREIGN KEY (event_id) REFERENCES geki_data.events(id);


--
-- TOC entry 2873 (class 2606 OID 16504)
-- Name: matches matches_match_status_fk; Type: FK CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.matches
    ADD CONSTRAINT matches_match_status_fk FOREIGN KEY (match_status_id) REFERENCES geki_data.match_statuses(id);


--
-- TOC entry 2874 (class 2606 OID 16509)
-- Name: matches matches_match_type_fk; Type: FK CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.matches
    ADD CONSTRAINT matches_match_type_fk FOREIGN KEY (match_type_id) REFERENCES geki_data.match_types(id);


--
-- TOC entry 2875 (class 2606 OID 16514)
-- Name: ranked_results ranked_results_match_fk; Type: FK CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.ranked_results
    ADD CONSTRAINT ranked_results_match_fk FOREIGN KEY (match_id) REFERENCES geki_data.matches(id);


--
-- TOC entry 2876 (class 2606 OID 16519)
-- Name: ranked_results ranked_results_participant_fk; Type: FK CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.ranked_results
    ADD CONSTRAINT ranked_results_participant_fk FOREIGN KEY (winner_id) REFERENCES geki_data.participants(id);


--
-- TOC entry 2877 (class 2606 OID 16524)
-- Name: ranked_results ranked_results_participant_fk_1; Type: FK CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.ranked_results
    ADD CONSTRAINT ranked_results_participant_fk_1 FOREIGN KEY (loser_id) REFERENCES geki_data.participants(id);


--
-- TOC entry 2878 (class 2606 OID 16529)
-- Name: submissions submissions_match_fk; Type: FK CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.submissions
    ADD CONSTRAINT submissions_match_fk FOREIGN KEY (match_id) REFERENCES geki_data.matches(id);


--
-- TOC entry 2879 (class 2606 OID 16534)
-- Name: submissions submissions_participant_fk; Type: FK CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.submissions
    ADD CONSTRAINT submissions_participant_fk FOREIGN KEY (participant_id) REFERENCES geki_data.participants(id);


--
-- TOC entry 2880 (class 2606 OID 16539)
-- Name: submissions submissions_series_fk; Type: FK CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.submissions
    ADD CONSTRAINT submissions_series_fk FOREIGN KEY (series_id) REFERENCES geki_data.series(id);


--
-- TOC entry 2881 (class 2606 OID 16544)
-- Name: team_members team_members_participants_fk; Type: FK CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.team_members
    ADD CONSTRAINT team_members_participants_fk FOREIGN KEY (participant_id) REFERENCES geki_data.participants(id);


--
-- TOC entry 2882 (class 2606 OID 16549)
-- Name: team_members team_members_participants_fk_1; Type: FK CONSTRAINT; Schema: geki_data; Owner: postgres
--

ALTER TABLE ONLY geki_data.team_members
    ADD CONSTRAINT team_members_participants_fk_1 FOREIGN KEY (team_id) REFERENCES geki_data.participants(id);


--
-- TOC entry 3035 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA geki_data; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA geki_data TO api;


--
-- TOC entry 3036 (class 0 OID 0)
-- Dependencies: 7
-- Name: SCHEMA geki_view; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA geki_view TO api;


--
-- TOC entry 3037 (class 0 OID 0)
-- Dependencies: 198
-- Name: TABLE events; Type: ACL; Schema: geki_data; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE geki_data.events TO api;


--
-- TOC entry 3039 (class 0 OID 0)
-- Dependencies: 199
-- Name: SEQUENCE events_id_seq; Type: ACL; Schema: geki_data; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE geki_data.events_id_seq TO api;


--
-- TOC entry 3040 (class 0 OID 0)
-- Dependencies: 200
-- Name: TABLE match_statuses; Type: ACL; Schema: geki_data; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE geki_data.match_statuses TO api;


--
-- TOC entry 3042 (class 0 OID 0)
-- Dependencies: 201
-- Name: SEQUENCE match_statuses_id_seq; Type: ACL; Schema: geki_data; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE geki_data.match_statuses_id_seq TO api;


--
-- TOC entry 3043 (class 0 OID 0)
-- Dependencies: 202
-- Name: TABLE match_types; Type: ACL; Schema: geki_data; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE geki_data.match_types TO api;


--
-- TOC entry 3045 (class 0 OID 0)
-- Dependencies: 203
-- Name: SEQUENCE match_types_id_seq; Type: ACL; Schema: geki_data; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE geki_data.match_types_id_seq TO api;


--
-- TOC entry 3046 (class 0 OID 0)
-- Dependencies: 204
-- Name: TABLE matches; Type: ACL; Schema: geki_data; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE geki_data.matches TO api;


--
-- TOC entry 3048 (class 0 OID 0)
-- Dependencies: 205
-- Name: SEQUENCE matches_id_seq; Type: ACL; Schema: geki_data; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE geki_data.matches_id_seq TO api;


--
-- TOC entry 3049 (class 0 OID 0)
-- Dependencies: 206
-- Name: TABLE participants; Type: ACL; Schema: geki_data; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE geki_data.participants TO api;


--
-- TOC entry 3051 (class 0 OID 0)
-- Dependencies: 207
-- Name: SEQUENCE participants_id_seq; Type: ACL; Schema: geki_data; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE geki_data.participants_id_seq TO api;


--
-- TOC entry 3052 (class 0 OID 0)
-- Dependencies: 208
-- Name: TABLE ranked_results; Type: ACL; Schema: geki_data; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE geki_data.ranked_results TO api;


--
-- TOC entry 3054 (class 0 OID 0)
-- Dependencies: 209
-- Name: SEQUENCE ranked_results_id_seq; Type: ACL; Schema: geki_data; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE geki_data.ranked_results_id_seq TO api;


--
-- TOC entry 3055 (class 0 OID 0)
-- Dependencies: 210
-- Name: TABLE series; Type: ACL; Schema: geki_data; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE geki_data.series TO api;


--
-- TOC entry 3057 (class 0 OID 0)
-- Dependencies: 211
-- Name: SEQUENCE series_id_seq; Type: ACL; Schema: geki_data; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE geki_data.series_id_seq TO api;


--
-- TOC entry 3058 (class 0 OID 0)
-- Dependencies: 212
-- Name: TABLE submissions; Type: ACL; Schema: geki_data; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE geki_data.submissions TO api;


--
-- TOC entry 3060 (class 0 OID 0)
-- Dependencies: 213
-- Name: SEQUENCE submissions_id_seq; Type: ACL; Schema: geki_data; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE geki_data.submissions_id_seq TO api;


--
-- TOC entry 3061 (class 0 OID 0)
-- Dependencies: 214
-- Name: TABLE team_members; Type: ACL; Schema: geki_data; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE geki_data.team_members TO api;


--
-- TOC entry 3063 (class 0 OID 0)
-- Dependencies: 215
-- Name: SEQUENCE team_members_id_seq; Type: ACL; Schema: geki_data; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE geki_data.team_members_id_seq TO api;


--
-- TOC entry 3064 (class 0 OID 0)
-- Dependencies: 216
-- Name: TABLE events; Type: ACL; Schema: geki_view; Owner: postgres
--

GRANT SELECT ON TABLE geki_view.events TO api;


--
-- TOC entry 3065 (class 0 OID 0)
-- Dependencies: 217
-- Name: TABLE match_statuses; Type: ACL; Schema: geki_view; Owner: postgres
--

GRANT SELECT ON TABLE geki_view.match_statuses TO api;


--
-- TOC entry 3066 (class 0 OID 0)
-- Dependencies: 218
-- Name: TABLE match_types; Type: ACL; Schema: geki_view; Owner: postgres
--

GRANT SELECT ON TABLE geki_view.match_types TO api;


--
-- TOC entry 3067 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE matches; Type: ACL; Schema: geki_view; Owner: postgres
--

GRANT SELECT ON TABLE geki_view.matches TO api;


--
-- TOC entry 3068 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE participants; Type: ACL; Schema: geki_view; Owner: postgres
--

GRANT SELECT ON TABLE geki_view.participants TO api;


--
-- TOC entry 3069 (class 0 OID 0)
-- Dependencies: 221
-- Name: TABLE ranked_results; Type: ACL; Schema: geki_view; Owner: postgres
--

GRANT SELECT ON TABLE geki_view.ranked_results TO api;


--
-- TOC entry 3070 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE series; Type: ACL; Schema: geki_view; Owner: postgres
--

GRANT SELECT ON TABLE geki_view.series TO api;


--
-- TOC entry 3071 (class 0 OID 0)
-- Dependencies: 223
-- Name: TABLE submissions; Type: ACL; Schema: geki_view; Owner: postgres
--

GRANT SELECT ON TABLE geki_view.submissions TO api;


-- Completed on 2019-05-19 11:33:10

--
-- PostgreSQL database dump complete
--

