/**
 * loading
 */
let i = setInterval(function () {
    clearInterval(i);
    document.getElementById("loading").style.display = "none";
    document.getElementById("content").style.display = "block";
}, 500);

const api = axios.create({
    baseURL: 'http://localhost:3333'
})

const btnLogout = document.getElementById('btn-logout');
const formRegisterNote = document.getElementById('form-register-note');
const btnRegisterNote = document.getElementById('btn-save-note');
let inputTitle = document.getElementById('recipient-title');
let inputDescription = document.getElementById('recipient-description');

let modal = new bootstrap.Modal('#exampleModal');

/**
 * sair do sistema
 */
function logout() {
    localStorage.removeItem('user-notes');
    alert('Always come back!')
    location.href = 'login.html'
}

btnLogout.addEventListener('click', logout)

/**
 * lista todos os recados salvos
 */
async function listNotes(id, listSaved) {
    
    try {

        const user = JSON.parse(localStorage.getItem('user-notes'))
        id = user.id

        let tabelNotes = document.getElementById('table-notes');

        tabelNotes.innerHTML = '';

        const result = await api.get(`/notes/${id}`)

        let array = result.data.notes

        let cont = 1

        if(!listSaved) {
            listSaved = false;
        }

        for(let item of array) {

            if(item.saved != listSaved) {
                continue;
            }
            
            tabelNotes = document.getElementById('table-notes');
            const editNote = `updateNote('${item.id}')`
            const deleteNote = `deleteNote('${item.id}')`
            const checkBoxNote = `checkBoxNote('${item.id}')`

            tabelNotes.innerHTML += `
                <tr>
                    <td>${cont}</td>
                    <td>${item.title}</td>
                    <td>${item.description}</td>
                    <td>
                        <button type="button"
                        class="btn btn-info btnAction"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onclick="${editNote}">Edit</button>
                        <button type="button"
                        class="btn btn-danger btnAction"
                        onclick="${deleteNote}">Delete</button>
                    </td>
                    <td>
                        <input type="checkbox"
                        class="form-check-input"
                        id="checkTeste_${item.id}"
                        onclick="${checkBoxNote}">
                    </td>
                </tr>
            `
            const checkId = document.getElementById(`checkTeste_${item.id}`)

            if(item.saved) {
                checkId.checked = true;
            }

            cont++
        }        
        
    } catch (error) {
        console.log(error)
    }

}

/**
 * marca o checkbox
 */
async function checkBoxNote(idNote) {

    try {

        const user = JSON.parse(localStorage.getItem('user-notes'));
        const idUser = user.id

        const check = document.getElementById(`checkTeste_${idNote}`)

        const bodyNote = {
            saved: check.checked
        }

        const result = await api.put(`/notes/flag/${idUser}/${idNote}`, bodyNote);

        listNotes();
        
    } catch (error) {
        console.log(error)
    }

}

/**
 * cria recados
 */
async function createNotes() {

    try {

        const edicao = localStorage.getItem('edicao')

        if(edicao === 'S') {            
            return updateNoteApi();
        }
        
        const user = JSON.parse(localStorage.getItem('user-notes'));
        const idUser = user.id

        if(inputTitle.value == '')  {
            alert('Fill in the TITLE field!');
            return;
        }

        if(inputDescription.value == '') {
            alert('Fill in the DESCRIPTION field!')
        }

        if(!formRegisterNote) {
            console.log('Dont have a form!');
            return;
        }

        if(!idUser) {
            alert('User not found!')
            return;
        }

        const notes = {
            title: formRegisterNote.input_note_title.value,
            description: formRegisterNote.input_note_description.value
        }

        const result = await api.post(`/notes/${idUser}`, notes)

        inputTitle.value = '';
        inputDescription.value = '';

        alert('Note registered successfully!')   
        modal.hide();
        listNotes()

    } catch (error) {
        console.log(error)
    }
}

/**
 * lista todos os recados (inclusive os salvos)
 */
