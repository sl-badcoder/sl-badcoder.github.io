(() => {
  "use strict";

  const form = document.getElementById("query-form");
  const input = document.getElementById("query-input");
  const meta = document.getElementById("result-meta");
  const content = document.getElementById("result-content");
  const history = [];
  let historyIndex = 0;

  function makeTable(result) {
    const table = document.createElement("table");
    table.className = "result-table";
    table.setAttribute("role", "table");
    const caption = document.createElement("caption");
    caption.className = "sr-only";
    caption.textContent = result.kind === "select" ? "Rows from " + result.table : "Query results";
    table.append(caption);
    const head = document.createElement("thead");
    head.setAttribute("role", "rowgroup");
    const headRow = document.createElement("tr");
    headRow.setAttribute("role", "row");
    result.columns.forEach((column, index) => {
      const th = document.createElement("th");
      th.scope = "col";
      th.id = "result-column-" + index;
      th.setAttribute("role", "columnheader");
      th.textContent = column;
      headRow.append(th);
    });
    head.append(headRow);
    table.append(head);

    const body = document.createElement("tbody");
    body.setAttribute("role", "rowgroup");
    result.rows.forEach(row => {
      const tr = document.createElement("tr");
      tr.setAttribute("role", "row");
      result.columns.forEach((column, index) => {
        const td = document.createElement("td");
        td.setAttribute("role", "cell");
        td.setAttribute("headers", "result-column-" + index);
        const label = document.createElement("span");
        label.className = "mobile-column-label";
        label.setAttribute("aria-hidden", "true");
        label.textContent = column;
        const value = document.createElement("span");
        value.className = "cell-value";
        const post = result.kind === "select" && (column === "link" || column === "writing.link")
          ? window.siteData.writing.find(item => item.link === row[column]) : null;
        const project = result.kind === "select" && (column === "link" || column === "projects.link") && row[column]
          ? window.siteData.projects.find(item => item.link === row[column]) : null;
        if (post || project) {
          const link = document.createElement("a");
          link.href = (post || project).link;
          link.textContent = post ? "Read post ↗" : "Open project ↗";
          link.setAttribute("aria-label", (post ? "Read " : "Open ") + (post || project).title);
          if (project) {
            link.target = "_blank";
            link.rel = "noreferrer";
          }
          value.append(link);
        } else {
          value.textContent = row[column];
        }
        td.append(label, value);
        tr.append(td);
      });
      body.append(tr);
    });
    table.append(body);
    return table;
  }

  function showHelp() {
    const list = document.createElement("ul");
    list.className = "help-list";
    [
      "SHOW TABLES;",
      "DESCRIBE projects;",
      "SELECT * FROM projects;",
      "SELECT title, year FROM projects;",
      "SELECT * FROM projects WHERE category = 'research';",
      "SELECT * FROM writing WHERE topic LIKE '%memory%';",
      "SELECT projects.title, me.name FROM projects JOIN me ON projects.person_id = me.id;",
      "SELECT * FROM experience LIMIT 2;",
      "SELECT COUNT(*) FROM projects;"
    ].forEach(example => {
      const item = document.createElement("li");
      const code = document.createElement("code");
      code.textContent = example;
      item.append(code);
      list.append(item);
    });
    const note = document.createElement("p");
    note.className = "result-message";
    note.textContent = "Supported: SELECT, one INNER JOIN, WHERE (= or LIKE), LIMIT, COUNT(*), DESCRIBE, and SHOW TABLES. Every content table has a person_id key pointing to me.id. This is a read-only browser demo.";
    content.append(list, note);
  }

  function execute(query) {
    input.value = query;
    const result = window.sqlEngine.runSql(query, window.siteData);
    meta.replaceChildren();
    content.replaceChildren();
    meta.textContent = result.kind === "error" ? "Error" : result.kind === "help" ? "Help" : result.status || "";
    if (result.kind === "error") {
      const error = document.createElement("p");
      error.className = "result-message result-error";
      error.textContent = result.message;
      content.append(error);
    } else if (result.kind === "help") {
      showHelp();
    } else if (result.rows.length === 0) {
      const empty = document.createElement("p");
      empty.className = "result-message";
      empty.textContent = "No rows matched that query.";
      content.append(empty);
    } else {
      content.append(makeTable(result));
    }
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    history.push(query);
    historyIndex = history.length;
    execute(query);
  });

  input.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      form.requestSubmit();
    } else if (event.altKey && event.key === "ArrowUp" && history.length) {
      event.preventDefault();
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = history[historyIndex];
    } else if (event.altKey && event.key === "ArrowDown" && history.length) {
      event.preventDefault();
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = history[historyIndex] || "";
    }
  });

  document.querySelectorAll("[data-query]").forEach(button => {
    button.addEventListener("click", event => {
      execute(button.dataset.query);
      if (event.detail === 0 || window.matchMedia("(pointer: fine)").matches) input.focus();
    });
  });

  const linkedQuery = new URLSearchParams(window.location.search).get("query");
  execute(linkedQuery && linkedQuery.length <= 180 ? linkedQuery : input.value);
})();
