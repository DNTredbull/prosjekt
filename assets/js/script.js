document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const submenuLinks = document.querySelectorAll('.has-submenu > a');

    // Lukk alle åpne undermenyer
    const closeAllSubmenus = () => {
        document.querySelectorAll('.submenu.active').forEach(sub => {
            sub.classList.remove('active');
            const trigger = sub.previousElementSibling;
            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    };

    // Toggle hovedmeny (mobil)
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
            if (!isOpen) {
                closeAllSubmenus();
            }
        });
    }

    // Toggle undermeny ved klikk
    submenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const submenu = link.nextElementSibling;

            if (!submenu || !submenu.classList.contains('submenu')) return;

            const isActive = submenu.classList.contains('active');

            // Lukk alle søsken
            const siblings = Array.from(link.closest('ul').children);
            siblings.forEach(item => {
                const sub = item.querySelector(':scope > .submenu');
                const subLink = item.querySelector(':scope > a');
                if (sub && sub !== submenu) {
                    sub.classList.remove('active');
                    if (subLink) subLink.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle valgt meny
            submenu.classList.toggle('active');
            link.setAttribute('aria-expanded', !isActive);
        });
    });

    // Klikk utenfor meny lukker alt
    document.addEventListener('click', (e) => {
        const nav = document.querySelector('.main-navigation');
        const isClickInside = nav && nav.contains(e.target);
        const isMenuButton = menuToggle && menuToggle.contains(e.target);

        if (!isClickInside && !isMenuButton) {
            closeAllSubmenus();
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
});
