
import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

let books = [];

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Library API is running"
    });
});

app.post("/api/books", (req, res) => {
    const { id, title, author, category, quantity, available } = req.body;

    if (
        !Number.isInteger(id) || id <= 0 ||
        !title?.trim() ||
        !author?.trim() ||
        !category?.trim() ||
        !Number.isInteger(quantity) ||
        !Number.isInteger(available) ||
        quantity < 0 ||
        available < 0 ||
        available > quantity
    ) {
        return res.status(400).json({
            success: false,
            message: "Please enter valid book details"
        });
    }

    const duplicate = books.some(book => book.id === id);

    if (duplicate) {
        return res.status(409).json({
            success: false,
            message: "Book ID already exists"
        });
    }

    const book = {
        id,
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        quantity,
        available
    };

    books.push(book);

    res.status(201).json({
        success: true,
        message: "New book added",
        data: book
    });
});

app.get("/api/books", (req, res) => {
    res.status(200).json({
        success: true,
        message: books.length === 0 ? "No books found" : "Books retrieved successfully",
        count: books.length,
        data: books
    });
});

app.get("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID"
        });
    }

    const book = books.find(item => item.id === id);

    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    res.status(200).json({
        success: true,
        data: book
    });
});

app.put("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID"
        });
    }

    const book = books.find(item => item.id === id);

    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    const { title, author, category, quantity, available } = req.body;

    if (
        req.body.id !== undefined &&
        Number(req.body.id) !== id
    ) {
        return res.status(400).json({
            success: false,
            message: "Book ID cannot be changed"
        });
    }

    if (
        !title?.trim() ||
        !author?.trim() ||
        !category?.trim() ||
        !Number.isInteger(quantity) ||
        !Number.isInteger(available) ||
        quantity < 0 ||
        available < 0 ||
        available > quantity
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid book details"
        });
    }

    book.title = title.trim();
    book.author = author.trim();
    book.category = category.trim();
    book.quantity = quantity;
    book.available = available;

    res.status(200).json({
        success: true,
        message: "Book details updated",
        data: book
    });
});

app.delete("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = books.findIndex(item => item.id === id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID"
        });
    }

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    const deletedBook = books.splice(index, 1);

    res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: deletedBook[0]
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
