const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        alert(
            "Thank you for your consultation request! " +
            "We will get back to you soon."
        );

        contactForm.reset();

    });

}
