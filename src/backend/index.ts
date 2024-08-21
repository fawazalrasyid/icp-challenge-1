import express, { Request, Response } from "express";
import path from "path";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
}

let db: Bookmark[] = [];

const app = express();

app.use(express.json());

app.post("/bookmark", (req: Request<any, any, Bookmark>, res: Response) => {
  const newBookmark: Bookmark = {
    id: `${db.length + 1}`,
    title: req.body.title,
    url: req.body.url,
    description: req.body.description,
  };

  db.push(newBookmark);
  res.status(201).json(newBookmark);
});

app.get("/bookmarks", (_req, res: Response) => {
  res.json(db);
});

app.get("/bookmark/:id", (req: Request, res: Response) => {
  const bookmark = db.find((b) => b.id === req.params.id);
  if (bookmark) {
    res.json(bookmark);
  } else {
    res.status(404).json({ message: "Bookmark not found" });
  }
});

app.put("/bookmark/:id", (req: Request, res: Response) => {
  const bookmarkIndex = db.findIndex((b) => b.id === req.params.id);

  if (bookmarkIndex !== -1) {
    const updatedBookmark: Bookmark = {
      id: req.params.id,
      title: req.body.title,
      url: req.body.url,
      description: req.body.description,
    };

    db[bookmarkIndex] = updatedBookmark;
    res.json(updatedBookmark);
  } else {
    res.status(404).json({ message: "Bookmark not found" });
  }
});

app.delete("/bookmark/:id", (req: Request, res: Response) => {
  const bookmarkIndex = db.findIndex((b) => b.id === req.params.id);

  if (bookmarkIndex !== -1) {
    db.splice(bookmarkIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Bookmark not found" });
  }
});

app.use(express.static(path.join(__dirname, "dist")));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
