const API_URL = 'https://be-rest-rifqi-325409493725.us-central1.run.app/api/notes';
const noteForm = document.getElementById('note-form');
const notesList = document.getElementById('notes-list');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

let isEditMode = false;

document.addEventListener('DOMContentLoaded', fetchNotes);

async function fetchNotes() {
    const res = await fetch(API_URL);
    const notes = await res.json();
    notesList.innerHTML = '';
    notes.forEach(note => {
        const div = document.createElement('div');
        div.className = 'note-item';
        div.innerHTML = `
            <h3>${note.judul}</h3>
            <p>${note.isi}</p>
            <small>${new Date(note.tanggal_dibuat).toLocaleString('id-ID')}</small>
            <div class="actions">
                <button class="btn-edit" onclick="editNote(${note.id}, '${note.judul}', '${note.isi.replace(/\n/g, "\\n")}')">Edit</button>
                <button class="btn-delete" onclick="deleteNote(${note.id})">Hapus</button>
            </div>
        `;
        notesList.appendChild(div);
    });
}

noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('note-id').value;
    const judul = document.getElementById('judul').value;
    const isi = document.getElementById('isi').value;

    if (isEditMode) {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ judul, isi })
        });
    } else {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ judul, isi })
        });
    }

    resetForm();
    fetchNotes();
});

async function deleteNote(id) {
    if (confirm('Yakin ingin menghapus catatan ini?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchNotes();
    }
}

function editNote(id, judul, isi) {
    isEditMode = true;
    document.getElementById('note-id').value = id;
    document.getElementById('judul').value = judul;
    document.getElementById('isi').value = isi;
    submitBtn.innerText = 'Update Catatan';
    cancelBtn.style.display = 'inline-block';
}

cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    isEditMode = false;
    noteForm.reset();
    document.getElementById('note-id').value = '';
    submitBtn.innerText = 'Simpan Catatan';
    cancelBtn.style.display = 'none';
}