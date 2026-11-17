
const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 3000;

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors({
    origin: [
        "https://backofficesk.com",
        "https://www.backofficesk.com"
    ]
}));

app.use(express.json({ limit: "20kb" }));

function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

app.get("/", (req, res) => {
    res.send("PrairieFlow server is running");
});

app.post("/api/contact", async (req, res) => {
    try {
        const { name, business, email, package: selectedPackage, message } = req.body;

        if (!name || !business || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Please complete all required fields."
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        const result = await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: [process.env.TO_EMAIL],
            replyTo: email,
            subject: "New consultation request - PrairieFlow",
            html: `
                <h2>New consultation request</h2>
                <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                <p><strong>Business:</strong> ${escapeHtml(business)}</p>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                <p><strong>Package:</strong> ${escapeHtml(selectedPackage || "Not selected")}</p>
                <p><strong>Message:</strong></p>
                <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
            `
        });

        if (result.error) {
            console.error(result.error);
            return res.status(500).json({
                success: false,
                message: "Could not send the request."
            });
        }

        res.json({ success: true });

    } catch (error) {
        console.error("Email error:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
});

app.listen(PORT, () => {
    console.log(`PrairieFlow server running on port ${PORT}`);
});
