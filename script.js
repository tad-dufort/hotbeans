document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    const navLinks = document.querySelectorAll('nav a');

    // Function to load page content
    async function loadPage(page) {
        try {
            const response = await fetch(`${page}.html`);
            const html = await response.text();
            contentDiv.innerHTML = html;
            // Re-attach form listener after loading content
            attachFormListener();
        } catch (error) {
            console.error('Error loading page:', error);
            contentDiv.innerHTML = '<p>Error loading content.</p>';
        }
    }

    // Function to attach form listener
    function attachFormListener() {
        const form = contentDiv.querySelector('form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = form.querySelector('#name')?.value || '';
            const email = form.querySelector('#email')?.value || '';
            const coverLetter = form.querySelector('#cover-letter')?.value || '';
            const cv = form.querySelector('#resume')?.files[0];

            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('coverLetter', coverLetter);
            formData.append('CV', cv);

            fetch('/api/applications', {
                method: 'POST',
                body: formData
            });

            alert(`Thanks ${name || 'applicant'}, we've received your application and will contact ${email || 'you'} soon.`);

            form.reset();
        });
    }

    // Function to update active nav link
    function updateActiveNav(hash) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            }
        });
    }

    // Function to handle navigation
    function navigateToPage(hash) {
        const page = hash.substring(1); // remove #
        if (page === '' || page === 'home') {
            loadPage('home');
        } else {
            loadPage(page);
        }
        updateActiveNav(hash);
        // Update URL without reloading
        history.replaceState(null, null, hash);
    }

    // Initial load
    const initialHash = window.location.hash || '#home';
    navigateToPage(initialHash);

    // Handle nav clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const hash = link.getAttribute('href');
            navigateToPage(hash);
        });
    });

    // Handle hash changes (back/forward buttons)
    window.addEventListener('hashchange', () => {
        navigateToPage(window.location.hash);
    });
});