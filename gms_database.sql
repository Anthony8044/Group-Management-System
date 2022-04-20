--
-- PostgreSQL database dump
--

-- Dumped from database version 12.9 (Ubuntu 12.9-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.9 (Ubuntu 12.9-0ubuntu0.20.04.1)

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
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: allgroup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.allgroup (
    group_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    project_id_fk uuid NOT NULL,
    course_id_fk character varying(255) NOT NULL,
    group_num smallint NOT NULL,
    students_array text[],
    group_status character varying(255) DEFAULT 'Not Full'::character varying,
    submission_status character varying(255) DEFAULT 'Not Submitted'::character varying
);


ALTER TABLE public.allgroup OWNER TO postgres;

--
-- Name: alluser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alluser (
    user_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    given_name character varying(255) NOT NULL,
    family_name character varying(255) NOT NULL,
    gender character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    profile_img character varying(255)
);


ALTER TABLE public.alluser OWNER TO postgres;

--
-- Name: course; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course (
    course_id character varying(255) NOT NULL,
    course_title character varying(255) NOT NULL,
    instructor_id_fk uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    course_code character varying(255)
);


ALTER TABLE public.course OWNER TO postgres;

--
-- Name: group_record; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.group_record AS
 SELECT allgroup.group_id,
    allgroup.project_id_fk,
    allgroup.course_id_fk,
    allgroup.group_num,
    allgroup.students_array,
    allgroup.group_status,
    allgroup.submission_status,
    ( SELECT sum(
                CASE dt.b
                    WHEN 'empty'::text THEN 0
                    ELSE 1
                END) AS sum
           FROM unnest(allgroup.students_array) dt(b)) AS trues
   FROM public.allgroup;


ALTER TABLE public.group_record OWNER TO postgres;

--
-- Name: project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project (
    project_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    course_code character varying(255) NOT NULL,
    project_title character varying(255) NOT NULL,
    group_submission_date character varying(255) NOT NULL,
    project_submission_date character varying(255) NOT NULL,
    group_min character varying(255) NOT NULL,
    group_max character varying(255) NOT NULL,
    project_status character varying(255) NOT NULL,
    formation_type character varying(255) NOT NULL,
    project_description character varying(255),
    instructor_id_fk uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    send_notification boolean DEFAULT false
);


ALTER TABLE public.project OWNER TO postgres;

--
-- Name: user_course; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_course (
    user_id uuid NOT NULL,
    course_id character varying(255) NOT NULL
);


ALTER TABLE public.user_course OWNER TO postgres;

--
-- Name: course_record; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.course_record AS
 SELECT course.course_id,
    course.course_code,
    course.course_title,
    course.instructor_id_fk,
    course.created_at,
    p.course_count,
    a.project_count,
    b.students_joined
   FROM (((public.course
     LEFT JOIN ( SELECT user_course.course_id,
            count(*) AS course_count
           FROM public.user_course
          GROUP BY user_course.course_id) p USING (course_id))
     LEFT JOIN ( SELECT project.course_code,
            count(*) AS project_count
           FROM public.project
          GROUP BY project.course_code) a USING (course_code))
     LEFT JOIN ( SELECT group_record.course_id_fk AS course_id,
            sum(group_record.trues) AS students_joined
           FROM public.group_record
          GROUP BY group_record.course_id_fk) b USING (course_id));


ALTER TABLE public.course_record OWNER TO postgres;

--
-- Name: group_student_record; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.group_student_record AS
 SELECT allgroup.group_id,
    allgroup.project_id_fk,
    allgroup.course_id_fk,
    allgroup.group_num,
    allgroup.students_array,
    allgroup.group_status,
    allgroup.submission_status,
    student.student,
    student.ordinality
   FROM public.allgroup,
    LATERAL unnest(allgroup.students_array) WITH ORDINALITY student(student, ordinality);


ALTER TABLE public.group_student_record OWNER TO postgres;

--
-- Name: invite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invite (
    invite_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    sender_id_fk uuid NOT NULL,
    recipient_id_fk uuid NOT NULL,
    invite_status character varying(255) NOT NULL,
    section_id_fk character varying(255) NOT NULL,
    project_id_fk uuid NOT NULL,
    group_id_fk uuid NOT NULL,
    group_num smallint NOT NULL,
    group_position smallint NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.invite OWNER TO postgres;

--
-- Name: student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student (
    student_id character varying(255) NOT NULL,
    user_id_fk uuid NOT NULL,
    study_program character varying(255) NOT NULL,
    study_year character varying(255) NOT NULL,
    strenghts character varying(255),
    weeknesses character varying(255),
    description character varying(255),
    personality_type character varying(255),
    notification_email boolean DEFAULT true
);


ALTER TABLE public.student OWNER TO postgres;

--
-- Name: student_course; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.student_course AS
 SELECT alluser.user_id,
    user_course.course_id,
    student.student_id,
    alluser.given_name,
    alluser.family_name,
    alluser.email,
    student.study_program,
    student.study_year
   FROM public.alluser,
    public.student,
    public.user_course
  WHERE ((alluser.user_id = user_course.user_id) AND (alluser.user_id = student.user_id_fk));


ALTER TABLE public.student_course OWNER TO postgres;

--
-- Name: teacher; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher (
    teacher_id character varying(255) NOT NULL,
    user_id_fk uuid NOT NULL,
    department character varying(255) NOT NULL,
    postition character varying(255) NOT NULL,
    description character varying(255),
    notification_email boolean DEFAULT true
);


ALTER TABLE public.teacher OWNER TO postgres;

--
-- Data for Name: allgroup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.allgroup (group_id, project_id_fk, course_id_fk, group_num, students_array, group_status, submission_status) FROM stdin;
932e8c53-dcea-4da8-af49-ca95b8f6de8d	2f271d84-181d-4aa9-b66b-08cd22ac78a3	COMP1002-1	1	{empty,empty,empty}	Not Full	Not Submitted
dc351c1e-1b77-42f2-8c82-36c3f2b94230	2f271d84-181d-4aa9-b66b-08cd22ac78a3	COMP1002-1	2	{empty,empty,empty}	Not Full	Not Submitted
943cb6bf-c848-420d-b50d-25c57aaf33b3	2f271d84-181d-4aa9-b66b-08cd22ac78a3	COMP1002-1	3	{empty,empty,empty}	Not Full	Not Submitted
ccaf0a38-2206-4f3c-b7e9-11dbb59d8e60	598efdf2-3640-47c7-93d4-250de6b641ea	COMP1001-1	1	{3c471704-d9db-4af7-bf21-4e1d3b1f99dd,254912ce-627d-46c7-8f18-1bc0faafcd4e,a65e5bde-dc5b-46c2-9394-c95acc0d8e75}	Full	Not Submitted
2c31d0ac-de5c-4dd6-bb2b-1426e24669f1	598efdf2-3640-47c7-93d4-250de6b641ea	COMP1001-1	2	{aa578a7f-4071-4144-a137-3a07dc55f994,8e23ac37-166e-462a-84f6-fc6a4d553df0,62206e72-a96d-4748-b143-7c07a9c4b58f}	Full	Not Submitted
52b7ec92-19aa-4dea-a308-ba6263a98cda	598efdf2-3640-47c7-93d4-250de6b641ea	COMP1001-2	1	{e7927d56-c582-4966-a784-e58d78d93935,68ad29b0-7cf8-4fd8-aff1-37a9ee423efd,6618c6b9-b2fe-4948-a6b4-d54e08b7d827}	Full	Not Submitted
6ffacb59-6409-4c23-9b60-9c5e980bd444	598efdf2-3640-47c7-93d4-250de6b641ea	COMP1001-2	2	{56c4b1eb-0ee4-445c-bd9f-3147aabc42de,aecce459-ab59-4aca-b38e-15282a3ee81c,da13fa0c-76b9-4f7d-a4df-2e8e2a8fdcc1}	Full	Not Submitted
0d203812-ba52-4d82-a69a-aae390a932c3	598efdf2-3640-47c7-93d4-250de6b641ea	COMP1001-3	1	{d546cc86-39c3-44bd-b48c-3265c5b99df8,ba9ed5d0-4668-43eb-a6ef-2cfca67f9459,0486e3ab-008b-4bbd-91bc-880d1f105e15}	Full	Not Submitted
9cadf675-f7c9-4684-b2d7-23e999719a7a	598efdf2-3640-47c7-93d4-250de6b641ea	COMP1001-3	2	{34302cf6-a23f-428a-bce5-aa8c00d612c8,d775f255-951f-46b5-9a0c-ce8aa446b80d}	Full	Not Submitted
9bf640a6-4450-45e4-9b81-c996d135d8db	65dfc956-f407-4288-8daa-c9efc9c538de	COMP1001-1	3	{aa578a7f-4071-4144-a137-3a07dc55f994,empty,empty}	Not Full	Not Submitted
145696eb-2000-4794-b6de-820bf9a63272	598efdf2-3640-47c7-93d4-250de6b641ea	COMP1001-1	4	{7656fc76-544a-4bb1-bf87-e7dd990b7f16,bc2dca9d-3ddf-453d-a7dd-9aca5cb737ae,e4a1744f-4cc8-42bb-8570-3357c45bee1a}	Full	Not Submitted
6e4c834b-87a6-43bb-899b-81fb9cc9d380	14b28982-9d67-49c1-ad46-cbe90d557f8b	COMP1005-1	1	{7656fc76-544a-4bb1-bf87-e7dd990b7f16,8e23ac37-166e-462a-84f6-fc6a4d553df0,3c471704-d9db-4af7-bf21-4e1d3b1f99dd}	Full	Not Submitted
7ab7706d-98d7-428c-801a-c3feca6cfaf4	14b28982-9d67-49c1-ad46-cbe90d557f8b	COMP1005-1	2	{d2e4ce64-5fd2-40e4-b4f5-066bc050a906,254912ce-627d-46c7-8f18-1bc0faafcd4e,e4a1744f-4cc8-42bb-8570-3357c45bee1a}	Full	Not Submitted
822f3d60-4853-4ee9-806b-a34c0970014f	65dfc956-f407-4288-8daa-c9efc9c538de	COMP1001-1	2	{9aa19ada-5468-4502-9e50-728dded8935c,empty,empty}	Not Full	Not Submitted
0d29cf5b-3dae-4ed9-a598-654f683081c3	598efdf2-3640-47c7-93d4-250de6b641ea	COMP1001-1	3	{729488b2-d4b5-42e5-bc30-a91cfabd0e32,d2e4ce64-5fd2-40e4-b4f5-066bc050a906,empty}	Not Full	Not Submitted
42e7d951-e479-41ec-91a8-8744bbd8c7b3	65dfc956-f407-4288-8daa-c9efc9c538de	COMP1001-1	1	{empty,empty,empty}	Not Full	Not Submitted
c246fe28-255d-4df8-bd62-48013c3ef82d	65dfc956-f407-4288-8daa-c9efc9c538de	COMP1001-1	5	{e4a1744f-4cc8-42bb-8570-3357c45bee1a,bc2dca9d-3ddf-453d-a7dd-9aca5cb737ae,empty}	Not Full	Not Submitted
f6ae15a5-082a-40b4-8c49-2bf6d63f86d3	65dfc956-f407-4288-8daa-c9efc9c538de	COMP1001-1	4	{empty,empty,empty}	Not Full	Not Submitted
c28e5590-35cc-44c8-84de-00a3e367921e	65dfc956-f407-4288-8daa-c9efc9c538de	COMP1001-1	6	{empty,empty,empty}	Not Full	Not Submitted
58d8c789-5320-443f-8d1e-b361ff6f6d96	65dfc956-f407-4288-8daa-c9efc9c538de	COMP1001-2	1	{empty,empty,empty}	Not Full	Not Submitted
4a52d371-a12f-47c7-a863-a3c899337558	65dfc956-f407-4288-8daa-c9efc9c538de	COMP1001-2	2	{empty,empty,empty}	Not Full	Not Submitted
ad5e4e35-2dd9-4b31-a186-aa25a32e4c1e	65dfc956-f407-4288-8daa-c9efc9c538de	COMP1001-2	3	{empty,empty,empty}	Not Full	Not Submitted
0f87e3e5-ea71-4c80-9fe6-88c36ba9449a	65dfc956-f407-4288-8daa-c9efc9c538de	COMP1001-3	1	{empty,empty,empty}	Not Full	Not Submitted
1ac16d4a-f3f6-497b-b108-3b26f4605fda	65dfc956-f407-4288-8daa-c9efc9c538de	COMP1001-3	2	{empty,empty,empty}	Not Full	Not Submitted
42bedc08-d963-4148-a718-8daf36f9834b	65dfc956-f407-4288-8daa-c9efc9c538de	COMP1001-3	3	{empty,empty,empty}	Not Full	Not Submitted
\.


--
-- Data for Name: alluser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alluser (user_id, given_name, family_name, gender, role, email, password, created_at, profile_img) FROM stdin;
e4a1744f-4cc8-42bb-8570-3357c45bee1a	Daniel	Mac	Male	Student	daniel@tempmail.com	$2a$12$CGCl0BOX80PCW1giAbKcUOZQnip1MGnFGsMNBgHy1exzsp17MK2cG	2022-03-18 01:16:34.807261	/images/3.svg
d5b6b065-3c36-40e4-8210-a0d8393848be	Mathew	Chau	Male	Teacher	matthew@tempmail.com	$2a$12$7dea33H0L5cZjLxScIju8eN4hEb5TFI.YTBWKZNCzS.tBfKuu6WLi	2022-02-06 20:49:56.227525	/images/9.svg
254912ce-627d-46c7-8f18-1bc0faafcd4e	Dave	Chow	Male	Student	dave@tempmail.com	$2a$12$Ck88q3/.kmR1bh3ExQ/3NekP.xGxb5FVS0LIuDhNj5iFi8iThbIb.	2022-04-05 13:52:22.204887	/images/2.svg
7656fc76-544a-4bb1-bf87-e7dd990b7f16	Emily	Lau	Female	Student	emily@tempmail.com	$2a$12$skAR/F2qCvS95utNGQ3xpeOtI1fB9nUaTNVPds1cefSZpDK2n0YQ2	2022-04-05 13:51:22.599453	/images/1.svg
8e23ac37-166e-462a-84f6-fc6a4d553df0	Tony	Lau	Male	Student	tony@tempmail.com	$2a$12$a00Bpn3TbkAzY7A2a0Ccv.Kt3O1OkYH..REoMQ5z20ZTqnktMHYp6	2022-04-05 13:50:48.604451	/images/3.svg
d2e4ce64-5fd2-40e4-b4f5-066bc050a906	Amy	Chan	Female	Student	amy@tempmail.com	$2a$12$9vP3g7BP.4cBQoae1Xl9muVWHV.kI5ywcFx3aGyfDlPX7ZOUCDGeC	2022-04-05 13:49:38.380737	/images/7.svg
3c471704-d9db-4af7-bf21-4e1d3b1f99dd	Max	Lam	Male	Student	max@tempmail.com	$2a$12$jMsqXEoJhlMFYPuAgA7XZOZieuavPHOrH5leEpq2Aoi8SwB2wak.y	2022-04-05 13:48:42.485658	/images/4.svg
729488b2-d4b5-42e5-bc30-a91cfabd0e32	Alice	Lee	Female	Student	alice@tempmail.com	$2a$12$LZhBb2fyIyyezqWmzLtD1.rOFg43GBCPo59Ym9KBxZNAFR2aaYV5e	2022-04-05 13:47:20.601514	/images/8.svg
a65e5bde-dc5b-46c2-9394-c95acc0d8e75	Tim	Cook	Male	Student	tims@tempmail.com	$2a$12$wM8Tg/pYX3EwkUW25Yj7Pepa.G1PHdO43FhFzhD1/mZslk5X.2/4O	2022-04-05 13:46:11.33286	/images/5.svg
9aa19ada-5468-4502-9e50-728dded8935c	Mike	Simmons	Male	Student	mike@tempmail.com	$2a$12$91j0ORh25EfAewzAKbBUKe2k0YluaTBkGL3dvg2sZI2LVAdxyOKGG	2022-03-18 01:15:57.772133	/images/4.svg
62206e72-a96d-4748-b143-7c07a9c4b58f	Rachel	Law	Female	Student	rachel@tempmail.com	$2a$12$tfnNHeRQOBTfnVvVfrOFuuV9TfFUpaFxNcgogCA93mC/1rUMItg1q	2022-04-05 13:45:22.5641	/images/10.svg
aecce459-ab59-4aca-b38e-15282a3ee81c	Larry	Chow	Male	Student	larry@tempmail.com	$2a$12$crMKXJIzfRxQbmvP.xbZhuQyulpLdeUNpnhPaHuegDDKx2.ahXGJ6	2022-04-05 13:44:02.214242	/images/6.svg
56c4b1eb-0ee4-445c-bd9f-3147aabc42de	Carry	Chan	Female	Student	carry@tempmail.com	$2a$12$f0SexoV7OR1QEuaB/RxTCOWqvRYLcwQkyGMUiMK9WMnBluo2Tq.2m	2022-04-05 13:41:34.48574	/images/1.svg
dc407461-c49f-43a7-ade1-adfcf7bef79e	Doug	Peterson	Male	Student	doug@tempmail.com	$2a$12$tSn/FJFR8o1ku94PyJbY7e7vHwlazeObGT3cgEcKJqMdajseqsdBS	2022-04-05 13:35:37.944671	/images/9.svg
da13fa0c-76b9-4f7d-a4df-2e8e2a8fdcc1	Fiona	Jones	Female	Student	fiona@tempmail.com	$2a$12$pg2XIRq9FG1xPrAuEYYJ0eQbDGlpfqiwCIuoU.B8W95yVwF3EbBxu	2022-03-18 01:13:43.919661	/images/7.svg
e7927d56-c582-4966-a784-e58d78d93935	Jack	Chau	Male	Student	jack@tempmail.com	$2a$12$XtPTCoELoXVpsCBgVmT3oOIvQPfYpp5lhW3RRjc80FPpZ1ZkW8fxe	2022-02-25 17:01:53.024482	/images/5.svg
6618c6b9-b2fe-4948-a6b4-d54e08b7d827	Simon	Lee	Male	Student	simon@tempmail.com	$2a$12$FQYn58deSjROED1cTxX/t.gVapTwYHn1sIyENoT8rP/rtv5OGXbJm	2022-02-25 16:45:56.425608	/images/6.svg
68ad29b0-7cf8-4fd8-aff1-37a9ee423efd	Jacky	Chan	Male	Student	jacky@tempmail.com	$2a$12$3wYoNBmvfMEHpqotP074luIDXYC/7Ia6MHP6Nslc1rPKJHBqGIZC.	2022-02-25 16:45:28.267407	/images/9.svg
d546cc86-39c3-44bd-b48c-3265c5b99df8	Harry	Millar	Male	Student	harry@tempmail.com	$2a$12$bCwC42yO9waJmy536lNNxe92KTLLszw4c5534olPB5y.Tfbdxnwe6	2022-02-25 16:44:45.507704	/images/2.svg
d775f255-951f-46b5-9a0c-ce8aa446b80d	Tom	Smith	Male	Student	tom@tempmail.com	$2a$12$Akoxvlpo8fGy07skAyXtpOg3x8OGzyNMRz6B6aTeALbcgVNRBnTxu	2022-02-16 20:39:34.897334	/images/3.svg
ba9ed5d0-4668-43eb-a6ef-2cfca67f9459	Bethany	Tan	Female	Student	bethany@tempmail.com	$2a$12$rbFxT6PWaZoL.LpJ5eixNuIN2deLinHHocAX1aLcglvjNeKCU.dRa	2022-02-16 17:13:17.695729	/images/8.svg
34302cf6-a23f-428a-bce5-aa8c00d612c8	Sarah	Lee	Female	Student	Sarah@tempmail.com	$2a$12$XtPTCoELoXVpsCBgVmT3oOIvQPfYpp5lhW3RRjc80FPpZ1ZkW8fxe	2022-02-09 17:34:35.0204	/images/10.svg
0486e3ab-008b-4bbd-91bc-880d1f105e15	Steven	Park	Male	Student	steven@tempmail.com	$2a$12$XtPTCoELoXVpsCBgVmT3oOIvQPfYpp5lhW3RRjc80FPpZ1ZkW8fxe	2022-02-09 17:33:57.003421	/images/4.svg
ab92bd6f-60eb-4a2c-8bd1-aabe11f38d4a	Ruth	Lee	Female	Teacher	ruth@tempmail.com	$2a$12$U9yQ1/AjWNTvLrCaN0xn/uAbekV/XfF3qfSNO7rRs3EmPSq/g3agm	2022-02-16 17:11:47.053697	/images/1.svg
aa578a7f-4071-4144-a137-3a07dc55f994	Paul	Cook	Male	Student	paul@tempmail.com	$2a$12$n7eXCplmiLFgux0KmYpdmu4wkcjmUmHaqqhR6Y3mLzRUZO.SPQ39S	2022-03-30 00:24:10.386405	/images/5.svg
bc2dca9d-3ddf-453d-a7dd-9aca5cb737ae	Anthony	Stoltzfus	Male	Student	anthonystoltzfus@gmail.com	$2a$12$/unloWp9JV6wU/w0RY/hNO2i2txgAFq23L7NR154U5Ghw57i3fxTm	2022-04-06 15:42:34.841588	/images/6.svg
b63b9801-de45-4c34-b5ac-bed8c231cbc3	Timmothy	Lee	Male	Teacher	timmothy@gmail.com	$2a$12$7rwEa.fFwcz9SWGYnjQp1OoezTEWAWa7FE.kw2pumeEHlLLGhhN2W	2022-04-06 15:45:47.884625	/images/2.svg
\.


--
-- Data for Name: course; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course (course_id, course_title, instructor_id_fk, created_at, course_code) FROM stdin;
COMP1005-1	Computer Graphics	d5b6b065-3c36-40e4-8210-a0d8393848be	2022-04-12 15:32:23.861918	COMP1005
COMP1005-2	Computer Graphics	d5b6b065-3c36-40e4-8210-a0d8393848be	2022-04-12 15:32:23.863636	COMP1005
COMP1001-1	Introduction to Computer Science	d5b6b065-3c36-40e4-8210-a0d8393848be	2022-04-05 17:00:46.01013	COMP1001
COMP1001-2	Introduction to Computer Science	d5b6b065-3c36-40e4-8210-a0d8393848be	2022-04-05 17:00:46.012219	COMP1001
COMP1001-3	Introduction to Computer Science	d5b6b065-3c36-40e4-8210-a0d8393848be	2022-04-05 17:00:46.012719	COMP1001
COMP1025-1	Data Analysis	d5b6b065-3c36-40e4-8210-a0d8393848be	2022-04-05 17:01:23.092857	COMP1025
COMP1025-2	Data Analysis	d5b6b065-3c36-40e4-8210-a0d8393848be	2022-04-05 17:01:23.094282	COMP1025
COMP2004-1	Computer Algorithms	d5b6b065-3c36-40e4-8210-a0d8393848be	2022-04-05 17:02:30.863205	COMP2004
COMP2004-2	Computer Algorithms	d5b6b065-3c36-40e4-8210-a0d8393848be	2022-04-05 17:02:30.864657	COMP2004
COMP1002-1	Computer Networking	b63b9801-de45-4c34-b5ac-bed8c231cbc3	2022-04-06 15:47:03.642951	COMP1002
COMP1002-2	Computer Networking	b63b9801-de45-4c34-b5ac-bed8c231cbc3	2022-04-06 15:47:03.644461	COMP1002
COMP1002-3	Computer Networking	b63b9801-de45-4c34-b5ac-bed8c231cbc3	2022-04-06 15:47:03.64528	COMP1002
\.


--
-- Data for Name: invite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invite (invite_id, sender_id_fk, recipient_id_fk, invite_status, section_id_fk, project_id_fk, group_id_fk, group_num, group_position, created_at) FROM stdin;
846d6052-dff8-490c-a44f-862c5a6f5d7d	bc2dca9d-3ddf-453d-a7dd-9aca5cb737ae	aa578a7f-4071-4144-a137-3a07dc55f994	Pending	COMP1001-1	65dfc956-f407-4288-8daa-c9efc9c538de	42e7d951-e479-41ec-91a8-8744bbd8c7b3	1	2	2022-04-06 15:58:28.576599
b1ed3dfb-f024-4311-aa14-ffc6c1390543	aa578a7f-4071-4144-a137-3a07dc55f994	bc2dca9d-3ddf-453d-a7dd-9aca5cb737ae	Pending	COMP1001-1	65dfc956-f407-4288-8daa-c9efc9c538de	9bf640a6-4450-45e4-9b81-c996d135d8db	3	2	2022-04-12 15:04:42.989546
5602dd3c-7ebb-4c2b-a11d-9d56cc642754	bc2dca9d-3ddf-453d-a7dd-9aca5cb737ae	3c471704-d9db-4af7-bf21-4e1d3b1f99dd	Pending	COMP1001-1	65dfc956-f407-4288-8daa-c9efc9c538de	42e7d951-e479-41ec-91a8-8744bbd8c7b3	1	2	2022-04-12 15:49:07.046568
40f4371d-6512-4950-8c57-29fe88bfed83	bc2dca9d-3ddf-453d-a7dd-9aca5cb737ae	9aa19ada-5468-4502-9e50-728dded8935c	Pending	COMP1001-1	65dfc956-f407-4288-8daa-c9efc9c538de	42e7d951-e479-41ec-91a8-8744bbd8c7b3	1	2	2022-04-12 15:49:15.479108
\.


--
-- Data for Name: project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project (project_id, course_code, project_title, group_submission_date, project_submission_date, group_min, group_max, project_status, formation_type, project_description, instructor_id_fk, created_at, send_notification) FROM stdin;
65dfc956-f407-4288-8daa-c9efc9c538de	COMP1001	Mini Project 1	2022-04-13T17:13:34+08:00	2022-04-22T17:13:34+08:00	2	3	Find Groups	default	Create a simple application using Java. This application must be made with java.	d5b6b065-3c36-40e4-8210-a0d8393848be	2022-04-05 17:14:53.639325	f
2f271d84-181d-4aa9-b66b-08cd22ac78a3	COMP1002	Project 1	2022-04-09T15:25:41+08:00	2022-04-06T15:48:41+08:00	2	3	Find Groups	default	This is the description for project 1	b63b9801-de45-4c34-b5ac-bed8c231cbc3	2022-04-06 15:51:06.465479	t
598efdf2-3640-47c7-93d4-250de6b641ea	COMP1001	Project 2	2022-04-09T15:57:48+08:00	2022-04-09T15:58:48+08:00	3	3	Find Groups	random	This is the description	d5b6b065-3c36-40e4-8210-a0d8393848be	2022-04-06 15:55:01.573054	t
14b28982-9d67-49c1-ad46-cbe90d557f8b	COMP1005	Project 1	2022-04-12T15:33:17+08:00	2022-04-12T15:33:17+08:00	3	3	Find Groups	random	This is the description of project 1	d5b6b065-3c36-40e4-8210-a0d8393848be	2022-04-12 15:34:12.301187	t
\.


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student (student_id, user_id_fk, study_program, study_year, strenghts, weeknesses, description, personality_type, notification_email) FROM stdin;
17456783	56c4b1eb-0ee4-445c-bd9f-3147aabc42de	Computer Science	2018/2019	Team player, resourceful, planning, patience 	Passive, communication, public speaking	\N	S-Steady	t
18456782	aecce459-ab59-4aca-b38e-15282a3ee81c	Math	2019/2020	Drawing, graphic design, thinking creatively	Multitasking, too detail-oriented, public speaking	\N	C-Cautious	t
18455782	62206e72-a96d-4748-b143-7c07a9c4b58f	Science	2019/2020	Public Speaking, fast learner, leadership, coding, hardworking	Impatient, Work life balance	\N	D-Dominate	t
17455782	a65e5bde-dc5b-46c2-9394-c95acc0d8e75	Computer Science	2018/2019	Writing skills, creative, flexible, communication	Disorganized, procrastination	\N	I-Influencing	t
17450482	729488b2-d4b5-42e5-bc30-a91cfabd0e32	Computer Science	2018/2019	Team player, resourceful, planning, patience	Passive, communication, public speaking	\N	S-Steady	t
18248634	3c471704-d9db-4af7-bf21-4e1d3b1f99dd	Computer Science	2019/2020	Drawing, graphic design, thinking creatively	Multitasking, too detail-oriented, public speaking	\N	C-Cautious	t
18244563	d2e4ce64-5fd2-40e4-b4f5-066bc050a906	Science	2019/2020	Public Speaking, fast learner, leadership, coding, hardworking	Impatient, Work life balance	\N	D-Dominate	t
18244343	8e23ac37-166e-462a-84f6-fc6a4d553df0	Science	2019/2020	Writing skills, creative, flexible, communication	Disorganized, procrastination	\N	I-Influencing	t
18244349	7656fc76-544a-4bb1-bf87-e7dd990b7f16	Science	2019/2020	Team player, resourceful, planning, patience	Passive, communication, public speaking	\N	S-Steady	t
18234349	254912ce-627d-46c7-8f18-1bc0faafcd4e	Computer Science	2019/2020	Drawing, graphic design, thinking creatively	Multitasking, too detail-oriented, public speaking	\N	C-Cautious	t
18208567	bc2dca9d-3ddf-453d-a7dd-9aca5cb737ae	Computer Science	2021/2022	Team player, resourceful, patience	Passive, communication, public speaking	\N	S-Steady	t
17568953	d546cc86-39c3-44bd-b48c-3265c5b99df8	Science	2018/2019	Writing skills, creative, flexible, communication	Disorganized, procrastination	\N	I-Influencing	t
18693167	0486e3ab-008b-4bbd-91bc-880d1f105e15	Computer Science	2019/2020	Team player, resourceful, planning, patience	Passive, communication, public speaking	\N	S-Steady	t
18395171	34302cf6-a23f-428a-bce5-aa8c00d612c8	Computer Science	2019/2020	Drawing, graphic design, thinking creatively	Multitasking, too detail-oriented, public speaking	\N	C-Cautious	t
18246397	ba9ed5d0-4668-43eb-a6ef-2cfca67f9459	Computer Science	2019/2020	Public Speaking, fast learner, leadership, coding, hardworking	Impatient, Work life balance	\N	D-Dominate	t
17948753	d775f255-951f-46b5-9a0c-ce8aa446b80d	Computer Science	2018/2019	Writing skills, creative, flexible, communication	Disorganized, procrastination	\N	I-Influencing	t
17564829	68ad29b0-7cf8-4fd8-aff1-37a9ee423efd	Science	2018/2019	Team player, resourceful, planning, patience	Passive, communication, public speaking	\N	S-Steady	t
18853479	6618c6b9-b2fe-4948-a6b4-d54e08b7d827	Science	2019/2020	Drawing, graphic design, thinking creatively	Multitasking, too detail-oriented, public speaking	\N	C-Cautious	t
17231567	e7927d56-c582-4966-a784-e58d78d93935	Science	2018/2019	Public Speaking, fast learner, leadership, coding, hardworking	Impatient, Work life balance	\N	D-Dominate	t
17854117	da13fa0c-76b9-4f7d-a4df-2e8e2a8fdcc1	Computer Science	2018/2019	Writing skills, creative, flexible, communication	Disorganized, procrastination	\N	I-Influencing	t
18745778	9aa19ada-5468-4502-9e50-728dded8935c	Computer Science	2019/2020	Team player, resourceful, planning, patience	Passive, communication, public speaking	\N	S-Steady	t
17245896	e4a1744f-4cc8-42bb-8570-3357c45bee1a	Computer Science	2018/2019	Drawing, graphic design, thinking creatively	Multitasking, too detail-oriented, public speaking	\N	C-Cautious	t
18208568	aa578a7f-4071-4144-a137-3a07dc55f994	Computer Science	2019/2020	Public Speaking, fast learner, leadership, coding, hardworking	Impatient, Work life balance	\N	D-Dominate	t
\.


--
-- Data for Name: teacher; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher (teacher_id, user_id_fk, department, postition, description, notification_email) FROM stdin;
13456798	ab92bd6f-60eb-4a2c-8bd1-aabe11f38d4a	Computer Science	Head	\N	t
18285434	b63b9801-de45-4c34-b5ac-bed8c231cbc3	Computer Science	Teacher	\N	t
23433333	d5b6b065-3c36-40e4-8210-a0d8393848be	English	Head	\N	t
\.


--
-- Data for Name: user_course; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_course (user_id, course_id) FROM stdin;
aa578a7f-4071-4144-a137-3a07dc55f994	COMP1001-1
e4a1744f-4cc8-42bb-8570-3357c45bee1a	COMP1001-1
254912ce-627d-46c7-8f18-1bc0faafcd4e	COMP1001-1
7656fc76-544a-4bb1-bf87-e7dd990b7f16	COMP1001-1
8e23ac37-166e-462a-84f6-fc6a4d553df0	COMP1001-1
d2e4ce64-5fd2-40e4-b4f5-066bc050a906	COMP1001-1
3c471704-d9db-4af7-bf21-4e1d3b1f99dd	COMP1001-1
729488b2-d4b5-42e5-bc30-a91cfabd0e32	COMP1001-1
a65e5bde-dc5b-46c2-9394-c95acc0d8e75	COMP1001-1
9aa19ada-5468-4502-9e50-728dded8935c	COMP1001-1
62206e72-a96d-4748-b143-7c07a9c4b58f	COMP1001-1
aecce459-ab59-4aca-b38e-15282a3ee81c	COMP1001-2
56c4b1eb-0ee4-445c-bd9f-3147aabc42de	COMP1001-2
da13fa0c-76b9-4f7d-a4df-2e8e2a8fdcc1	COMP1001-2
e7927d56-c582-4966-a784-e58d78d93935	COMP1001-2
6618c6b9-b2fe-4948-a6b4-d54e08b7d827	COMP1001-2
68ad29b0-7cf8-4fd8-aff1-37a9ee423efd	COMP1001-2
d546cc86-39c3-44bd-b48c-3265c5b99df8	COMP1001-3
d775f255-951f-46b5-9a0c-ce8aa446b80d	COMP1001-3
ba9ed5d0-4668-43eb-a6ef-2cfca67f9459	COMP1001-3
34302cf6-a23f-428a-bce5-aa8c00d612c8	COMP1001-3
0486e3ab-008b-4bbd-91bc-880d1f105e15	COMP1001-3
aa578a7f-4071-4144-a137-3a07dc55f994	COMP1025-1
e4a1744f-4cc8-42bb-8570-3357c45bee1a	COMP1025-1
254912ce-627d-46c7-8f18-1bc0faafcd4e	COMP1025-1
7656fc76-544a-4bb1-bf87-e7dd990b7f16	COMP1025-1
d2e4ce64-5fd2-40e4-b4f5-066bc050a906	COMP1025-1
3c471704-d9db-4af7-bf21-4e1d3b1f99dd	COMP1025-1
729488b2-d4b5-42e5-bc30-a91cfabd0e32	COMP1025-1
a65e5bde-dc5b-46c2-9394-c95acc0d8e75	COMP1025-1
9aa19ada-5468-4502-9e50-728dded8935c	COMP1025-1
62206e72-a96d-4748-b143-7c07a9c4b58f	COMP1025-1
aecce459-ab59-4aca-b38e-15282a3ee81c	COMP1025-1
56c4b1eb-0ee4-445c-bd9f-3147aabc42de	COMP1025-1
da13fa0c-76b9-4f7d-a4df-2e8e2a8fdcc1	COMP1025-1
e7927d56-c582-4966-a784-e58d78d93935	COMP1025-1
6618c6b9-b2fe-4948-a6b4-d54e08b7d827	COMP1025-1
68ad29b0-7cf8-4fd8-aff1-37a9ee423efd	COMP1025-2
d546cc86-39c3-44bd-b48c-3265c5b99df8	COMP1025-2
d775f255-951f-46b5-9a0c-ce8aa446b80d	COMP1025-2
ba9ed5d0-4668-43eb-a6ef-2cfca67f9459	COMP1025-2
34302cf6-a23f-428a-bce5-aa8c00d612c8	COMP1025-2
0486e3ab-008b-4bbd-91bc-880d1f105e15	COMP1025-2
aa578a7f-4071-4144-a137-3a07dc55f994	COMP2004-1
e4a1744f-4cc8-42bb-8570-3357c45bee1a	COMP2004-1
254912ce-627d-46c7-8f18-1bc0faafcd4e	COMP2004-1
7656fc76-544a-4bb1-bf87-e7dd990b7f16	COMP2004-1
d2e4ce64-5fd2-40e4-b4f5-066bc050a906	COMP2004-1
8e23ac37-166e-462a-84f6-fc6a4d553df0	COMP2004-1
3c471704-d9db-4af7-bf21-4e1d3b1f99dd	COMP2004-1
729488b2-d4b5-42e5-bc30-a91cfabd0e32	COMP2004-1
a65e5bde-dc5b-46c2-9394-c95acc0d8e75	COMP2004-1
9aa19ada-5468-4502-9e50-728dded8935c	COMP2004-1
62206e72-a96d-4748-b143-7c07a9c4b58f	COMP2004-1
aecce459-ab59-4aca-b38e-15282a3ee81c	COMP2004-1
56c4b1eb-0ee4-445c-bd9f-3147aabc42de	COMP2004-1
da13fa0c-76b9-4f7d-a4df-2e8e2a8fdcc1	COMP2004-1
e7927d56-c582-4966-a784-e58d78d93935	COMP2004-1
6618c6b9-b2fe-4948-a6b4-d54e08b7d827	COMP2004-1
68ad29b0-7cf8-4fd8-aff1-37a9ee423efd	COMP2004-1
d546cc86-39c3-44bd-b48c-3265c5b99df8	COMP2004-2
d775f255-951f-46b5-9a0c-ce8aa446b80d	COMP2004-2
ba9ed5d0-4668-43eb-a6ef-2cfca67f9459	COMP2004-2
34302cf6-a23f-428a-bce5-aa8c00d612c8	COMP2004-2
0486e3ab-008b-4bbd-91bc-880d1f105e15	COMP2004-2
bc2dca9d-3ddf-453d-a7dd-9aca5cb737ae	COMP1002-1
aa578a7f-4071-4144-a137-3a07dc55f994	COMP1002-1
e4a1744f-4cc8-42bb-8570-3357c45bee1a	COMP1002-1
7656fc76-544a-4bb1-bf87-e7dd990b7f16	COMP1002-1
9aa19ada-5468-4502-9e50-728dded8935c	COMP1002-1
bc2dca9d-3ddf-453d-a7dd-9aca5cb737ae	COMP1001-1
bc2dca9d-3ddf-453d-a7dd-9aca5cb737ae	COMP1025-1
bc2dca9d-3ddf-453d-a7dd-9aca5cb737ae	COMP2004-1
e4a1744f-4cc8-42bb-8570-3357c45bee1a	COMP1005-1
254912ce-627d-46c7-8f18-1bc0faafcd4e	COMP1005-1
7656fc76-544a-4bb1-bf87-e7dd990b7f16	COMP1005-1
8e23ac37-166e-462a-84f6-fc6a4d553df0	COMP1005-1
d2e4ce64-5fd2-40e4-b4f5-066bc050a906	COMP1005-1
3c471704-d9db-4af7-bf21-4e1d3b1f99dd	COMP1005-1
bc2dca9d-3ddf-453d-a7dd-9aca5cb737ae	COMP1005-1
\.


--
-- Name: allgroup allgroup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.allgroup
    ADD CONSTRAINT allgroup_pkey PRIMARY KEY (group_id);


--
-- Name: alluser alluser_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alluser
    ADD CONSTRAINT alluser_email_key UNIQUE (email);


--
-- Name: alluser alluser_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alluser
    ADD CONSTRAINT alluser_pkey PRIMARY KEY (user_id);


--
-- Name: course course_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (course_id);


--
-- Name: invite invite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite
    ADD CONSTRAINT invite_pkey PRIMARY KEY (invite_id);


--
-- Name: project project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (project_id);


--
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (student_id);


--
-- Name: teacher teacher_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_pkey PRIMARY KEY (teacher_id);


--
-- Name: user_course user_course_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_course
    ADD CONSTRAINT user_course_pkey PRIMARY KEY (user_id, course_id);


--
-- Name: allgroup fk_course_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.allgroup
    ADD CONSTRAINT fk_course_id FOREIGN KEY (course_id_fk) REFERENCES public.course(course_id) ON DELETE CASCADE;


--
-- Name: invite fk_group_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite
    ADD CONSTRAINT fk_group_id FOREIGN KEY (group_id_fk) REFERENCES public.allgroup(group_id) ON DELETE CASCADE;


--
-- Name: allgroup fk_project_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.allgroup
    ADD CONSTRAINT fk_project_id FOREIGN KEY (project_id_fk) REFERENCES public.project(project_id) ON DELETE CASCADE;


--
-- Name: invite fk_project_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite
    ADD CONSTRAINT fk_project_id FOREIGN KEY (project_id_fk) REFERENCES public.project(project_id) ON DELETE CASCADE;


--
-- Name: invite fk_recipient_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite
    ADD CONSTRAINT fk_recipient_id FOREIGN KEY (recipient_id_fk) REFERENCES public.alluser(user_id) ON DELETE CASCADE;


--
-- Name: invite fk_section_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite
    ADD CONSTRAINT fk_section_id FOREIGN KEY (section_id_fk) REFERENCES public.course(course_id) ON DELETE CASCADE;


--
-- Name: invite fk_sender_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite
    ADD CONSTRAINT fk_sender_id FOREIGN KEY (sender_id_fk) REFERENCES public.alluser(user_id) ON DELETE CASCADE;


--
-- Name: teacher fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id_fk) REFERENCES public.alluser(user_id) ON DELETE CASCADE;


--
-- Name: student fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id_fk) REFERENCES public.alluser(user_id) ON DELETE CASCADE;


--
-- Name: course fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT fk_user_id FOREIGN KEY (instructor_id_fk) REFERENCES public.alluser(user_id) ON DELETE CASCADE;


--
-- Name: project fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT fk_user_id FOREIGN KEY (instructor_id_fk) REFERENCES public.alluser(user_id) ON DELETE CASCADE;


--
-- Name: user_course user_course_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_course
    ADD CONSTRAINT user_course_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(course_id) ON DELETE CASCADE;


--
-- Name: user_course user_course_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_course
    ADD CONSTRAINT user_course_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.alluser(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

