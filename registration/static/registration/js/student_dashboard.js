document.addEventListener('DOMContentLoaded', () => {
	fetchStudentData();
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
		const students = Array.isArray(data.students) ? data.students : [];

		if (countElement) {
			countElement.textContent = data.count ?? students.length;
		}

		if (!tableBody) {
			return;
		}

		tableBody.replaceChildren();

		if (students.length === 0) {
			if (statusMessage) {
				statusMessage.textContent = 'No student records found.';
			}
			const emptyRow = document.createElement('tr');
			const emptyCell = document.createElement('td');
			emptyCell.colSpan = 5;
			emptyCell.textContent = 'No students registered yet.';
			emptyRow.appendChild(emptyCell);
			tableBody.appendChild(emptyRow);
			return;
		}

		students.forEach((student) => {
			const row = document.createElement('tr');
			[
				student.id,
				student.student_name,
				student.program,
				student.year_level,
				student.email,
			].forEach((value) => {
				const cell = document.createElement('td');
				cell.textContent = value;
				row.appendChild(cell);
			});
			tableBody.appendChild(row);
		});

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
