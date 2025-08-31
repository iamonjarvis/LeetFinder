const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const app = express();

let problemMap = {};

async function loadProblems() {
  console.log("Fetching problems...");
  const res = await fetch("https://leetcode.com/api/problems/all/");
  const data = await res.json();

  data.stat_status_pairs.forEach(item => {
    const id = item.stat.frontend_question_id;
    const title = item.stat.question__title;
    const slug = item.stat.question__title_slug;

    // Convert difficulty level to text
    const difficultyLevels = ["Easy", "Medium", "Hard"];
    const difficulty = difficultyLevels[item.difficulty.level - 1];

    // Extract topic tags
    const tags = (item.topic_tags || []).map(t => t.name);

    problemMap[id] = { title, slug, difficulty, tags };
  });

  console.log("Problem data ready!");
}

app.use(express.static(path.join(__dirname))); // Serve index.html directly

// API endpoint to return problem info
app.get("/api/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (problemMap[id]) {
    res.json(problemMap[id]);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

loadProblems().then(() => {
  app.listen(3000, () => console.log("Server running at http://localhost:3000"));
});
