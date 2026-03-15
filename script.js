const apiBase = '/api';

const registrationForm = document.getElementById('registrationForm');
const messageEl = document.getElementById('message');
const qrCanvas = document.getElementById('qrCanvas');

function showMessage(text, isError = false) {
    messageEl.textContent = text;
    messageEl.classList.remove('hidden');
    messageEl.style.background = isError ? 'rgba(255, 100, 100, 0.18)' : 'rgba(75, 200, 134, 0.18)';
    messageEl.style.borderColor = isError ? 'rgba(255, 100, 100, 0.35)' : 'rgba(75, 200, 134, 0.35)';
}

function hideMessage() {
    messageEl.classList.add('hidden');
}

async function createQrCode(text) {
    try {
        if (!window.QRCode || typeof window.QRCode.toCanvas !== 'function') {
            throw new Error('QRCode library not loaded or missing toCanvas');
        }

        await window.QRCode.toCanvas(qrCanvas, text, {
            width: 160,
            margin: 1,
            color: {
                dark: '#0b0f1f',
                light: '#f4f7ff',
            },
        });
    } catch (err) {
        console.warn('QR code generation failed', err);
    }
}

async function init() {
    const currentUrl = window.location.origin + window.location.pathname;
    await createQrCode(currentUrl);
}

async function handleRegistration(event) {
    event.preventDefault();
    hideMessage();

    const formData = new FormData(registrationForm);
    const payload = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        college: formData.get('college'),
        department: formData.get('department'),
        year: formData.get('year'),
    };

    try {
        const response = await fetch(`${apiBase}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const text = await response.text();
        let data = {};
        try {
            data = text ? JSON.parse(text) : {};
        } catch {
            // ignore invalid JSON
        }

        if (!response.ok) {
            const message = (data && data.error) || `Request failed (${response.status})`;
            throw new Error(message);
        }

        showMessage(data.message || 'Registration completed successfully!');
        registrationForm.reset();
    } catch (error) {
        console.error(error);
        showMessage(error.message || 'Something went wrong', true);
    }
}

registrationForm.addEventListener('submit', handleRegistration);
window.addEventListener('DOMContentLoaded', init);
