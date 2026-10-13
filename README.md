# sl-badcoder.github.io

Personal website with a small, read-only SQL interface.

## Preview locally

From the project directory, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/ and refresh after editing.

The shell supports `SHOW TABLES;`, `DESCRIBE projects;`, and simple `SELECT` queries with column selection, one `JOIN ... ON ...`, `WHERE` (`=` or `LIKE`), `LIMIT`, and `COUNT(*)`. Each content table has a `person_id` foreign key to `me.id`. Table shortcuts run their queries immediately; query results are plain text cells.
