'use strict';

class TasksRepository {
	constructor(rep, pgp) {
		this.rep = rep;
		this.pgp = pgp;
	}

	create() {
		let sql = 'CREATE TABLE IF NOT EXISTS tasks(\
			id serial PRIMARY KEY,\
			label VARCHAR (100) NOT NULL,\
			gloss text NOT NULL,\
			conceptId integer NOT NULL,\
			conceptGlobalId integer NOT NULL,\
			parentConceptId integer NOT NULL,\
			parentConceptGlobalId integer NOT NULL,\
			lemma text NOT NULL,\
			wordnetId integer NOT NULL,\
			domainId integer NOT NULL,\
			typeId integer NOT NULL,\
			created_at TIMESTAMP DEFAULT now(),\
			updated_at TIMESTAMP DEFAULT now()\
		)';

		return this.rep.none(sql);
	}

	drop() {
		let sql = 'DROP TABLE tasks';
		return this.rep.none(sql);
	}

	empty() {
		let sql = 'TRUNCATE tasks';
		return this.rep.none(sql);
	}

	add(values) {
		return this.rep.none(
			'INSERT INTO tasks(label, gloss, conceptId, conceptGlobalId, parentConceptId, parentConceptGlobalId, lemma, domainId, typeId, wordnetId) VALUES(${label}, ${gloss}, ${conceptId}, ${conceptGlobalId}, ${parentConceptId}, ${parentConceptGlobalId}, ${lemma}, ${domainId}, ${typeId}, ${wordnetId})',
			values
		); // tldr; Values is an object, not an array
	}

	remove(id) {
		return this.rep.result('DELETE FROM tasks WHERE id = $1', +id, r => r.rowCount);
	}

	find(values, cb) {
		let sql = 'SELECT * FROM tasks WHERE id = ${id}'; // tldr; Values is an object, not an array
		return this.rep.oneOrNone(sql, values).then(res => cb(res));
	}

	all(cb) {
		return this.rep.any('SELECT * FROM tasks').then(res => cb(res));
	}

	total() {
		return this.rep.one('SELECT count(*) FROM tasks', [], a => +a.count);
	}
}

class TasksLogRepository {
	constructor(rep, pgp) {
		this.rep = rep;
		this.pgp = pgp;
	}

	create(cb) {
		let sql = 'CREATE TABLE IF NOT EXISTS task_count_log(\
			id BIGSERIAL PRIMARY KEY,\
			task_id BIGSERIAL,\
			task_type smallint,\
			domain_id smallint,\
			count smallint DEFAULT 0 \
		)';

		return this.rep.none(sql).then(function() {
			cb();
		});
	}

	insert(values) {
		this.rep.none('INSERT INTO task_count_log(task_id, task_type, domain_id) VALUES(${id}, ${typeid}, ${domainid})', values);
	}

}

const options = {
	extend(obj, dc) {
		obj.tasks = new TasksRepository(obj, pgp);
		obj.taskslog = new TasksLogRepository(obj, pgp);
	}
};
const pgp 	= require('pg-promise')(options);
const db 	= pgp('postgres://postgres:1234@localhost:5432/lkc2data');

module.exports = db;
