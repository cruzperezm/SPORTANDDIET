--
-- PostgreSQL database dump
--

\restrict wifOxLUQh3zSAIcvysRisSYKPpOzBZpsqgdgheftopJGg5PAdDzgeLPItyuOKcO

-- Dumped from database version 17.2
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: prisma_migration
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO prisma_migration;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: prisma_migration
--

COMMENT ON SCHEMA public IS '';


--
-- Name: prisma_postgres; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS prisma_postgres WITH SCHEMA public;


--
-- Name: EXTENSION prisma_postgres; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION prisma_postgres IS 'prisma_postgres';


--
-- Name: Allergies; Type: TYPE; Schema: public; Owner: prisma_migration
--

CREATE TYPE public."Allergies" AS ENUM (
    'huevos',
    'gluten',
    'lacteos',
    'crustaceos',
    'pescado',
    'frutos_secos',
    'cacahuete',
    'soja',
    'sesamo'
);


ALTER TYPE public."Allergies" OWNER TO prisma_migration;

--
-- Name: AllergiesIcons; Type: TYPE; Schema: public; Owner: prisma_migration
--

CREATE TYPE public."AllergiesIcons" AS ENUM (
    'egg',
    'bakery_dining',
    'set_meal',
    'local_drink',
    'eco'
);


ALTER TYPE public."AllergiesIcons" OWNER TO prisma_migration;

--
-- Name: FilterExercise; Type: TYPE; Schema: public; Owner: prisma_migration
--

CREATE TYPE public."FilterExercise" AS ENUM (
    'peso_corporal',
    'polea',
    'barra',
    'asistido',
    'pelota_pilates',
    'cuerda',
    'rodillo',
    'maquina_palanca',
    'mancuernas',
    'stationary_bike',
    'eliptica',
    'escaladora',
    'balon_medicinal',
    'banda_elastica'
);


ALTER TYPE public."FilterExercise" OWNER TO prisma_migration;

--
-- Name: Level; Type: TYPE; Schema: public; Owner: prisma_migration
--

CREATE TYPE public."Level" AS ENUM (
    'PRINCIPIANTE',
    'INTERMEDIO',
    'AVANZADOS'
);


ALTER TYPE public."Level" OWNER TO prisma_migration;

--
-- Name: Moment; Type: TYPE; Schema: public; Owner: prisma_migration
--

CREATE TYPE public."Moment" AS ENUM (
    'DESAYUNO',
    'ALMUERZO',
    'CENA'
);


ALTER TYPE public."Moment" OWNER TO prisma_migration;

--
-- Name: MuscleGroups; Type: TYPE; Schema: public; Owner: prisma_migration
--

CREATE TYPE public."MuscleGroups" AS ENUM (
    'Piernas',
    'Cuadriceps',
    'Gemelos',
    'Espalda',
    'Dorsales',
    'Pecho',
    'Pectorales',
    'Gluteos',
    'Abdominales',
    'Cardio',
    'Hombros',
    'Espalda_alta',
    'Biceps',
    'Brazos',
    'Triceps',
    'Aductores',
    'Deltoides',
    'Core',
    'Isquiotibiales',
    'Columna',
    'Cuello',
    'Antebrazos',
    'Trapecios'
);


ALTER TYPE public."MuscleGroups" OWNER TO prisma_migration;

--
-- Name: Unit; Type: TYPE; Schema: public; Owner: prisma_migration
--

CREATE TYPE public."Unit" AS ENUM (
    'kcal',
    'min',
    'hour'
);


ALTER TYPE public."Unit" OWNER TO prisma_migration;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Activity; Type: TABLE; Schema: public; Owner: prisma_migration
--

CREATE TABLE public."Activity" (
    id integer NOT NULL,
    title text NOT NULL,
    duration integer NOT NULL,
    progress integer NOT NULL,
    objective integer NOT NULL,
    unit public."Unit" NOT NULL,
    "dashboardSportId" integer
);


ALTER TABLE public."Activity" OWNER TO prisma_migration;

--
-- Name: Activity_id_seq; Type: SEQUENCE; Schema: public; Owner: prisma_migration
--

CREATE SEQUENCE public."Activity_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Activity_id_seq" OWNER TO prisma_migration;

