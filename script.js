document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = form.querySelector('#name')?.value || '';
        const email = form.querySelector('#email')?.value || '';

        alert(`Thanks ${name || 'applicant'}, we've received your application and will contact ${email || 'you'} soon.`);

        form.reset();

        fetch('/api/applications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                coverLetter: form.querySelector('#cover-letter')?.value || '',
                CV: form.querySelector('#resume')?.files[0]?.name || ''
            })
        });
    });
});