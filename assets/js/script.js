// Hent DOM-elementene vi trenger
const menuToggle = document.querySelector('.menu-toggle'); // Hamburger-ikon
const navMenu = document.querySelector('.nav-menu');       // Mobilmeny-container (UL)
const submenuToggles = document.querySelectorAll('.main-navigation .has-submenu > a'); // Lenker som åpner undermenyer

console.log('Script startet. Fant menuToggle:', menuToggle);
console.log('Fant navMenu:', navMenu);
console.log('Fant submenuToggles:', submenuToggles.length, 'stk', submenuToggles);

// --- Funksjon for å lukke ALLE ÅPNE undermenyer ---
const closeAllSubmenus = (excludeSubmenu = null) => { // excludeSubmenu er valgfri: undermeny som IKKE skal lukkes
    console.log('closeAllSubmenus kjører...');
    const openSubmenus = document.querySelectorAll('.main-navigation .submenu.active');
    openSubmenus.forEach(submenu => {
        if (submenu !== excludeSubmenu) { // Lukk kun hvis det IKKE er den vi vil ekskludere
             console.log('Lukker submenu:', submenu.previousElementSibling.textContent);
             submenu.classList.remove('active');
             const parentLink = submenu.previousElementSibling;
             if (parentLink && parentLink.tagName === 'A') {
                 parentLink.setAttribute('aria-expanded', 'false');
             }
        }
    });
};

// --- Hamburger-meny logikk (kun for mobil) ---
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        console.log('Hamburger ikon klikket!');
        // Toggle synlighet for mobilmeny-container
        const isExpanded = navMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        console.log('Mobilmeny .active satt til:', isExpanded);

        // Hvis vi lukker mobilmenyen, lukk også alle undermenyer
        if (!isExpanded) {
            closeAllSubmenus();
        }
    });
} else {
    console.error("Kunne ikke finne .menu-toggle eller .nav-menu elementene.");
}

// --- Undermeny logikk (gjelder NÅ BÅDE desktop og mobil) ---
if (submenuToggles.length > 0) {
    submenuToggles.forEach(toggle => { // toggle er <a> elementet
        toggle.addEventListener('click', (event) => {
            console.log('Toggle klikket:', toggle.textContent);
            // Forhindre standard lenke-handling ALLTID, siden klikk skal åpne/lukke meny
            event.preventDefault();

            const submenu = toggle.nextElementSibling; // Finn tilhørende UL.submenu
            console.log('Fant submenu:', submenu);

            if (submenu && submenu.classList.contains('submenu')) {
                const currentlyExpanded = submenu.classList.contains('active'); // Sjekk om DENNE er aktiv
                console.log('Submenu var aktiv:', currentlyExpanded);

                // Hvis DENNE IKKE var aktiv -> Lukk alle ANDRE FØRST
                if (!currentlyExpanded) {
                     closeAllSubmenus(submenu); // Gi beskjed om å ikke lukke DENNE
                }

                // Så toggle DENNE menyen
                submenu.classList.toggle('active');
                toggle.setAttribute('aria-expanded', !currentlyExpanded); // Sett motsatt av hva den var
                console.log('Submenu .active satt til:', !currentlyExpanded);

            } else {
                console.error("FEIL: Fant ikke .submenu elementet rett etter:", toggle);
            }
        });
    });
} else {
    console.warn("ADVARSEL: Fant ingen elementer for submenuToggles.");
}


// --- Klikk utenfor menyen logikk ---
document.addEventListener('click', (event) => {
    // Sjekk om klikket var utenfor HELE navigasjonsområdet
    const mainNavigation = document.querySelector('.main-navigation');
    // Sjekk også om klikket var på hamburger-ikonet (for mobil)
    const isClickOnMenuToggle = menuToggle ? menuToggle.contains(event.target) : false;

    // Hvis klikket er UTENFOR navigasjonen OG UTENFOR hamburger-ikonet
    if (mainNavigation && !mainNavigation.contains(event.target) && !isClickOnMenuToggle) {
        console.log('Klikk utenfor menyen oppdaget.');

        // Lukk mobilmenyen HVIS den er åpen
        if (navMenu && navMenu.classList.contains('active')) {
             console.log('Lukker mobilmeny');
             navMenu.classList.remove('active');
             if(menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        }

        // Lukk ALLTID alle åpne undermenyer (både desktop og mobil)
        closeAllSubmenus();
    }
});

console.log('Script ferdig lastet.');