--
-- Name: Activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prisma_migration
--

ALTER SEQUENCE public."Activity_id_seq" OWNED BY public."Activity".id;


--
-- Name: Biometrics; Type: TABLE; Schema: public; Owner: prisma_migration
--

CREATE TABLE public."Biometrics" (
    id integer NOT NULL,
    "ownerId" integer NOT NULL,
    height integer NOT NULL,
    activity text NOT NULL,
    age integer NOT NULL,
    c_weight integer NOT NULL,
    d_weight integer NOT NULL,
    genre text NOT NULL,
    goal text NOT NULL,
    weeks integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    imc double precision,
    "kcalObjetivo" integer,
    "macroCarbs" integer,
    "macroGrasas" integer,
    "macroProteinas" integer
);


ALTER TABLE public."Biometrics" OWNER TO prisma_migration;

--
-- Name: Biometrics_id_seq; Type: SEQUENCE; Schema: public; Owner: prisma_migration
--

CREATE SEQUENCE public."Biometrics_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Biometrics_id_seq" OWNER TO prisma_migration;

--
-- Name: Biometrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prisma_migration
--

ALTER SEQUENCE public."Biometrics_id_seq" OWNED BY public."Biometrics".id;


--
-- Name: DashboardDiet; Type: TABLE; Schema: public; Owner: prisma_migration
--

CREATE TABLE public."DashboardDiet" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    calories_goal integer DEFAULT 2500 NOT NULL,
    calories_total integer DEFAULT 0 NOT NULL,
    carbs integer DEFAULT 0 NOT NULL,
    fats integer DEFAULT 0 NOT NULL,
    protein integer DEFAULT 0 NOT NULL,
    "userId" integer NOT NULL,
    water integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."DashboardDiet" OWNER TO prisma_migration;

--
-- Name: DashboardDiet_id_seq; Type: SEQUENCE; Schema: public; Owner: prisma_migration
--

CREATE SEQUENCE public."DashboardDiet_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DashboardDiet_id_seq" OWNER TO prisma_migration;

--
-- Name: DashboardDiet_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prisma_migration
--

ALTER SEQUENCE public."DashboardDiet_id_seq" OWNED BY public."DashboardDiet".id;


--
-- Name: DashboardSport; Type: TABLE; Schema: public; Owner: prisma_migration
--

CREATE TABLE public."DashboardSport" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" integer NOT NULL,
    week integer[]
);


ALTER TABLE public."DashboardSport" OWNER TO prisma_migration;

--
-- Name: DashboardSport_id_seq; Type: SEQUENCE; Schema: public; Owner: prisma_migration
--

CREATE SEQUENCE public."DashboardSport_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DashboardSport_id_seq" OWNER TO prisma_migration;

--
-- Name: DashboardSport_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prisma_migration
--

ALTER SEQUENCE public."DashboardSport_id_seq" OWNED BY public."DashboardSport".id;


--
-- Name: Diet; Type: TABLE; Schema: public; Owner: prisma_migration
--

CREATE TABLE public."Diet" (
    id integer NOT NULL,
    title text NOT NULL,
    subtitle text NOT NULL,
    image text NOT NULL
);


ALTER TABLE public."Diet" OWNER TO prisma_migration;

--
-- Name: Diet_id_seq; Type: SEQUENCE; Schema: public; Owner: prisma_migration
--

CREATE SEQUENCE public."Diet_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Diet_id_seq" OWNER TO prisma_migration;

--
-- Name: Diet_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prisma_migration
--

ALTER SEQUENCE public."Diet_id_seq" OWNED BY public."Diet".id;


--
-- Name: Exercise; Type: TABLE; Schema: public; Owner: prisma_migration
--

CREATE TABLE public."Exercise" (
    id integer NOT NULL,
    "exercisePlanId" integer,
    name text NOT NULL,
    image text NOT NULL,
    difficulty text NOT NULL,
    level public."Level" NOT NULL,
    muscles public."MuscleGroups"[],
    gif text NOT NULL,
    stats integer[],
    duration integer NOT NULL,
    filters public."FilterExercise"[],
    "dashboardSportId" integer
);


ALTER TABLE public."Exercise" OWNER TO prisma_migration;

--
-- Name: ExercisePlan; Type: TABLE; Schema: public; Owner: prisma_migration
--

