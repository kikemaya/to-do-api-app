'use strict'

const D = document
const TITLE_HEADING = D.getElementById('title-heading')
const INPUT_TASK = D.getElementById('input-task')
const SUBMIT_TASK = D.getElementById('submit-task')
const LIST = D.getElementById('list')
const HIDDEN = D.getElementById('hidden')
const A_WARNING = D.getElementById('a-warning')
const A_ERROR = D.getElementById('a-error')

const fare = () => {

    return Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    })
    .then((res) => res)

}

const CLEAN_INPUT_TASK = () => {

    HIDDEN.value = ''
    INPUT_TASK.value = ''
    location.reload()

}

const SHOW_ALERT_ERR = (err, msg) => {

    let message = err.statusText || msg;
    A_ERROR.classList.remove('hidden')
    const parrafoErr = D.createElement('p')
    parrafoErr.textContent = `${message} Estatus: ${err.status}.`
    A_ERROR.appendChild(parrafoErr)
    setTimeout(() => {
        A_ERROR.classList.add('hidden')
        A_ERROR.removeChild(parrafoErr)
    }, 5000);

}

const GET_ALL = async () => {
    
    try {
        let res = await fetch('http://localhost:3000/data')
        let json = await res.json();

        let numberOfTask = json.length

        TITLE_HEADING.textContent = `(${numberOfTask})`

        if (!res.ok) {
            TITLE_HEADING.textContent = `(0)`
            throw { status: res.status, statusText: res.statusText }
        };

        json.forEach(el => {

            const LI = D.createElement('li')
            const LI_DIV = D.createElement('div')
            
            const B_DIV = D.createElement('div')
            const B_EDIT = D.createElement('button')
            const B_DEL = D.createElement('button')

            const LI_TEXT = D.createTextNode(`${el.task}`)
            
            B_DIV.classList.add('to-container__content__list__btnwrapper')
            
            LI_DIV.classList.add('container-li')
            B_EDIT.classList.add('edit')
            B_DEL.classList.add('delete')

            B_EDIT.dataset.id = `${el.id}`
            B_EDIT.dataset.task = `${el.task}`
    
            B_DEL.dataset.id = `${el.id}`
            
            B_EDIT.textContent = "edit"
            B_DEL.textContent = "delete"

            LI_DIV.appendChild(LI_TEXT)
            B_DIV.append(B_EDIT, B_DEL)
            
            LI.append(LI_DIV, B_DIV)

            LIST.append(LI)

        });

    } catch (err) {
        SHOW_ALERT_ERR(err, 'Ocurrió un error al traer los datos.')
    }

}

D.addEventListener('DOMContentLoaded', GET_ALL)

SUBMIT_TASK.addEventListener('click', async e => {

    if (e.target === SUBMIT_TASK && INPUT_TASK.value != '') {

        if (!HIDDEN.value) {

            try {

                let options = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        "task": INPUT_TASK.value
                    })
                }

                let res = await fetch('http://localhost:3000/data', options)
                await res.json();

                if (!res.ok) throw { status: res.status, statusText: res.statusText };

                CLEAN_INPUT_TASK()

            } catch (err) {
                SHOW_ALERT_ERR(err, 'Ocurrió un error al subir los datos.')
            }

        } else {

            try {
                let options = {
                    method: "PUT",
                    headers: {

                        "Content-type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        "task": INPUT_TASK.value
                    })
                }

                let res = await fetch(`http://localhost:3000/data/${HIDDEN.value}`, options)
                await res.json();

                if (!res.ok) throw { status: res.status, statusText: res.statusText };

                CLEAN_INPUT_TASK()

            } catch (err) {
                SHOW_ALERT_ERR(err, 'Ocurrió un error interno al editar los datos.')
            }
        }
    }
});

D.addEventListener('click', async e => {

    if (e.target.matches('.edit')) {

        SUBMIT_TASK.textContent = 'Update'
        INPUT_TASK.value = e.target.dataset.task
        HIDDEN.value = e.target.dataset.id
        INPUT_TASK.focus()

    }
    if (e.target.matches('.delete')) {

        try {
            const IS_DELETED = await fare()

            if (IS_DELETED.isConfirmed) {
                let options = {
                    method: "DELETE",
                    headers: {

                        "Content-type": "application/json; charset=utf-8"
                    }
                },
                    res = await fetch(`http://localhost:3000/data/${e.target.dataset.id}`, options),
                    json = await res.json();

                if (!res.ok) throw { status: res.status, statusText: res.statusText }
            }

        } catch (err) {
            SHOW_ALERT_ERR(err, 'Ocurrió un error al seliminar los datos.')
        }
    }

});