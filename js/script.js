// Hent DOM-elementene vi trenger
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const submenuToggles = document.querySelectorAll('.main-navigation .has-submenu > a');
console.log('Script startet. Fant menuToggle:', menuToggle); // LOG 1
console.log('Fant navMenu:', navMenu); // LOG 2
console.log('Fant submenuToggles:', submenuToggles.length, 'stk', submenuToggles); // LOG 3

// Funksjon for å lukke alle åpne undermenyer
const closeAllSubmenus = () => {
    console.log('closeAllSubmenus kjører...'); // LOG 4
    const openSubmenus = document.querySelectorAll('.main-navigation .submenu.active');
    openSubmenus.forEach(submenu => {
        submenu.classList.remove('active');
        const parentLink = submenu.previousElementSibling;
        if (parentLink && parentLink.tagName === 'A') {
            parentLink.setAttribute('aria-expanded', 'false');
        }
    });
};

// Sjekk om hovedmeny-elementene finnes
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        console.log('Hamburger ikon klikket!'); // LOG 5
        const isExpanded = navMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        console.log('Hovedmeny .active satt til:', isExpanded); // LOG 6
        if (!isExpanded) {
            closeAllSubmenus();
        }
    });
} else {
    console.error("Kunne ikke finne menu-toggle eller nav-menu elementene.");
}

// Legg til klikk-håndtering for undermeny-toggles (lenkene)
if (submenuToggles.length > 0) { // Bare legg til lyttere hvis vi fant noen toggles
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (event) => {
            console.log('Submenu toggle klikket:', toggle); // LOG 7

            const isMobileView = window.innerWidth <= 768;
            console.log('isMobileView:', isMobileView); // LOG 8
            console.log('navMenu har .active:', navMenu.classList.contains('active')); // LOG 9

            // KUN kjør hvis mobilmeny er åpen
            if (isMobileView && navMenu.classList.contains('active')) {
                console.log('BETINGELSE OK: Kjører submenu toggle logikk.'); // LOG 10
                event.preventDefault();

                const submenu = toggle.nextElementSibling;
                console.log('Forsøker å finne submenu etter:', toggle, 'Fant:', submenu); // LOG 11
                const currentlyExpanded = toggle.getAttribute('aria-expanded') === 'true';
                console.log('currentlyExpanded:', currentlyExpanded); // LOG 12

                if (!currentlyExpanded) {
                    closeAllSubmenus(); // closeAllSubmenus vil logge selv (LOG 4)
                }

                if (submenu && submenu.classList.contains('submenu')) {
                    console.log('Fant gyldig submenu. Toggler .active...'); // LOG 13
                    submenu.classList.toggle('active');
                    toggle.setAttribute('aria-expanded', !currentlyExpanded);
                    console.log('Status etter toggle: submenu har .active:', submenu.classList.contains('active'), 'link aria-expanded:', toggle.getAttribute('aria-expanded')); // LOG 14
                } else {
                    console.error("FEIL: Fant ikke .submenu elementet rett etter:", toggle); // LOG 15
                }
            } else {
                console.log('BETINGELSE IKKE MØTT: Gjør ingenting.'); // LOG 16
            }
        });
    });
} else {
    console.warn("ADVARSEL: Fant ingen elementer for submenuToggles å legge lytter til."); // LOG 17
}


// Valgfritt: Lukk undermenyer hvis brukeren klikker utenfor menyen
document.addEventListener('click', (event) => {
    if (navMenu.classList.contains('active')) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);

        if (!isClickInsideMenu && !isClickOnToggle) {
            console.log('Klikk utenfor menyen oppdaget. Lukker menyen.'); // LOG 18
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            closeAllSubmenus();
        }
    }
});

console.log('Script ferdig lastet.'); // LOG 19