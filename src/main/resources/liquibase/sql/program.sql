--
-- Data for Name: program; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.program (id, name, code, module_id, archived, date_modified, modified_by, date_created, created_by) OVERRIDING SYSTEM VALUE VALUES (1, 'GENERAL SERVICES', '25216afc-d158-4696-ada6-00df609b9a4c', '1', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.program (id, name, code, module_id, archived, date_modified, modified_by, date_created, created_by) OVERRIDING SYSTEM VALUE VALUES (2, 'HIV SERVICES', '0d31f6ee-571c-45b8-80d5-3f7e1d5377b7', '2', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.program (id, name, code, module_id, archived, date_modified, modified_by, date_created, created_by) OVERRIDING SYSTEM VALUE VALUES (3, 'HTS SERVICES', 'daf7ce93-fc8c-4631-b4e7-f54e3c231c19', '3', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.program (id, name, code, module_id, archived, date_modified, modified_by, date_created, created_by) OVERRIDING SYSTEM VALUE VALUES (4, 'TB SERVICES', '9268d44c-cf41-429b-8450-65dee76e9089', '4', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.program (id, name, code, module_id, archived, date_modified, modified_by, date_created, created_by) OVERRIDING SYSTEM VALUE VALUES (5, 'PMTCT SERVICES', '4160a2a4-2944-4957-9a3e-a51153fe1e8c', '5', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.program (id, name, code, module_id, archived, date_modified, modified_by, date_created, created_by) OVERRIDING SYSTEM VALUE VALUES (6, 'KEY POP SERVICES', '73b76380-0625-40a7-8dbe-e71d90defddf', '6', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.program (id, name, code, module_id, archived, date_modified, modified_by, date_created, created_by) OVERRIDING SYSTEM VALUE VALUES (7, 'EPIDEMIC OUTBREAK SERVICES', '9c60587b-5bf6-493c-9805-afe72134b6bf', '7', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.program (id, name, code, module_id, archived, date_modified, modified_by, date_created, created_by) OVERRIDING SYSTEM VALUE VALUES (106, 'PrEP SERVICES', '7dd15a83-4a3c-4229-92a3-5290815f8de2', '2', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.program (id, name, code, module_id, archived, date_modified, modified_by, date_created, created_by) OVERRIDING SYSTEM VALUE VALUES (112, 'CASE INVESTIGATION MODULE', '229998b2-781d-43d7-81da-e2907ee246f4', '1', 1, NULL, NULL, NULL, NULL);
INSERT INTO public.program (id, name, code, module_id, archived, date_modified, modified_by, date_created, created_by) OVERRIDING SYSTEM VALUE VALUES (108, 'DIFFERENTIATED CARE', '16cf3e39-cc61-4d61-9a60-5dc8e60892ff', '1', 1, NULL, NULL, NULL, NULL);
INSERT INTO public.program (id, name, code, module_id, archived, date_modified, modified_by, date_created, created_by) OVERRIDING SYSTEM VALUE VALUES (116, 'CLIENT STATUS UPDATE', '08c99912-e8c9-4a26-bc1d-ff9093416801', '2', 1, NULL, NULL, NULL, NULL);
INSERT INTO public.program (id, name, code, module_id, archived, date_modified, modified_by, date_created, created_by) OVERRIDING SYSTEM VALUE VALUES (109, 'RETROSPECTIVE ', 'eca42373-057d-4a18-be50-622ceba0d931', '1', 0, NULL, NULL, NULL, NULL);
INSERT INTO public.program (id, name, code, module_id, archived, date_modified, modified_by, date_created, created_by) OVERRIDING SYSTEM VALUE VALUES (115, 'OTHER SERVICES', 'af4f000d-1a65-4dad-8d51-dad115defa28', '1', 0, NULL, NULL, NULL, NULL);


--
-- Name: program_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

--SELECT pg_catalog.setval('public.program_id_seq', 300, false);

SELECT setval('program_id_seq', (300));


