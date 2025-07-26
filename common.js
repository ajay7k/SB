document.addEventListener("DOMContentLoaded", function () {
    // Base path set to empty to work with any GitHub Pages repo
    const basePath = "";

    // Load Navbar
    document.getElementById("navbar-container").innerHTML = `
        <nav class="navbar">
            <div class="logo">
                <img src="${basePath}logo/logo.png" alt="logo">
            </div>
            <section class="nav-text"></section>
            <ul class="nav-list">
                <li><a href="${basePath}index.html">Home</a></li>
                <li class="dropdown-parent">
                    <a href="#">Explore</a>
                    <ul class="dropdown">
                        <li><a href="${basePath}html/Posters.html">Posters</a></li>
                        <li><a href="#">More Coming</a></li>
                    </ul>
                </li>
                <li><a href="${basePath}html/people.html">People</a></li>
                <li><a href="${basePath}html/publications.html">Publications</a></li>
                <li><a href="${basePath}html/support.html">Support Us</a></li>
            </ul>
            <div class="menu-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
    `;

    // Load Footer
    document.getElementById("footer-container").innerHTML = `
        <footer class="footer">
            <div class="footer-container">
                <div class="footer-logo">
                    <img src="${basePath}logo/logo.png" alt="SPACE Lab Logo">
                </div>
                <div class="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="${basePath}index.html">Home</a></li>
                        <li><a href="${basePath}html/people.html">People</a></li>
                        <li><a href="${basePath}html/publications.html">Publications</a></li>
                        <li><a href="${basePath}html/support.html">Support Us</a></li>
                    </ul>
                </div>
                <div class="footer-contact">
                    <h3>Contact Us</h3>
                    <p>Email: <a href="mailto:spac3.1a6@gmail.com">spac3.1a6@gmail.com</a></p>
                    <p>Follow us:</p>
                    <div class="social-icons-footer">
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-linkedin"></i></a>
                        <a href="#"><i class="fab fa-github"></i></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                &copy; 2025 SPACEBUD. All rights reserved.
            </div>
        </footer>
    `;

    initNavbarToggle();
});


function initNavbarToggle() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navList = document.querySelector(".nav-list");
    const dropdownParents = document.querySelectorAll(".dropdown-parent");

    // Mobile toggle
    menuToggle?.addEventListener("click", (e) => {
        e.stopPropagation();
        navList?.classList.toggle("active");
        menuToggle.classList.toggle("open");
        if (!navList.classList.contains("active")) closeAllDropdowns();
    });

    // Hover and click for dropdown
    dropdownParents.forEach(parent => {
        const dropdown = parent.querySelector(".dropdown");

        // Desktop hover
        parent.addEventListener("mouseenter", () => {
            if (window.innerWidth > 768) dropdown?.classList.add("show");
        });
        parent.addEventListener("mouseleave", () => {
            if (window.innerWidth > 768) dropdown?.classList.remove("show");
        });

        // Mobile click
        parent.querySelector("a").addEventListener("click", e => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown?.classList.toggle("show");
                closeOtherDropdowns(dropdown);
            }
        });
    });

    document.addEventListener("click", e => {
        if (!navList.contains(e.target) && !menuToggle.contains(e.target)) {
            navList.classList.remove("active");
            menuToggle.classList.remove("open");
            closeAllDropdowns();
        }
    });

    function closeOtherDropdowns(current) {
        document.querySelectorAll(".dropdown").forEach(d => {
            if (d !== current) d.classList.remove("show");
        });
    }

    function closeAllDropdowns() {
        document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("show"));
    }
}
