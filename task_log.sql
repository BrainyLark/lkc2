drop table task_user_log;
drop table task_count_log;

create table task_user_log(
	id BIGSERIAL PRIMARY KEY,
	task_id BIGSERIAL,
	task_type smallint,
	domain_id smallint,
	user_name varchar(30)
);

create table task_count_log(
	id BIGSERIAL PRIMARY KEY,
	task_id BIGSERIAL,
	task_type smallint,
	domain_id smallint,
	count smallint
);

INSERT INTO task_user_log(task_id, task_type, domain_id, user_name) VALUES (500, 1, 5, 'ebi');
INSERT INTO task_user_log(task_id, task_type, domain_id, user_name) VALUES (501, 1, 5, 'ebi');
INSERT INTO task_user_log(task_id, task_type, domain_id, user_name) VALUES (502, 1, 5, 'ebi');
INSERT INTO task_user_log(task_id, task_type, domain_id, user_name) VALUES (503, 1, 5, 'ebi');

INSERT INTO task_user_log(task_id, task_type, domain_id, user_name) VALUES (500, 1, 5, 'sanaa');
INSERT INTO task_user_log(task_id, task_type, domain_id, user_name) VALUES (502, 1, 5, 'sanaa');
INSERT INTO task_user_log(task_id, task_type, domain_id, user_name) VALUES (506, 1, 5, 'sanaa');
INSERT INTO task_user_log(task_id, task_type, domain_id, user_name) VALUES (510, 1, 5, 'sanaa');

INSERT INTO task_user_log(task_id, task_type, domain_id, user_name) VALUES (500, 3, 5, 'ebi');
INSERT INTO task_user_log(task_id, task_type, domain_id, user_name) VALUES (501, 3, 5, 'ebi');
INSERT INTO task_user_log(task_id, task_type, domain_id, user_name) VALUES (502, 3, 5, 'ebi');
INSERT INTO task_user_log(task_id, task_type, domain_id, user_name) VALUES (503, 3, 5, 'ebi');


INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (500, 1, 5, 3);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (501, 1, 5, 4);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (502, 1, 5, 5);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (503, 1, 5, 5);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (504, 1, 5, 5);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (505, 1, 5, 5);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (506, 1, 5, 5);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (507, 1, 5, 5);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (508, 1, 5, 5);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (509, 1, 5, 5);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (510, 1, 5, 5);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (511, 1, 5, 5);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (512, 1, 5, 5);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (513, 1, 5, 5);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (514, 1, 5, 5);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (515, 1, 5, 5);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (516, 1, 5, 5);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (517, 1, 5, 5);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (518, 1, 5, 2);

INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (500, 2, 5, 4);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (501, 2, 5, 2);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (502, 2, 5, 2);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (503, 2, 5, 4);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (504, 2, 5, 4);
INSERT INTO task_count_log(task_id, task_type, domain_id, count) VALUES (505, 2, 5, 5);

select * from task_user_log;
select * from task_count_log;

UPDATE task_count_log SET count = 5 WHERE task_id = 518 and task_type = 1

delete from task_count_log;