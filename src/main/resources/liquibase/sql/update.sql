--
-- Data for Name: update; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO update (id, code, name, url, date_created, created_by, status, size, version) OVERRIDING SYSTEM VALUE VALUES (1, 'a8ee0b70-301f-11ec-8d3d-0242ac130003', 'LAMISPlus', 'http://www.lamisplus.org/base-module/api/updates/server?version=1.2', '2021-10-19 10:41:54.117', 'System', 3, 200, 1.2);


--
-- Name: update_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('update_id_seq', 2, true);