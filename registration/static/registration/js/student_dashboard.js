let allStudents = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchStudentData();

    
    document.getElementById('search-input')?.addEventListener('input', filterStudents);
    document.getElementById('program-filter')?.addEventListener('change', filterStudents);

    document.getElementById('clear-filters-btn')?.addEventListener('click', () => {
        const searchInput = document.getElementById('search-input');
        const programFilter = document.getElementById('program-filter');
        
        if (searchInput) searchInput.value = '';
        if (programFilter) programFilter.value = '';
        
        filterStudents();
    });

    document.getElementById('refresh-btn')?.addEventListener('click', fetchStudentData);
});

async function fetchStudentData() {
    const tableBody = document.getElementById('student-table-body');
    const countElement = document.getElementById('student-count');
    const statusMessage = document.getElementById('status-message');

    if (statusMessage) {
        statusMessage.textContent = 'Loading student records...';
        statusMessage.style.color = '';
    }

    try {
        const response = await fetch('/api/students/', {
            credentials: 'same-origin',
        });

        if (response.status === 401) {
            throw new Error('401 Unauthorized: Please log in to view student data.');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        allStudents = Array.isArray(data.students) ? data.students : [];


        populateProgramFilter(allStudents);

    
        filterStudents();

        if (statusMessage) {
            statusMessage.textContent = '';
        }
    } catch (error) {
        console.error('Fetch error:', error);
        if (statusMessage) {
            statusMessage.textContent = error.message;
            statusMessage.style.color = 'red';
        }
        if (countElement) {
            countElement.textContent = 'Unavailable';
        }
        if (tableBody) {
            tableBody.replaceChildren();
            const errorRow = document.createElement('tr');
            const errorCell = document.createElement('td');
            errorCell.colSpan = 5;
            errorCell.textContent = error.message;
            errorRow.appendChild(errorCell);
            tableBody.appendChild(errorRow);
        }
    }
}

function populateProgramFilter(students) {
    const programFilter = document.getElementById('program-filter');
    if (!programFilter) return;

    const currentSelection = programFilter.value;
    programFilter.innerHTML = '<option value="">All Programs</option>';


    const programs = [...new Set(students.map(s => s.program).filter(Boolean))];
    
    programs.forEach(programName => {
        const option = document.createElement('option');
        option.value = programName;
        option.textContent = programName;
        programFilter.appendChild(option);
    });


    if (programs.includes(currentSelection)) {
        programFilter.value = currentSelection;
    }
}

function filterStudents() {
    const searchInput = document.getElementById('search-input');
    const programFilter = document.getElementById('program-filter');
    const countElement = document.getElementById('student-count');
    const tableBody = document.getElementById('student-table-body');

    const searchValue = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedProgram = programFilter ? programFilter.value : '';


    const filtered = allStudents.filter(student => {
        const name = (student.student_name || '').toLowerCase();
        const email = (student.email || '').toLowerCase();
        const matchesSearch = name.includes(searchValue) || email.includes(searchValue);
        const matchesProgram = !selectedProgram || student.program === selectedProgram;

        return matchesSearch && matchesProgram;
    });


    if (countElement) {
        countElement.textContent = filtered.length;
    }

    if (!tableBody) return;

    tableBody.replaceChildren();


    if (filtered.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 5;
        emptyCell.style.textAlign = 'center';
        emptyCell.textContent = 'No matching student records found.';
        emptyRow.appendChild(emptyCell);
        tableBody.appendChild(emptyRow);
        return;
    }


    filtered.forEach(student => {
        const row = document.createElement('tr');
        [
            student.id,
            student.student_name,
            student.program,
            student.year_level,
            student.email,
        ].forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value ?? '';
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
}