CREATE TABLE public."ExercisePlan" (
    id integer NOT NULL,
    title text NOT NULL,
    subtitle text NOT NULL,
    image text NOT NULL
);


ALTER TABLE public."ExercisePlan" OWNER TO prisma_migration;

--
-- Name: ExercisePlan_id_seq; Type: SEQUENCE; Schema: public; Owner: prisma_migration
--

CREATE SEQUENCE public."ExercisePlan_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ExercisePlan_id_seq" OWNER TO prisma_migration;

--
-- Name: ExercisePlan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prisma_migration
--

ALTER SEQUENCE public."ExercisePlan_id_seq" OWNED BY public."ExercisePlan".id;


--
-- Name: Exercise_id_seq; Type: SEQUENCE; Schema: public; Owner: prisma_migration
--

CREATE SEQUENCE public."Exercise_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Exercise_id_seq" OWNER TO prisma_migration;

--
-- Name: Exercise_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prisma_migration
--

ALTER SEQUENCE public."Exercise_id_seq" OWNED BY public."Exercise".id;


--
-- Name: Recipe; Type: TABLE; Schema: public; Owner: prisma_migration
--

CREATE TABLE public."Recipe" (
    id integer NOT NULL,
    "dietId" integer,
    name text NOT NULL,
    image text NOT NULL,
    duration integer NOT NULL,
    calories integer NOT NULL,
    allergies public."Allergies"[],
    moment public."Moment" NOT NULL,
    instructions text NOT NULL,
    ingredients text[],
    macros text[],
    "dashboardDietId" integer
);


ALTER TABLE public."Recipe" OWNER TO prisma_migration;

--
-- Name: Recipe_id_seq; Type: SEQUENCE; Schema: public; Owner: prisma_migration
--

CREATE SEQUENCE public."Recipe_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Recipe_id_seq" OWNER TO prisma_migration;

--
-- Name: Recipe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prisma_migration
--

ALTER SEQUENCE public."Recipe_id_seq" OWNED BY public."Recipe".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: prisma_migration
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    username text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    password text,
    "googleId" text,
    allergies public."Allergies"[],
    "muscleGroups" text[],
    "photoUrl" text,
    pronouns text
);


ALTER TABLE public."User" OWNER TO prisma_migration;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: prisma_migration
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO prisma_migration;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prisma_migration
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: Activity id; Type: DEFAULT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Activity" ALTER COLUMN id SET DEFAULT nextval('public."Activity_id_seq"'::regclass);


--
-- Name: Biometrics id; Type: DEFAULT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Biometrics" ALTER COLUMN id SET DEFAULT nextval('public."Biometrics_id_seq"'::regclass);


--
-- Name: DashboardDiet id; Type: DEFAULT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."DashboardDiet" ALTER COLUMN id SET DEFAULT nextval('public."DashboardDiet_id_seq"'::regclass);


--
-- Name: DashboardSport id; Type: DEFAULT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."DashboardSport" ALTER COLUMN id SET DEFAULT nextval('public."DashboardSport_id_seq"'::regclass);


--
-- Name: Diet id; Type: DEFAULT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Diet" ALTER COLUMN id SET DEFAULT nextval('public."Diet_id_seq"'::regclass);


--
-- Name: Exercise id; Type: DEFAULT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Exercise" ALTER COLUMN id SET DEFAULT nextval('public."Exercise_id_seq"'::regclass);


--
-- Name: ExercisePlan id; Type: DEFAULT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."ExercisePlan" ALTER COLUMN id SET DEFAULT nextval('public."ExercisePlan_id_seq"'::regclass);


--
-- Name: Recipe id; Type: DEFAULT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Recipe" ALTER COLUMN id SET DEFAULT nextval('public."Recipe_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Activity; Type: TABLE DATA; Schema: public; Owner: prisma_migration
--

COPY public."Activity" (id, title, duration, progress, objective, unit, "dashboardSportId") FROM stdin;
\.


--
-- Data for Name: Biometrics; Type: TABLE DATA; Schema: public; Owner: prisma_migration
--

