// Hent DOM-elementene vi trenger
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const submenuToggles = document.querySelectorAll('.main-navigation .has-submenu > a'); // Kun de med undermeny
console.log('Script startet (Forenklet). Fant menuToggle:', menuToggle);
console.log('Fant navMenu:', navMenu);
console.log('Fant submenuToggles:', submenuToggles.length, 'stk', submenuToggles);

// Hamburger-meny logikk
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        console.log('Hamburger ikon klikket!');
        const isExpanded = navMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        console.log('Hovedmeny .active satt til:', isExpanded);

        // Nullstill undermenyer når hovedmeny lukkes
        if (!isExpanded) {
            submenuToggles.forEach(toggle => {
                const submenu = toggle.nextElementSibling;
                if (submenu && submenu.classList.contains('submenu')) {
                    submenu.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
} else {
    console.error("Kunne ikke finne menu-toggle eller nav-menu elementene.");
}

// KUN undermeny-logikk (forenklet)
if (submenuToggles.length > 0) {
    submenuToggles.forEach(toggle => {
        // Viktig: 'toggle' her er kun <a> for 'Kategorier' og 'Film'
        toggle.addEventListener('click', (event) => {
            console.log('Submenu toggle klikket:', toggle.textContent); // Viser teksten til den som ble klikket

            const isMobileView = window.innerWidth <= 768;
            console.log('isMobileView:', isMobileView);
            console.log('navMenu har .active:', navMenu.classList.contains('active'));

            if (isMobileView && navMenu.classList.contains('active')) {
                console.log('BETINGELSE OK.');
                event.preventDefault(); // Forhindre at # lenken følges

                const submenu = toggle.nextElementSibling;
                console.log('Forsøker å finne submenu etter:', toggle.textContent, 'Fant:', submenu);

                if (submenu && submenu.classList.contains('submenu')) {
                    console.log('Toggling active for:', toggle.textContent);
                    submenu.classList.toggle('active'); // Bare toggle den aktuelle
                    const isOpen = submenu.classList.contains('active');
                    toggle.setAttribute('aria-expanded', isOpen);
                    console.log(toggle.textContent, 'status: active=', isOpen, 'aria=', isOpen);
                } else {
                    console.error("FEIL: Fant ikke .submenu elementet rett etter:", toggle);
                }
            } else {
                 console.log('BETINGELSE IKKE MØTT.');
            }
        });
    });
} else {
    console.warn("ADVARSEL: Fant ingen elementer for submenuToggles.");
}

console.log('Script ferdig lastet (Forenklet).');