const sqlSchema = {
  me: ["id", "name", "location", "role", "languages", "summary"],
  projects: ["id", "person_id", "title", "category", "year", "languages", "tools", "summary", "detail", "outcome", "link"],
  experience: ["id", "person_id", "role", "organization", "period", "summary"],
  education: ["id", "person_id", "degree", "subject", "institution", "period", "summary"],
  teaching: ["id", "person_id", "course", "institution", "period", "summary"],
  writing: ["id", "person_id", "title", "topic", "language", "summary", "link"],
  about: ["id", "person_id", "topic", "summary"],
  reading: ["id", "person_id", "title", "author", "status", "progress"],
  videos: ["id", "person_id", "title", "topic", "summary"]
};

function error(message) { return { kind: "error", message }; }

function runSql(source, data) {
  const query = source.trim().replace(/;\s*$/, "").trim();
  if (!query) return error("Enter a query to get started.");
  if (/^HELP$/i.test(query)) return { kind: "help" };

  if (/^SHOW\s+TABLES$/i.test(query)) {
    const rows = Object.keys(sqlSchema).map(table => ({ table, rows: String(data[table].length) }));
    return { kind: "tables", columns: ["table", "rows"], rows, status: rows.length + " tables" };
  }

  const describe = query.match(/^DESCRIBE\s+([a-z_][a-z_0-9]*)$/i);
  if (describe) {
    const table = describe[1].toLowerCase();
    if (!sqlSchema[table]) return error("Unknown table: " + table + ". Run SHOW TABLES;");
    const rows = sqlSchema[table].map(column => ({
      column,
      type: "TEXT",
      key: column === "id" ? "PRIMARY KEY" : column === "person_id" ? "FOREIGN KEY → me.id" : ""
    }));
    return { kind: "schema", columns: ["column", "type", "key"], rows, status: "schema for " + table };
  }

  const select = query.match(/^SELECT\s+(.+?)\s+FROM\s+([a-z_][a-z_0-9]*)(?:\s+(?:INNER\s+)?JOIN\s+([a-z_][a-z_0-9]*)\s+ON\s+([a-z_][a-z_0-9]*)\.([a-z_][a-z_0-9]*)\s*=\s*([a-z_][a-z_0-9]*)\.([a-z_][a-z_0-9]*))?(?:\s+WHERE\s+((?:[a-z_][a-z_0-9]*\.)?[a-z_][a-z_0-9]*)\s*(=|LIKE)\s*('(?:[^']|'')*'|"(?:[^"]|"")*"|[^\s]+))?(?:\s+LIMIT\s+(\d+))?$/i);
  if (!select) return error("Unsupported query. Try SELECT * FROM projects; or HELP;");

  const leftTable = select[2].toLowerCase();
  const rightTable = select[3]?.toLowerCase();
  if (!sqlSchema[leftTable]) return error("Unknown table: " + leftTable + ". Run SHOW TABLES;");
  if (rightTable && !sqlSchema[rightTable]) return error("Unknown table: " + rightTable + ". Run SHOW TABLES;");
  if (rightTable === leftTable) return error("Use two different tables in a JOIN.");
  const tables = rightTable ? [leftTable, rightTable] : [leftTable];

  function resolveColumn(name) {
    const parts = name.toLowerCase().split(".");
    if (parts.length === 2) {
      const [table, column] = parts;
      if (!tables.includes(table)) return { error: "Table " + table + " is not in this query." };
      if (!sqlSchema[table].includes(column)) return { error: "Unknown column: " + name + ". Try DESCRIBE " + table + ";" };
      return { table, column, label: rightTable ? table + "." + column : column };
    }
    if (parts.length !== 1) return { error: "Invalid column: " + name };
    const matches = tables.filter(table => sqlSchema[table].includes(parts[0]));
    if (matches.length === 0) return { error: "Unknown column: " + name + ". Try DESCRIBE " + leftTable + ";" };
    if (matches.length > 1) return { error: "Ambiguous column: " + name + ". Use a table name, for example " + matches[0] + "." + name + "." };
    return { table: matches[0], column: parts[0], label: rightTable ? matches[0] + "." + parts[0] : parts[0] };
  }

  let onA, onB;
  if (rightTable) {
    onA = resolveColumn(select[4] + "." + select[5]);
    onB = resolveColumn(select[6] + "." + select[7]);
    if (onA.error || onB.error) return error(onA.error || onB.error);
    if (onA.table === onB.table) return error("JOIN keys must come from different tables.");
  }

  const selection = select[1].trim();
  const countOnly = /^COUNT\s*\(\s*\*\s*\)$/i.test(selection);
  let selected;
  if (selection === "*") {
    selected = tables.flatMap(table => sqlSchema[table].map(column => ({
      table, column, label: rightTable ? table + "." + column : column
    })));
  } else if (countOnly) {
    selected = [];
  } else {
    selected = selection.split(",").map(part => resolveColumn(part.trim()));
    const problem = selected.find(column => column.error);
    if (problem) return error(problem.error);
  }

  const whereName = select[8];
  const whereColumn = whereName ? resolveColumn(whereName) : null;
  if (whereColumn?.error) return error(whereColumn.error);
  let whereValue = select[10];
  if (whereValue && ((whereValue.startsWith("'") && whereValue.endsWith("'")) || (whereValue.startsWith('"') && whereValue.endsWith('"')))) {
    const quote = whereValue[0];
    whereValue = whereValue.slice(1, -1).replaceAll(quote + quote, quote);
  }
  let matcher;
  if (whereColumn && select[9].toUpperCase() === "LIKE") {
    const pattern = whereValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/%/g, ".*").replace(/_/g, ".");
    matcher = new RegExp("^" + pattern + "$", "i");
  }

  let records = data[leftTable].map(row => ({ [leftTable]: row }));
  if (rightTable) {
    records = records.flatMap(left => data[rightTable]
      .filter(right => {
        const pair = { ...left, [rightTable]: right };
        return String(pair[onA.table][onA.column]) === String(pair[onB.table][onB.column]);
      })
      .map(right => ({ ...left, [rightTable]: right })));
  }
  if (whereColumn) {
    records = records.filter(record => {
      const value = String(record[whereColumn.table][whereColumn.column] ?? "");
      return matcher ? matcher.test(value) : value.toLowerCase() === whereValue.toLowerCase();
    });
  }

  if (countOnly) {
    return { kind: "count", columns: ["count"], rows: [{ count: String(records.length) }], status: "1 row" };
  }
  if (select[11] !== undefined) {
    const limit = Number(select[11]);
    if (limit < 1 || limit > 100) return error("LIMIT must be between 1 and 100.");
    records = records.slice(0, limit);
  }

  const linkTable = leftTable === "me" && rightTable ? rightTable : leftTable;
  const rows = records.map(record => {
    const row = { _id: record[linkTable].id };
    selected.forEach(field => { row[field.label] = String(record[field.table][field.column] ?? ""); });
    return row;
  });
  return {
    kind: "select",
    table: linkTable,
    columns: selected.map(field => field.label),
    rows,
    status: rows.length + (rows.length === 1 ? " row" : " rows")
  };
}

if (typeof window !== "undefined") window.sqlEngine = { runSql, sqlSchema };
if (typeof module !== "undefined") module.exports = { runSql, sqlSchema };
