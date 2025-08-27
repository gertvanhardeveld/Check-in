// Datum formatting
function formatDate(date) {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('nl-NL', options);
}

// Auto-resize textareas
function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

// Setup auto-resize for textareas
function setupAutoResize() {
  const textareas = document.querySelectorAll('textarea');
  textareas.forEach(textarea => {
    textarea.addEventListener('input', () => autoResize(textarea));
    // Initial resize
    autoResize(textarea);
  });
}

// Save check-in to localStorage
function saveCheckin(yesterday, today) {
  const checkins = getCheckins();
  const newCheckin = {
    id: Date.now(),
    date: new Date().toISOString(),
    yesterday: yesterday,
    today: today
  };
  
  checkins.unshift(newCheckin); // Add to beginning of array
  localStorage.setItem('checkins', JSON.stringify(checkins));
}

// Get all check-ins from localStorage
function getCheckins() {
  const stored = localStorage.getItem('checkins');
  return stored ? JSON.parse(stored) : [];
}

// Display check-ins history
function displayHistory() {
  const historyList = document.getElementById('historyList');
  const checkins = getCheckins();
  
  if (checkins.length === 0) {
    historyList.innerHTML = '<p class="no-history">Nog geen check-ins. Begin vandaag!</p>';
    return;
  }
  
  historyList.innerHTML = checkins.map(checkin => {
    const date = new Date(checkin.date);
    return `
      <div class="history-item">
        <div class="history-date">${formatDate(date)}</div>
        <div class="history-content">
          <div class="history-label">🔙 Gisteren gedaan:</div>
          <div class="history-text">${checkin.yesterday}</div>
        </div>
        <div class="history-content">
          <div class="history-label">🎯 Vandaag plannen:</div>
          <div class="history-text">${checkin.today}</div>
        </div>
      </div>
    `;
  }).join('');
}

// Show success message
function showSuccessMessage() {
  const successMessage = document.getElementById('successMessage');
  successMessage.classList.add('show');
  
  setTimeout(() => {
    successMessage.classList.remove('show');
  }, 3000);
}

// Clear form
function clearForm() {
  document.getElementById('checkinForm').reset();
  // Reset textarea heights
  const textareas = document.querySelectorAll('textarea');
  textareas.forEach(textarea => {
    autoResize(textarea);
  });
}

// Initialize app
function init() {
  // Set current date
  const currentDate = document.getElementById('currentDate');
  currentDate.textContent = formatDate(new Date());
  
  // Setup auto-resize for textareas
  setupAutoResize();
  
  // Display existing history
  displayHistory();
  
  // Handle form submission
  const form = document.getElementById('checkinForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const yesterday = document.getElementById('yesterday').value.trim();
    const today = document.getElementById('today').value.trim();
    
    if (!yesterday || !today) {
      alert('Vul beide vragen in om je check-in op te slaan.');
      return;
    }
    
    // Save the check-in
    saveCheckin(yesterday, today);
    
    // Show success message
    showSuccessMessage();
    
    // Clear form
    clearForm();
    
    // Refresh history
    displayHistory();
  });
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);