COPY public."Biometrics" (id, "ownerId", height, activity, age, c_weight, d_weight, genre, goal, weeks, "createdAt", imc, "kcalObjetivo", "macroCarbs", "macroGrasas", "macroProteinas") FROM stdin;
1	1	190	mod	49	94	90	Mujer	dec	3	2026-05-15 17:38:35.942	\N	\N	\N	\N	\N
2	2	165	nev	25	100	85	Femenino	dec	24	2026-05-15 17:39:23.278	36.73	1949	186	54	180
\.


--
-- Data for Name: DashboardDiet; Type: TABLE DATA; Schema: public; Owner: prisma_migration
--

COPY public."DashboardDiet" (id, "createdAt", "updatedAt", calories_goal, calories_total, carbs, fats, protein, "userId", water) FROM stdin;
\.


--
-- Data for Name: DashboardSport; Type: TABLE DATA; Schema: public; Owner: prisma_migration
--

COPY public."DashboardSport" (id, "createdAt", "updatedAt", "userId", week) FROM stdin;
\.


--
-- Data for Name: Diet; Type: TABLE DATA; Schema: public; Owner: prisma_migration
--

COPY public."Diet" (id, title, subtitle, image) FROM stdin;
\.


--
-- Data for Name: Exercise; Type: TABLE DATA; Schema: public; Owner: prisma_migration
--

COPY public."Exercise" (id, "exercisePlanId", name, image, difficulty, level, muscles, gif, stats, duration, filters, "dashboardSportId") FROM stdin;
\.


--
-- Data for Name: ExercisePlan; Type: TABLE DATA; Schema: public; Owner: prisma_migration
--

COPY public."ExercisePlan" (id, title, subtitle, image) FROM stdin;
\.


--
-- Data for Name: Recipe; Type: TABLE DATA; Schema: public; Owner: prisma_migration
--

COPY public."Recipe" (id, "dietId", name, image, duration, calories, allergies, moment, instructions, ingredients, macros, "dashboardDietId") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: prisma_migration
--

COPY public."User" (id, email, username, "createdAt", password, "googleId", allergies, "muscleGroups", "photoUrl", pronouns) FROM stdin;
1	perfil3@gmail.com	perfil3	2026-05-15 17:38:10.701	$2b$10$pGGX1D2v6f/soyvkUtoYFOISM94e1wMYruzPBLiS1eK4uyKVYpIQu	\N	\N	\N	\N	\N
2	intento7@gmail.com	Intento7	2026-05-15 17:39:06.154	$2b$10$J/A5xa5MJeDo/cEUdD9fAePJehi7MMVdGWsEfEwfqPdaVhUBHVa9y	\N	\N	\N	\N	\N
\.


--
-- Name: Activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: prisma_migration
--

SELECT pg_catalog.setval('public."Activity_id_seq"', 1, false);


--
-- Name: Biometrics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: prisma_migration
--

SELECT pg_catalog.setval('public."Biometrics_id_seq"', 2, true);


--
-- Name: DashboardDiet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: prisma_migration
--

SELECT pg_catalog.setval('public."DashboardDiet_id_seq"', 1, false);


--
-- Name: DashboardSport_id_seq; Type: SEQUENCE SET; Schema: public; Owner: prisma_migration
--

SELECT pg_catalog.setval('public."DashboardSport_id_seq"', 1, false);


--
-- Name: Diet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: prisma_migration
--

SELECT pg_catalog.setval('public."Diet_id_seq"', 1, false);


--
-- Name: ExercisePlan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: prisma_migration
--

SELECT pg_catalog.setval('public."ExercisePlan_id_seq"', 1, false);


--
-- Name: Exercise_id_seq; Type: SEQUENCE SET; Schema: public; Owner: prisma_migration
--

SELECT pg_catalog.setval('public."Exercise_id_seq"', 1, false);


--
-- Name: Recipe_id_seq; Type: SEQUENCE SET; Schema: public; Owner: prisma_migration
--

SELECT pg_catalog.setval('public."Recipe_id_seq"', 1, false);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: prisma_migration
--

SELECT pg_catalog.setval('public."User_id_seq"', 2, true);


--
-- Name: Activity Activity_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_pkey" PRIMARY KEY (id);


--
-- Name: Biometrics Biometrics_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Biometrics"
    ADD CONSTRAINT "Biometrics_pkey" PRIMARY KEY (id);


