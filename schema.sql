--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

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
-- Name: Priority; Type: TYPE; Schema: public; Owner: tatsu
--

CREATE TYPE public."Priority" AS ENUM (
    'Low',
    'Medium',
    'High'
);


ALTER TYPE public."Priority" OWNER TO tatsu;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: tatsu
--

CREATE TABLE public."Account" (
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Account" OWNER TO tatsu;

--
-- Name: File; Type: TABLE; Schema: public; Owner: tatsu
--

CREATE TABLE public."File" (
    id text NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userID" text NOT NULL,
    size integer NOT NULL,
    "s3Key" text NOT NULL
);


ALTER TABLE public."File" OWNER TO tatsu;

--
-- Name: Note; Type: TABLE; Schema: public; Owner: tatsu
--

CREATE TABLE public."Note" (
    id text NOT NULL,
    name text NOT NULL,
    content text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userID" text NOT NULL
);


ALTER TABLE public."Note" OWNER TO tatsu;

--
-- Name: Todo; Type: TABLE; Schema: public; Owner: tatsu
--

CREATE TABLE public."Todo" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userID" text NOT NULL,
    pinned boolean DEFAULT false NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "order" integer NOT NULL,
    priority public."Priority" DEFAULT 'Low'::public."Priority" NOT NULL,
    "expiresAt" timestamp(3) without time zone DEFAULT ((date_trunc('day'::text, CURRENT_TIMESTAMP) + '23:00:00'::interval) + '00:59:00'::interval) NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Todo" OWNER TO tatsu;

--
-- Name: Todo_order_seq; Type: SEQUENCE; Schema: public; Owner: tatsu
--

CREATE SEQUENCE public."Todo_order_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Todo_order_seq" OWNER TO tatsu;

--
-- Name: Todo_order_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tatsu
--

ALTER SEQUENCE public."Todo_order_seq" OWNED BY public."Todo"."order";


--
-- Name: User; Type: TABLE; Schema: public; Owner: tatsu
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    "emailVerified" timestamp(3) without time zone,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    password text,
    name text,
    "maxStorage" numeric(65,30) DEFAULT 1000000.0 NOT NULL,
    "usedStoraged" numeric(65,30) DEFAULT 0.0 NOT NULL,
    "enableEncryption" boolean DEFAULT true NOT NULL,
    "protectedSymmetricKey" text
);


ALTER TABLE public."User" OWNER TO tatsu;

--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: tatsu
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO tatsu;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: tatsu
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO tatsu;

--
-- Name: Todo order; Type: DEFAULT; Schema: public; Owner: tatsu
--

ALTER TABLE ONLY public."Todo" ALTER COLUMN "order" SET DEFAULT nextval('public."Todo_order_seq"'::regclass);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: tatsu
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (provider, "providerAccountId");


--
-- Name: File File_pkey; Type: CONSTRAINT; Schema: public; Owner: tatsu
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_pkey" PRIMARY KEY (id);


--
-- Name: Note Note_pkey; Type: CONSTRAINT; Schema: public; Owner: tatsu
--

ALTER TABLE ONLY public."Note"
    ADD CONSTRAINT "Note_pkey" PRIMARY KEY (id);


--
-- Name: Todo Todo_pkey; Type: CONSTRAINT; Schema: public; Owner: tatsu
--

ALTER TABLE ONLY public."Todo"
    ADD CONSTRAINT "Todo_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: tatsu
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VerificationToken VerificationToken_pkey; Type: CONSTRAINT; Schema: public; Owner: tatsu
--

ALTER TABLE ONLY public."VerificationToken"
    ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY (identifier, token);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: tatsu
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: tatsu
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tatsu
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: File File_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tatsu
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Note Note_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tatsu
--

ALTER TABLE ONLY public."Note"
    ADD CONSTRAINT "Note_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Todo Todo_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tatsu
--

ALTER TABLE ONLY public."Todo"
    ADD CONSTRAINT "Todo_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

