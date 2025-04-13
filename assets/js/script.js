document.addEventListener('DOMContentLoaded', () => {
    // Vent til hele HTML er lastet før vi kjører scriptet

    // --- Hent Nødvendige Elementer ---
    const menuToggle = document.querySelector('.menu-toggle'); // Hamburger-ikon
    const navMenu = document.querySelector('.nav-menu');       // Hovedmeny UL-element
    const submenuToggleLinks = document.querySelectorAll('.main-navigation .has-submenu > a'); // Alle <a> som skal åpne en undermeny

    // --- Funksjon for å lukke ALLE åpne undermenyer (alle nivåer) ---
    const closeAllSubmenus = () => {
        const openSubmenus = document.querySelectorAll('.main-navigation .submenu.active');
        openSubmenus.forEach(submenu => {
            submenu.classList.remove('active');
            const parentLink = submenu.previousElementSibling; // Finner <a> før <ul>
            if (parentLink && parentLink.tagName === 'A' && parentLink.hasAttribute('aria-expanded')) {
                parentLink.setAttribute('aria-expanded', 'false');
            }
        });
    };

    // --- Hamburger-meny Toggle (Mobil) ---
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = navMenu.classList.toggle('active'); // Toggle hovedmeny-container
            menuToggle.setAttribute('aria-expanded', isExpanded);

            // Lukk alle undermenyer hvis hovedmenyen lukkes
            if (!isExpanded) {
                closeAllSubmenus();
            }
        });
    } else {
        // Bare logg hvis elementer mangler, ingen krise hvis f.eks. menuToggle ikke finnes på desktop
        // console.error("Kunne ikke finne .menu-toggle eller .nav-menu elementene.");
    }

    // --- Undermeny Toggle ved Klikk (Alle nivåer, Desktop & Mobil) ---
    if (submenuToggleLinks.length > 0) {
        submenuToggleLinks.forEach(toggleLink => { // toggleLink er et <a> element
            toggleLink.addEventListener('click', (event) => {
                event.preventDefault(); // Forhindre at lenken følges

                const parentLi = toggleLink.parentElement; // LI som inneholder <a> og <ul>
                const targetSubmenu = toggleLink.nextElementSibling; // UL.submenu som skal åpnes/lukkes

                if (!parentLi || !targetSubmenu || !targetSubmenu.classList.contains('submenu')) {
                    console.error("Feil i struktur rundt:", toggleLink);
                    return; // Avslutt hvis HTML-struktur er uventet
                }

                const isTargetCurrentlyExpanded = targetSubmenu.classList.contains('active');

                // --- Logikk for å lukke SØSKEN-undermenyer ---
                // Finn forelder-UL (enten .nav-menu eller en .submenu)
                const parentUl = parentLi.parentElement;
                // Finn alle LI-søsken av den vi klikket på sin LI
                const siblingLis = Array.from(parentUl.children);

                siblingLis.forEach(siblingLi => {
                    // Se kun på andre LI-elementer enn det vi klikket i
                    if (siblingLi !== parentLi && siblingLi.classList.contains('has-submenu')) {
                        const siblingSubmenu = siblingLi.querySelector(':scope > .submenu'); // Finn undermenyen til søskenet
                        if (siblingSubmenu && siblingSubmenu.classList.contains('active')) {
                            // Lukk søskenets undermeny
                            siblingSubmenu.classList.remove('active');
                            const siblingLink = siblingLi.querySelector(':scope > a');
                            if (siblingLink && siblingLink.hasAttribute('aria-expanded')) {
                                siblingLink.setAttribute('aria-expanded', 'false');
                            }
                        }
                    }
                });

                // --- Toggle den aktuelle undermenyen ---
                targetSubmenu.classList.toggle('active');
                toggleLink.setAttribute('aria-expanded', !isTargetCurrentlyExpanded); // Sett motsatt av hva den var
            });
        });
    } else {
        // console.warn("Fant ingen undermeny-lenker (.has-submenu > a).");
    }

    // --- Klikk Utenfor Meny Logikk ---
    document.addEventListener('click', (event) => {
        const mainNavigation = document.querySelector('.main-navigation');
        const isClickInsideNav = mainNavigation ? mainNavigation.contains(event.target) : false;

        // Hvis klikket var utenfor hele navigasjonsområdet
        if (!isClickInsideNav) {
            // Lukk ALLE åpne undermenyer
            closeAllSubmenus();

            // Lukk mobilmenyen HVIS den er åpen
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

    console.log('Navigasjons-script ferdig lastet.');

}); // Slutt på DOMContentLoaded