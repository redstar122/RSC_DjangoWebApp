async function loadStudents() {
	const countElement = document.getElementById('student-count');
	const statusElement = document.getElementById('student-status');
	const tableBody = document.getElementById('student-table-body');

	try {
		const response = await fetch('/api/students/', {
			credentials: 'same-origin',
		});

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error('Authentication required. Please log in to load student data.');
			}
			throw new Error(`Unable to load students (HTTP ${response.status}).`);
		}

		const data = await response.json();
		const students = Array.isArray(data.students) ? data.students : [];

		countElement.textContent = data.count;
		tableBody.replaceChildren();

		if (students.length === 0) {
			statusElement.textContent = 'No student records found.';
			const emptyRow = document.createElement('tr');
			const emptyCell = document.createElement('td');
			emptyCell.colSpan = 5;
			emptyCell.textContent = 'No students registered yet.';
			emptyRow.appendChild(emptyCell);
			tableBody.appendChild(emptyRow);
			return;
		}

		statusElement.textContent = 'Student records loaded successfully.';
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
	} catch (error) {
		countElement.textContent = 'Unavailable';
		statusElement.textContent = error.message;
		tableBody.replaceChildren();

		const errorRow = document.createElement('tr');
		const errorCell = document.createElement('td');
		errorCell.colSpan = 5;
		errorCell.textContent = error.message;
		errorRow.appendChild(errorCell);
		tableBody.appendChild(errorRow);
	}
}

loadStudents();
