const apiBase = '/api';

const loginCard = document.getElementById('loginCard');
const dashboardCard = document.getElementById('dashboardCard');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminMessage = document.getElementById('adminMessage');
const logoutBtn = document.getElementById('logoutBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const searchInput = document.getElementById('searchInput');
const registrationsTableBody = document.querySelector('#registrationsTable tbody');

let registrations = [];

function showMessage(text, isError = false) {
    adminMessage.textContent = text;
    adminMessage.classList.remove('hidden');
    adminMessage.style.background = isError ? 'rgba(255, 100, 100, 0.18)' : 'rgba(75, 200, 134, 0.18)';
    adminMessage.style.borderColor = isError ? 'rgba(255, 100, 100, 0.35)' : 'rgba(75, 200, 134, 0.35)';
}

function hideMessage() {
    adminMessage.classList.add('hidden');
}

async function apiPost(path, body) {
    const res = await fetch(`${apiBase}${path}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

async function apiGet(path) {
    const res = await fetch(`${apiBase}${path}`, { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

function renderTable(rows) {
    registrationsTableBody.innerHTML = rows
        .map((r) => {
            return `
        <tr>
          <td>${r.id}</td>
          <td>${r.name}</td>
          <td>${r.phone}</td>
          <td>${r.email}</td>
          <td>${r.college}</td>
          <td>${r.department}</td>
          <td>${r.year}</td>
          <td>${new Date(r.created_at).toLocaleString()}</td>
        </tr>
      `;
        })
        .join('');
}

function applyFilters() {
    let filtered = [...registrations];

    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter((r) => {
            return (
                r.name.toLowerCase().includes(searchTerm) ||
                r.email.toLowerCase().includes(searchTerm) ||
                r.phone.toLowerCase().includes(searchTerm)
            );
        });
    }

    renderTable(filtered);
}

async function loadRegistrations() {
    try {
        registrations = await apiGet('/registrations');
        applyFilters();
    } catch (err) {
        console.error(err);
        showMessage('Failed to load registrations. You may need to log in again.', true);
        showLogin();
    }
}

function showLogin() {
    loginCard.classList.remove('hidden');
    dashboardCard.classList.add('hidden');
}

function showDashboard() {
    loginCard.classList.add('hidden');
    dashboardCard.classList.remove('hidden');
    hideMessage();
    loadRegistrations();
}

adminLoginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideMessage();

    const formData = new FormData(adminLoginForm);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
        await apiPost('/admin/login', { username, password });
        showDashboard();
    } catch (err) {
        showMessage(err.message, true);
    }
});

logoutBtn.addEventListener('click', async () => {
    try {
        await apiPost('/admin/logout', {});
    } catch (err) {
        // ignore
    }
    showLogin();
});

exportCsvBtn.addEventListener('click', () => {
    window.location.href = `${apiBase}/admin/export`;
});

searchInput.addEventListener('input', () => {
    applyFilters();
});

window.addEventListener('DOMContentLoaded', showLogin);
