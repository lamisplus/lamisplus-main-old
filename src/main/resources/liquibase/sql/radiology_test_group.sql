--
-- Data for Name: radiology_test_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.radiology_test_group (id, name, archived, date_modified, modified_by, created_by, date_created) OVERRIDING SYSTEM VALUE VALUES (1, 'Chest', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.radiology_test_group (id, name, archived, date_modified, modified_by, created_by, date_created) OVERRIDING SYSTEM VALUE VALUES (2, 'Neck', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.radiology_test_group (id, name, archived, date_modified, modified_by, created_by, date_created) OVERRIDING SYSTEM VALUE VALUES (3, 'Head', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.radiology_test_group (id, name, archived, date_modified, modified_by, created_by, date_created) OVERRIDING SYSTEM VALUE VALUES (4, 'Face', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.radiology_test_group (id, name, archived, date_modified, modified_by, created_by, date_created) OVERRIDING SYSTEM VALUE VALUES (5, 'Shoulder', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.radiology_test_group (id, name, archived, date_modified, modified_by, created_by, date_created) OVERRIDING SYSTEM VALUE VALUES (6, 'Arm', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.radiology_test_group (id, name, archived, date_modified, modified_by, created_by, date_created) OVERRIDING SYSTEM VALUE VALUES (7, 'Leg', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.radiology_test_group (id, name, archived, date_modified, modified_by, created_by, date_created) OVERRIDING SYSTEM VALUE VALUES (8, 'Ribs', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.radiology_test_group (id, name, archived, date_modified, modified_by, created_by, date_created) OVERRIDING SYSTEM VALUE VALUES (9, 'Hand', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.radiology_test_group (id, name, archived, date_modified, modified_by, created_by, date_created) OVERRIDING SYSTEM VALUE VALUES (10, 'Hip', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.radiology_test_group (id, name, archived, date_modified, modified_by, created_by, date_created) OVERRIDING SYSTEM VALUE VALUES (11, 'Knee', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.radiology_test_group (id, name, archived, date_modified, modified_by, created_by, date_created) OVERRIDING SYSTEM VALUE VALUES (12, 'Abdomen', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.radiology_test_group (id, name, archived, date_modified, modified_by, created_by, date_created) OVERRIDING SYSTEM VALUE VALUES (13, 'Pelvis', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.radiology_test_group (id, name, archived, date_modified, modified_by, created_by, date_created) OVERRIDING SYSTEM VALUE VALUES (14, 'Spine', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.radiology_test_group (id, name, archived, date_modified, modified_by, created_by, date_created) OVERRIDING SYSTEM VALUE VALUES (15, 'Special X Rays', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.radiology_test_group (id, name, archived, date_modified, modified_by, created_by, date_created) OVERRIDING SYSTEM VALUE VALUES (16, 'Other Radiology', 0, NULL, NULL, NULL, NULL);


--
-- Name: radiology_test_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

--SELECT pg_catalog.setval('public.radiology_test_group_id_seq', 17, false);

SELECT setval('radiology_test_group_id_seq', (17));

