--
-- Data for Name: flag; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.flag (id, name, field_value, datatype, operator, date_created, created_by, date_modified, modified_by, archived, field_name, continuous) OVERRIDING SYSTEM VALUE VALUES (4, 'HIV Positive', 'Positive', 1, 'equal_to', '2021-08-04 12:30:29.499', 'guest@lamisplus.org', '2021-08-11 18:43:40.379', 'guest@lamisplus.org', 0, 'hiv_test_result', false);
INSERT INTO public.flag (id, name, field_value, datatype, operator, date_created, created_by, date_modified, modified_by, archived, field_name, continuous) OVERRIDING SYSTEM VALUE VALUES (15, 'Age equal or greater than  15', '15', 2, 'greater_than_or_equal_to', '2021-08-10 13:55:47.537', 'guest@lamisplus.org', '2021-08-11 18:44:14.283', 'guest@lamisplus.org', 0, 'age', true);
INSERT INTO public.flag (id, name, field_value, datatype, operator, date_created, created_by, date_modified, modified_by, archived, field_name, continuous) OVERRIDING SYSTEM VALUE VALUES (2, 'Female', 'Female', 1, 'equal_to', '2021-08-04 12:28:04.781', 'guest@lamisplus.org', '2021-08-11 18:35:09.225', 'guest@lamisplus.org', 0, 'gender', false);
INSERT INTO public.flag (id, name, field_value, datatype, operator, date_created, created_by, date_modified, modified_by, archived, field_name, continuous) OVERRIDING SYSTEM VALUE VALUES (3, 'HIV Negative', 'Negative', 1, 'equal_to', '2021-08-04 12:28:39.702', 'guest@lamisplus.org', '2021-08-11 18:37:33.822', 'guest@lamisplus.org', 0, 'hiv_test_result', false);


--
-- Name: flag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

--SELECT pg_catalog.setval('public.flag_id_seq', 15, true);

SELECT setval('flag_id_seq', (15));



--
-- PostgreSQL database dump complete
--