async function listarTodosOsRecados() {

    try {

        const user = JSON.parse(localStorage.getItem('user-notes'))
        id = user.id

        let tabelNotes = document.getElementById('table-notes');

        tabelNotes.innerHTML = '';

        const result = await api.get(`/notes/${id}`)

        let array = result.data.notes

        let cont = 1

        for(let item of array) {

            const editNote = `updateNote('${item.id}')`
            const deleteNote = `deleteNote('${item.id}')`
            const checkBoxNote = `checkBoxNote('${item.id}')`

            tabelNotes.innerHTML += `
                <tr>
                    <td>${cont}</td>
                    <td>${item.title}</td>
                    <td>${item.description}</td>
                    <td>
                        <button type="button"
                        class="btn btn-info btnAction"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onclick="${editNote}">Edit</button>
                        <button type="button"
                        class="btn btn-danger btnAction"
                        onclick="${deleteNote}">Delete</button>
                    </td>
                    <td>
                        <input type="checkbox"
                        class="form-check-input"
                        id="checkTeste_${item.id}"
                        onclick="${checkBoxNote}">
                    </td>
                </tr>
            `
            cont++
        }
        
        
    } catch (error) {
        console.log(error)
    }

}

/**
 * controla o "tipo de edição"
 */
async function updateNoteApi() {

    try {

        /**
         * variável do usuário
         */
        const user = JSON.parse(localStorage.getItem('user-notes'));
        const idUser = user.id

        if(inputTitle.value == '')  {
            alert('Fill in the TITLE field!');
            return;
        }

        if(inputDescription.value == '') {
            alert('Fill in the DESCRIPTION field!')
        }

        if(!formRegisterNote) {
            console.log('Dont have a form!');
            return;
        }

        if(!idUser) {
            alert('User not found!')
            return;
        }

        const notes = {
            title: formRegisterNote.input_note_title.value,
            description: formRegisterNote.input_note_description.value
        }

        /**
         * recupera o id do recado no localstorage
         */
        const recadoId = localStorage.getItem('recadoId')

        if(!recadoId) {
            alert('Note not found!')
            return;
        }

        const result = await api.put(`/notes/${idUser}/${recadoId}`, notes)

        inputTitle.value = '';
        inputDescription.value = '';

        alert('Note update successfully!')   
        modal.hide();
        listNotes()
        
    } catch (error) {
        console.log(error)
    }

}
 /**
  * altera o recado
  */
async function updateNote(editNote) {

        try {

            localStorage.setItem('edicao', 'S');

            const user = JSON.parse(localStorage.getItem('user-notes'));
            const idUser = user.id    
            const resultNotes = await api.get(`/notes/${idUser}`)

            for(let item of resultNotes.data.notes) {
                
                if(item.id === editNote) {
                    
                    localStorage.setItem('recadoId', editNote)

                    formRegisterNote.input_note_title.value = item.title
                    formRegisterNote.input_note_description.value = item.description
                }
            }
            
        } catch (error) {
            console.log(error)
        }

}

/**
 * apenas muda o valor setado no localstorage para 'N',
 * par controlar o botão editar/salvar 
 */
function criarUpdate() {

    localStorage.setItem('edicao', 'N');

}

/**
 * pega o recado selecionado no botão editar
 */
async function editNotes(idNote) {

    try {

        const user = JSON.parse(localStorage.getItem('user-notes'));
        const idUser = user.id

        const upNote = {
            title: formRegisterNote.input_note_title.value,
            description: formRegisterNote.input_note_description.value
        }

        const result = await api.put(`/notes/${idUser}/${idNote}`, upNote);
        
    } catch (error) {
        console.log(error)
    }

}

/**
 * deleta o recado selecionado
 */
async function deleteNote(idDeleteNotes) {

    try {

        const user = JSON.parse(localStorage.getItem('user-notes'));
        const idUser = user.id;

        const resultNotes = await api.get(`/notes/${idUser}`);

        let confirmDelete = confirm(`Are you sure you want to delete the post?`);

        if(confirmDelete) {
            let deleteNoteUser = await api.delete(`/notes/${idUser}/${idDeleteNotes}`)
            alert('Note successfully deleted!')        
        }

        listNotes();
        
    } catch (error) {
        console.log('deletar')
    }

}

btnRegisterNote.addEventListener('click', createNotes)

window.addEventListener('load', () => {


    const logged = document.getElementById('logged');

    const user = JSON.parse(localStorage.getItem('user-notes') ?? "{}");

    if(!user.id) {
        alert('You need to be logged in to access this page!!')
        location.href = "login.html"
    }

    logged.innerHTML = user.email;

    listNotes();

});

