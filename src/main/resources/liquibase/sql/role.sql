--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.role (id, name, code, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (1, 'Super Admin', '358939e0-bfe0-4fcb-a8a6-fe1320e77ffd', '2020-11-23 00:00:00', 'Alexander Alozie', '2020-11-23 00:00:00', 'Alexander Alozie', 0);
INSERT INTO public.role (id, name, code, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (2, 'Facility Admin', '5e0df9cf-a212-4168-8a6b-dcdae4c47c9c', '2020-11-23 00:00:00', 'Alexander Alozie', '2020-11-23 00:00:00', 'Alexander Alozie', 0);
INSERT INTO public.role (id, name, code, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (3, 'Clinician', 'f1d9c226-6a43-491c-8c4b-4ac6e176e7c3', '2020-11-23 00:00:00', 'Alexander Alozie', '2020-11-23 00:00:00', 'Alexander Alozie', 0);
INSERT INTO public.role (id, name, code, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (4, 'Pharmacist', 'c147fbbd-de74-44cd-9a65-dd17a930ec35', '2020-11-23 00:00:00', 'Alexander Alozie', '2020-11-23 00:00:00', 'Alexander Alozie', 0);
INSERT INTO public.role (id, name, code, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (5, 'Laboratory Scientist', 'a25480ff-e4c6-4d30-8b0b-ba6e2191487c', '2020-11-23 00:00:00', 'Alexander Alozie', '2020-11-23 00:00:00', 'Alexander Alozie', 0);
INSERT INTO public.role (id, name, code, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (6, 'Nurse', '5341033d-f0f7-4af8-af6c-ac58ed1c06c8', '2020-11-23 00:00:00', 'Alexander Alozie', '2021-03-03 00:00:00', 'Alexander Alozie', 0);
INSERT INTO public.role (id, name, code, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (7, 'Data Clerk', '20523411-3713-4cf2-a1e4-4238e693f884', '2020-11-23 00:00:00', 'Alexander Alozie', '2021-03-04 00:00:00', 'Alexander Alozie', 0);
INSERT INTO public.role (id, name, code, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (8, 'Case Manager', '95cdaa1d-3a9e-413c-9478-3c80c1f35793', '2021-04-07 00:00:00', 'Alexander Alozie', '2021-04-07 00:00:00', 'Alexander Alozie', 0);


--
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

--SELECT pg_catalog.setval('public.role_id_seq', 9, false);

SELECT setval('role_id_seq', (9));

