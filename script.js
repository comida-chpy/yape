const editForm = document.getElementById('editForm');
const nameInput = document.getElementById('nameInput');
const phoneInput = document.getElementById('phoneInput');
const amountInput = document.getElementById('amountInput');
const displayName = document.getElementById('displayName');
const displayPhone = document.getElementById('displayPhone');
const displayAmount = document.getElementById('displayAmount');
const statusTime = document.getElementById('statusTime');
const receiptDate = document.getElementById('receiptDate');
const receiptTime = document.getElementById('receiptTime');
const fullscreenToggle = document.getElementById('fullscreenToggle');

function updateFullscreenButton() {
  if (!fullscreenToggle) return;

  const isFullscreen = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
  const label = isFullscreen ? 'Salir de pantalla completa' : 'Activar pantalla completa';
  fullscreenToggle.setAttribute('aria-label', label);
  fullscreenToggle.title = label;
}

if (fullscreenToggle) {
  fullscreenToggle.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      } else if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } catch {
      fullscreenToggle.setAttribute('aria-label', 'Pantalla completa no disponible en este navegador');
    }
  });

  document.addEventListener('fullscreenchange', updateFullscreenButton);
  document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
}

function formatTopClock(date) {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatReceiptDate(date) {
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];
  return `${date.getDate()} ${months[date.getMonth()]}. ${date.getFullYear()}`;
}

function formatReceiptTime(date) {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const meridiem = hours >= 12 ? 'p. m.' : 'a. m.';
  const normalizedHours = hours % 12 || 12;
  return `${String(normalizedHours).padStart(2, '0')}:${minutes} ${meridiem}`;
}

function updateDateTime() {
  const now = new Date();

  if (statusTime) {
    statusTime.textContent = formatTopClock(now);
  }

  if (receiptDate) {
    receiptDate.textContent = formatReceiptDate(now);
  }

  if (receiptTime) {
    receiptTime.textContent = formatReceiptTime(now);
  }
}

updateDateTime();
setInterval(updateDateTime, 1000);

function maskName(name) {
  if (!name) return 'Jonel A**a';

  const parts = name.split(' ');
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';

  if (!lastName) return firstName;

  const surnameLength = lastName.length;
  const hiddenCount = Math.max(1, Math.ceil(surnameLength / 2));
  const visibleCount = surnameLength - hiddenCount;
  const masked = '*'.repeat(hiddenCount);
  const visible = lastName.slice(0, visibleCount);

  return `${firstName} ${visible}${masked}`;
}

function maskPhone(phone) {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  return `*** *** ${digits.slice(-3)}`;
}

if (editForm) {
  editForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const newName = nameInput.value.trim() || 'Jonel Alania';
    const newPhone = phoneInput.value.trim() || '*** *** 634';
    const newAmount = amountInput.value.trim() || '2';

    localStorage.setItem('yapeName', newName);
    localStorage.setItem('yapePhone', newPhone);
    localStorage.setItem('yapeAmount', newAmount);

    window.location.href = 'yape.html';
  });
}

if (displayName || displayPhone || displayAmount) {
  const savedName = localStorage.getItem('yapeName') || 'Jonel Alania';
  const savedPhone = localStorage.getItem('yapePhone') || '*** *** 634';
  const savedAmount = localStorage.getItem('yapeAmount') || '2';

  if (displayName) {
    displayName.textContent = maskName(savedName);
  }

  if (displayPhone) {
    displayPhone.textContent = maskPhone(savedPhone);
  }

  if (displayAmount) {
    displayAmount.textContent = savedAmount;
  }
}
