/**
 * Highlights a specific row (on the right table),
 * removing highlight from all others. Stores row index in localStorage.
 */
function highlightRow(row) {
    // Remove highlight from all existing rows in the right table
    document.querySelectorAll('#scoreTable tr').forEach(r => r.classList.remove('highlight'));
  
    // Add highlight to the given row
    row.classList.add('highlight');
  
    // Save the index of this row to localStorage
    const allRows = Array.from(document.querySelectorAll('#scoreTable tr'));
    const rowIndex = allRows.indexOf(row); // 0-based
    localStorage.setItem('highlightedRowIndex', rowIndex);
  }
  
  /**
   * Highlights the correct tier row on the left based on the average score.
   */
  function highlightTierRow(average) {
    const sTier = document.getElementById('s-tier');
    const aTier = document.getElementById('a-tier');
    const bTier = document.getElementById('b-tier');
    const cTier = document.getElementById('c-tier');
    const dTier = document.getElementById('d-tier');
  
    // Remove highlight from all tier rows
    [sTier, aTier, bTier, cTier, dTier].forEach(row => row.classList.remove('highlight'));
  
    // Determine which tier row to highlight
    if (average >= 825) {
      sTier.classList.add('highlight');
    } else if (average >= 650) {
      aTier.classList.add('highlight');
    } else if (average >= 475) {
      bTier.classList.add('highlight');
    } else if (average >= 300) {
      cTier.classList.add('highlight');
    } else {
      dTier.classList.add('highlight');
    }
  }
  
  /**
   * Saves all input values and row count to localStorage.
   */
  function saveData() {
    const scores = [];
    document.querySelectorAll('#scoreTable input').forEach((input) => {
      scores.push(input.value);
    });
    localStorage.setItem('trackerScores', JSON.stringify(scores));
    localStorage.setItem('rowCount', document.getElementById('scoreTable').children.length);
  }
  
  /**
   * Load saved data from localStorage. Recreate the rows, set their values,
   * and if we have a highlighted row index, highlight that same row again.
   */
  function loadData() {
    const savedScores = JSON.parse(localStorage.getItem('trackerScores')) || [];
    const rowCount = localStorage.getItem('rowCount') || 6;
    const tableBody = document.getElementById('scoreTable');
    tableBody.innerHTML = '';
  
    // Recreate rows from saved data
    for (let i = 0; i < rowCount; i++) {
      addRow(savedScores[i] || '');
    }
  
    // Attempt to restore highlight in the right table
    const highlightedIndex = localStorage.getItem('highlightedRowIndex');
    if (highlightedIndex !== null) {
      const index = parseInt(highlightedIndex, 10);
      const rows = document.querySelectorAll('#scoreTable tr');
      // If the saved index is valid (in range)
      if (index >= 0 && index < rows.length) {
        highlightRow(rows[index]);
      }
    }
  }
  
  /**
   * Adds a new row to the right table with an optional initial score value.
   */
  function addRow(value = '') {
    const tableBody = document.getElementById('scoreTable');
    if (tableBody.children.length >= 16) return; // Limit to 16 rows
  
    const row = document.createElement('tr');
  
    // Cell for row index (1-based display)
    const cell1 = document.createElement('td');
    cell1.textContent = tableBody.children.length + 1;
    row.appendChild(cell1);
  
    // Cell for input
    const cell2 = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = '999';
    input.value = value;
    input.placeholder = 'Enter score';
    input.style.width = '80%';
  
    // When the user changes this input, highlight the row & save data
    input.addEventListener('input', function () {
      // Enforce bounds
      if (this.value > 999) this.value = 999;
      if (this.value < 0) this.value = 0;
  
      // Save the updated scores
      saveData();
      // Highlight the row we just edited (on the right side)
      highlightRow(this.closest('tr'));
    });
  
    cell2.appendChild(input);
    row.appendChild(cell2);
    tableBody.appendChild(row);
  
    // Save data after we add a new row
    saveData();
  }
  
  /**
   * Removes the last row from the right table (if more than 1 row remains).
   */
  function removeRow() {
    const tableBody = document.getElementById('scoreTable');
    if (tableBody.children.length > 1) {
      tableBody.removeChild(tableBody.lastChild);
      saveData();
    }
  }
  
  /**
   * Calculates the average from all input rows, displays it,
   * and highlights the tier row on the left accordingly.
   */
  function calculateAverage() {
    const inputs = document.querySelectorAll('#scoreTable input');
    let total = 0;
    let count = 0;
    inputs.forEach((input) => {
      const value = parseFloat(input.value);
      if (!isNaN(value)) {
        total += value;
        count++;
      }
    });
    const average = count > 0 ? (total / count).toFixed(2) : 0;
    document.getElementById('output').innerHTML = `Average Tracker Score: ${average}`;
  
    // Highlight the corresponding tier row in the left table
    highlightTierRow(average);
  }
  
  /**
   * Resets all data (localStorage, the right table, highlight).
   */
  function resetData() {
    localStorage.removeItem('trackerScores');
    localStorage.removeItem('rowCount');
    localStorage.removeItem('highlightedRowIndex');
    document.getElementById('scoreTable').innerHTML = '';
    loadData();
  }
  
  /* Initialize table and data on page load */
  document.addEventListener('DOMContentLoaded', () => {
    loadData();
  
    // Set current year in footer
    const currentYearElem = document.getElementById("currentYear");
    if (currentYearElem) {
      currentYearElem.textContent = new Date().getFullYear();
    }
  });
  