
const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const submitButton = contactForm.querySelector(
            'button[type="submit"]'
        );

        const isFrench = document.documentElement.lang.startsWith("fr");

        const originalText = submitButton
            ? submitButton.textContent
            : "";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = isFrench
                ? "Envoi en cours..."
                : "Sending...";
        }

        const formData = new FormData(contactForm);

        const data = {
            name: formData.get("name"),
            business: formData.get("business"),
            email: formData.get("email"),
            package: formData.get("package"),
            message: formData.get("message")
        };

        try {

            const response = await fetch(
                "https://prairieflow-server.onrender.com/api/contact",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error("Sending failed");
            }

            alert(
                isFrench
                    ? "Merci ! Votre demande a bien été envoyée."
                    : "Thank you! Your consultation request has been sent."
            );

            contactForm.reset();

        } catch (error) {

            console.error("Form error:", error);

            alert(
                isFrench
                    ? "Une erreur est survenue. Veuillez réessayer."
                    : "Something went wrong. Please try again later."
            );

        } finally {

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }

        }

    });

}
