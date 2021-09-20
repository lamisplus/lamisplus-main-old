--
-- Data for Name: lab_test_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.lab_test_group (id, name, code, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (1, 'Chemistry', '3f240cc7-0ef5-4530-a918-8e1322a98c77', '2021-03-05 00:00:00', 'Alexander Alozie', '2021-03-05 00:00:00', 'Alexander Alozie', 0);
INSERT INTO public.lab_test_group (id, name, code, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (2, 'Haematology', 'c3eb1241-8ad7-4311-987c-e283d90dceaa', '2021-03-05 00:00:00', 'Alexander Alozie', '2021-03-05 00:00:00', 'Alexander Alozie', 0);
INSERT INTO public.lab_test_group (id, name, code, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (3, 'Microbiology', 'ce873b69-4536-4786-9474-966a788f6e21', '2021-03-05 00:00:00', 'Alexander Alozie', '2021-03-05 00:00:00', 'Alexander Alozie', 0);
INSERT INTO public.lab_test_group (id, name, code, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (4, 'Virology', '90539047-5ec8-4e8d-bb0d-7a06e4a34d8b', '2021-03-05 00:00:00', 'Alexander Alozie', '2021-03-05 00:00:00', 'Alexander Alozie', 0);


--
-- Name: lab_test_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

--SELECT pg_catalog.setval('public.lab_test_group_id_seq', 5, false);

SELECT setval('lab_test_group_id_seq', (61));
