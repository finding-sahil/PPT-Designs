document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    const tableHead = document.querySelector('#points-table thead tr');
    const instruction = document.getElementById('instruction');
    const csvInput = document.getElementById('csvInput');
    const revealAllBtn = document.getElementById('revealAllBtn');
    let teamsData = [];
    let currentRevealIndex = 0;

    // Default Headers matching index.html
    const defaultHeaders = ['#', 'TEAM NAME', 'BOOYAH', 'PLACE PTS', 'KILL PTS', 'TOTAL'];

    // Handle CSV Upload
    csvInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                processCSV(text);
            };
            reader.readAsText(file);
        }
    });

    // Handle Reveal All
    revealAllBtn.addEventListener('click', () => {
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => row.classList.add('revealed'));
        currentRevealIndex = teamsData.length;
        instruction.textContent = "All teams revealed! Standings are final.";
        instruction.classList.add('hidden');
    });

    function generateDefaultData() {
        const teamNames = [
            "EVOS DIVINE", "RRQ KAZU", "TOTAL GAMING", "GODLIKE", "TEAM ELITE", 
            "GALAXY RACER", "TSM FTX", "NIGMA GALAXY", "ONIC OLYMPUS", "ECHO ESPORTS", 
            "SES ALFAINK", "FIRST RAIDERS"
        ];
        
        teamsData = [];
        
        for (let i = 0; i < teamNames.length; i++) {
            const rank = i + 1;
            const booyah = Math.floor(Math.random() * 4); // 0-3 wins
            const placePts = Math.floor(Math.random() * 50) + 10;
            const killPts = Math.floor(Math.random() * 60) + 20;
            const total = placePts + killPts;

            // Sort of realistic descending points for the demo
            const adjustedTotal = 150 - (i * 7) + Math.floor(Math.random() * 5);

            teamsData.push({
                '#': rank,
                'TEAM NAME': teamNames[i],
                'BOOYAH': booyah,
                'PLACE PTS': Math.floor(adjustedTotal * 0.4),
                'KILL PTS': Math.floor(adjustedTotal * 0.6),
                'TOTAL': adjustedTotal
            });
        }
        
        setupTable(defaultHeaders);
    }

    function processCSV(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) return;

        // Parse headers
        const headers = lines[0].split(',').map(h => h.trim());
        
        // Update Table Headers
        tableHead.innerHTML = '';
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header.toUpperCase();
            tableHead.appendChild(th);
        });

        // Parse Data
        teamsData = [];
        for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i].split(',');
            if (currentLine.length === headers.length) {
                const teamObj = {};
                headers.forEach((header, index) => {
                    teamObj[header] = currentLine[index].trim();
                });
                teamsData.push(teamObj);
            }
        }

        // Reset and Setup Table
        currentRevealIndex = 0;
        instruction.classList.remove('hidden');
        instruction.textContent = "Press **ENTER** to reveal the next team!";
        setupTable(headers);
    }

    function setupTable(headers) {
        tableBody.innerHTML = ''; // Clear existing rows
        
        teamsData.forEach((team, index) => {
            const row = document.createElement('tr');
            row.id = `team-row-${index + 1}`;
            
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = team[header];
                row.appendChild(td);
            });
            
            // Style the last column (Total Points usually)
            const lastTd = row.lastElementChild;
            if (lastTd) {
                // Reset specific styles if any, handled by CSS mostly now
                // But we can enforce the bold/color if needed dynamically
                // lastTd.style.color = '#000'; 
            }

            tableBody.appendChild(row);
        });
    }

    function revealNextTeam() {
        if (currentRevealIndex >= teamsData.length) {
            instruction.textContent = "All teams revealed! Standings are final.";
            return;
        }

        const nextRow = tableBody.querySelector(`#team-row-${currentRevealIndex + 1}`);
        if (nextRow) {
            nextRow.classList.add('revealed');
            currentRevealIndex++;

            if (currentRevealIndex < teamsData.length) {
                instruction.textContent = `Press ENTER to reveal Rank ${currentRevealIndex + 1}`;
            } else {
                instruction.textContent = "All teams revealed! Standings are final.";
                instruction.classList.add('hidden');
            }
            
            // Auto-scroll to the revealed row if it's out of view
            nextRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Event listener for the ENTER key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && document.activeElement.tagName !== 'INPUT') {
            event.preventDefault();
            revealNextTeam();
        }
    });

    // Reveal on table container click
    document.querySelector('.table-container').addEventListener('click', () => {
        revealNextTeam();
    });

    // Initialize with default data
    generateDefaultData();
});