--
-- Name: DashboardDiet DashboardDiet_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."DashboardDiet"
    ADD CONSTRAINT "DashboardDiet_pkey" PRIMARY KEY (id);


--
-- Name: DashboardSport DashboardSport_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."DashboardSport"
    ADD CONSTRAINT "DashboardSport_pkey" PRIMARY KEY (id);


--
-- Name: Diet Diet_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Diet"
    ADD CONSTRAINT "Diet_pkey" PRIMARY KEY (id);


--
-- Name: ExercisePlan ExercisePlan_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."ExercisePlan"
    ADD CONSTRAINT "ExercisePlan_pkey" PRIMARY KEY (id);


--
-- Name: Exercise Exercise_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Exercise"
    ADD CONSTRAINT "Exercise_pkey" PRIMARY KEY (id);


--
-- Name: Recipe Recipe_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Recipe"
    ADD CONSTRAINT "Recipe_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Biometrics_ownerId_key; Type: INDEX; Schema: public; Owner: prisma_migration
--

CREATE UNIQUE INDEX "Biometrics_ownerId_key" ON public."Biometrics" USING btree ("ownerId");


--
-- Name: DashboardDiet_userId_key; Type: INDEX; Schema: public; Owner: prisma_migration
--

CREATE UNIQUE INDEX "DashboardDiet_userId_key" ON public."DashboardDiet" USING btree ("userId");


--
-- Name: DashboardSport_userId_key; Type: INDEX; Schema: public; Owner: prisma_migration
--

CREATE UNIQUE INDEX "DashboardSport_userId_key" ON public."DashboardSport" USING btree ("userId");


--
-- Name: Diet_title_key; Type: INDEX; Schema: public; Owner: prisma_migration
--

CREATE UNIQUE INDEX "Diet_title_key" ON public."Diet" USING btree (title);


--
-- Name: ExercisePlan_title_key; Type: INDEX; Schema: public; Owner: prisma_migration
--

CREATE UNIQUE INDEX "ExercisePlan_title_key" ON public."ExercisePlan" USING btree (title);


--
-- Name: Exercise_name_key; Type: INDEX; Schema: public; Owner: prisma_migration
--

CREATE UNIQUE INDEX "Exercise_name_key" ON public."Exercise" USING btree (name);


--
-- Name: Recipe_name_key; Type: INDEX; Schema: public; Owner: prisma_migration
--

CREATE UNIQUE INDEX "Recipe_name_key" ON public."Recipe" USING btree (name);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: prisma_migration
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_googleId_key; Type: INDEX; Schema: public; Owner: prisma_migration
--

CREATE UNIQUE INDEX "User_googleId_key" ON public."User" USING btree ("googleId");


--
-- Name: Activity Activity_dashboardSportId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_dashboardSportId_fkey" FOREIGN KEY ("dashboardSportId") REFERENCES public."DashboardSport"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Biometrics Biometrics_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Biometrics"
    ADD CONSTRAINT "Biometrics_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DashboardDiet DashboardDiet_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."DashboardDiet"
    ADD CONSTRAINT "DashboardDiet_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DashboardSport DashboardSport_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."DashboardSport"
    ADD CONSTRAINT "DashboardSport_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Exercise Exercise_dashboardSportId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Exercise"
    ADD CONSTRAINT "Exercise_dashboardSportId_fkey" FOREIGN KEY ("dashboardSportId") REFERENCES public."DashboardSport"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Exercise Exercise_exercisePlanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Exercise"
    ADD CONSTRAINT "Exercise_exercisePlanId_fkey" FOREIGN KEY ("exercisePlanId") REFERENCES public."ExercisePlan"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Recipe Recipe_dashboardDietId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Recipe"
    ADD CONSTRAINT "Recipe_dashboardDietId_fkey" FOREIGN KEY ("dashboardDietId") REFERENCES public."DashboardDiet"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Recipe Recipe_dietId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma_migration
--

ALTER TABLE ONLY public."Recipe"
    ADD CONSTRAINT "Recipe_dietId_fkey" FOREIGN KEY ("dietId") REFERENCES public."Diet"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: prisma_migration
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict wifOxLUQh3zSAIcvysRisSYKPpOzBZpsqgdgheftopJGg5PAdDzgeLPItyuOKcO

