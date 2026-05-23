(function () {
  function slugify(value) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function makeDictionaryEntries(content) {
    var nodes = Array.from(content.childNodes);
    var fragment = document.createDocumentFragment();
    var entries = [];
    var index = 0;

    while (nodes.length) {
      var node = nodes.shift();
      var isTerm = node.nodeType === Node.ELEMENT_NODE && node.tagName === "B";

      if (!isTerm) {
        fragment.appendChild(node);
        continue;
      }

      index += 1;
      var section = document.createElement("section");
      var term = node.textContent.trim();
      var id = "term-" + (slugify(term) || "entry") + "-" + index;

      section.className = "dict-entry";
      section.id = id;
      section.dataset.term = term.toLowerCase();
      section.appendChild(node);

      while (nodes.length) {
        var next = nodes[0];
        var isBoundary =
          next.nodeType === Node.ELEMENT_NODE &&
          ["B", "H2", "H3", "HR"].indexOf(next.tagName) !== -1;

        if (isBoundary) {
          break;
        }

        section.appendChild(nodes.shift());
      }

      entries.push(section);
      fragment.appendChild(section);
    }

    content.appendChild(fragment);
    return entries;
  }

  function initDictionary() {
    var content = document.querySelector("#dictionary-content");
    var tools = document.querySelector(".dictionary-tools");

    if (!content || !tools) {
      return;
    }

    var entries = makeDictionaryEntries(content);
    var letters = Array.from(
      new Set(entries.map(function (entry) {
        return entry.dataset.term.charAt(0).toUpperCase();
      }))
    ).filter(Boolean).sort();

    tools.innerHTML =
      '<label for="dictionary-search">Search terms</label>' +
      '<input class="dictionary-search" id="dictionary-search" type="search" placeholder="Search RAM, CXL, SQL...">' +
      '<p class="dictionary-count"></p>' +
      '<div class="alphabet-filter" aria-label="Filter by first letter"></div>' +
      '<div class="term-index" aria-label="Term index"></div>' +
      '<a class="ghost-button" href="#top">Back to top</a>';

    document.body.id = "top";

    var search = tools.querySelector(".dictionary-search");
    var count = tools.querySelector(".dictionary-count");
    var alphabet = tools.querySelector(".alphabet-filter");
    var termIndex = tools.querySelector(".term-index");
    var activeLetter = "all";

    var allButton = document.createElement("button");
    allButton.type = "button";
    allButton.textContent = "All";
    allButton.className = "is-active";
    allButton.dataset.letter = "all";
    alphabet.appendChild(allButton);

    letters.forEach(function (letter) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = letter;
      button.dataset.letter = letter.toLowerCase();
      alphabet.appendChild(button);
    });

    entries.forEach(function (entry) {
      var link = document.createElement("a");
      link.href = "#" + entry.id;
      link.textContent = entry.querySelector("b").textContent.trim();
      termIndex.appendChild(link);
    });

    function update() {
      var query = search.value.trim().toLowerCase();
      var visible = 0;

      entries.forEach(function (entry) {
        var text = entry.textContent.toLowerCase();
        var term = entry.dataset.term;
        var matchesQuery = !query || text.indexOf(query) !== -1;
        var matchesLetter = activeLetter === "all" || term.charAt(0) === activeLetter;
        var isVisible = matchesQuery && matchesLetter;

        entry.classList.toggle("is-hidden", !isVisible);
        if (isVisible) {
          visible += 1;
        }
      });

      count.textContent = visible + " of " + entries.length + " terms visible";
    }

    alphabet.addEventListener("click", function (event) {
      if (event.target.tagName !== "BUTTON") {
        return;
      }

      activeLetter = event.target.dataset.letter;
      alphabet.querySelectorAll("button").forEach(function (button) {
        button.classList.toggle("is-active", button === event.target);
      });
      update();
    });

    search.addEventListener("input", update);
    update();
  }

  document.addEventListener("DOMContentLoaded", initDictionary);
})();
