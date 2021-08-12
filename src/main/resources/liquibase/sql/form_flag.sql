--
-- Data for Name: form_flag; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.form_flag (id, flag_id, status, created_by, date_created, modified_by, date_modified, archived, form_code) OVERRIDING SYSTEM VALUE VALUES (4, 2, 1, 'guest@lamisplus.org', '2021-08-04 12:28:04.952', 'guest@lamisplus.org', '2021-08-11 18:35:09.36', 0, '6331dad1-8605-40d7-a500-5ddaece98c80');
INSERT INTO public.form_flag (id, flag_id, status, created_by, date_created, modified_by, date_modified, archived, form_code) OVERRIDING SYSTEM VALUE VALUES (5, 2, 1, 'guest@lamisplus.org', '2021-08-04 12:28:04.954', 'guest@lamisplus.org', '2021-08-11 18:35:09.38', 0, '93950693-a97d-40bd-b465-444fb03210e4');
INSERT INTO public.form_flag (id, flag_id, status, created_by, date_created, modified_by, date_modified, archived, form_code) OVERRIDING SYSTEM VALUE VALUES (3, 2, 1, 'guest@lamisplus.org', '2021-08-04 12:28:04.95', 'guest@lamisplus.org', '2021-08-11 18:35:09.415', 0, '5a011eca-b5c1-47a4-b6d8-b1161b5f8b36');
INSERT INTO public.form_flag (id, flag_id, status, created_by, date_created, modified_by, date_modified, archived, form_code) OVERRIDING SYSTEM VALUE VALUES (6, 2, 1, 'guest@lamisplus.org', '2021-08-04 12:28:04.957', 'guest@lamisplus.org', '2021-08-11 18:35:09.457', 0, '0eeb7d61-ce73-4991-9d4e-5472da0ba7d9');
INSERT INTO public.form_flag (id, flag_id, status, created_by, date_created, modified_by, date_modified, archived, form_code) OVERRIDING SYSTEM VALUE VALUES (2, 2, 0, 'guest@lamisplus.org', '2021-08-04 12:28:04.948', 'guest@lamisplus.org', '2021-08-11 18:35:09.506', 0, 'bbc01821-ff3b-463d-842b-b90eab4bdacd');
INSERT INTO public.form_flag (id, flag_id, status, created_by, date_created, modified_by, date_modified, archived, form_code) OVERRIDING SYSTEM VALUE VALUES (8, 3, 1, 'guest@lamisplus.org', '2021-08-04 12:28:39.708', 'guest@lamisplus.org', '2021-08-11 18:37:33.837', 0, '67a8280b-af08-40e1-a8ff-c128f79eeeb3');
INSERT INTO public.form_flag (id, flag_id, status, created_by, date_created, modified_by, date_modified, archived, form_code) OVERRIDING SYSTEM VALUE VALUES (7, 3, 0, 'guest@lamisplus.org', '2021-08-04 12:28:39.706', 'guest@lamisplus.org', '2021-08-11 18:37:33.861', 0, '3746bd2c-362d-4944-8982-5189441b1d59');
INSERT INTO public.form_flag (id, flag_id, status, created_by, date_created, modified_by, date_modified, archived, form_code) OVERRIDING SYSTEM VALUE VALUES (57, 4, 1, 'guest@lamisplus.org', '2021-08-10 14:55:20.02', 'guest@lamisplus.org', '2021-08-11 18:43:40.487', 0, 'f70f12f8-7c0b-4fb3-8a5d-7f4a01f5fee1');
INSERT INTO public.form_flag (id, flag_id, status, created_by, date_created, modified_by, date_modified, archived, form_code) OVERRIDING SYSTEM VALUE VALUES (58, 4, 0, 'guest@lamisplus.org', '2021-08-10 14:55:20.021', 'guest@lamisplus.org', '2021-08-11 18:43:40.515', 0, '3746bd2c-362d-4944-8982-5189441b1d59');
INSERT INTO public.form_flag (id, flag_id, status, created_by, date_created, modified_by, date_modified, archived, form_code) OVERRIDING SYSTEM VALUE VALUES (55, 15, 1, 'guest@lamisplus.org', '2021-08-10 13:55:47.546', 'guest@lamisplus.org', '2021-08-11 18:44:14.297', 0, '96a45213-0018-40cf-ad6a-a201cecf1140');
INSERT INTO public.form_flag (id, flag_id, status, created_by, date_created, modified_by, date_modified, archived, form_code) OVERRIDING SYSTEM VALUE VALUES (59, 15, 1, 'guest@lamisplus.org', '2021-08-11 10:58:42.697', 'guest@lamisplus.org', '2021-08-11 18:44:14.313', 0, 'f70f12f8-7c0b-4fb3-8a5d-7f4a01f5fee1');
INSERT INTO public.form_flag (id, flag_id, status, created_by, date_created, modified_by, date_modified, archived, form_code) OVERRIDING SYSTEM VALUE VALUES (56, 15, 0, 'guest@lamisplus.org', '2021-08-10 13:55:47.549', 'guest@lamisplus.org', '2021-08-11 18:44:14.344', 0, 'bbc01821-ff3b-463d-842b-b90eab4bdacd');


--
-- Name: form_flag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

--SELECT pg_catalog.setval('public.form_flag_id_seq', 59, true);

SELECT setval('form_flag_id_seq', (60));
