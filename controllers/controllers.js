'use strict'
    
const d = document
const titleHeading = d.getElementById('title-heading')
const inputTask = d.getElementById('input-task')
const submitTask = d.getElementById('submit-task')
const list = d.getElementById('list')
const hidden = d.getElementById('hidden')

const getAll = async () => {

    try {
        let res = await fetch("http://localhost:3000/data")
        let json = await res.json();

        let numberOfTask = json.length

        titleHeading.textContent = `(${numberOfTask})`

        if (!res.ok) {
            titleHeading.textContent = `(0)`
            throw { status: res.status, statusText: res.statusText }
        };

        json.forEach(el => {
            // console.log(el.id);
            list.innerHTML += `<li>
                                ${el.task}
                               <div class='to-container__content__list__btnwrapper'>
                                    <button class="edit" data-id="${el.id}" data-task="${el.task}">edit</button>
                                    <button class="delete" data-id="${el.id}" data-task="${el.task}">&cross;</button>
                                </div>
                                </li>`
        });

        return json;

    } catch (err) {
        let message = err.statusText || "Ocurriò un error";
        return console.log(err.status, message);
        // $table.insertAdjacentElement("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    }

}

d.addEventListener("DOMContentLoaded", getAll)

submitTask.addEventListener("click", async e => {
    if(e.target === submitTask && inputTask.value != '') {
        //  Create - POST
        if (!hidden.value) {
            console.log(e.target.dataset.id);
            try {
                
                let options = {
                    method: "POST",
                    headers: {
                        //Las cabeceras determinan el tipo de formato que se espera recibir para la interaccion con la API
                        "Content-type" : "application/json; charset=utf-8" 
                    },
                    body: JSON.stringify({
                        "task": inputTask.value
                    })
                }
                
                let res = await fetch("http://localhost:3000/data", options)
                await res.json();
    
                if (!res.ok) throw { status: res.status, statusText: res.statusText };
                
                hidden.value = ""
                inputTask.value = ""
                location.reload()
    
            } catch (err) {
                let message = err.statusText || "Ocurriò un error";
                console.log(err.status, message);
            } 
            
        } else {

            try {  
                let options = {
                    method: "PUT",
                    headers: {
                        //Las cabeceras determinan el tipo de formato que se espera recibir para la interaccion con la API
                        "Content-type" : "application/json; charset=utf-8" 
                    },
                    body: JSON.stringify({
                        "task": inputTask.value
                    })
                }
                
                let res = await fetch(`http://localhost:3000/data/${hidden.value}`, options)
                await res.json();
    
                if (!res.ok) throw { status: res.status, statusText: res.statusText };
                
                inputTask.value = ""
                hidden.value = ""
                location.reload();
    
            } catch (err) {
                let message = err.statusText || "Ocurriò un error";
                console.log(err.status, message);
            } 
        }
    }
});


d.addEventListener("click", async e => {

    if (e.target.matches(".edit")) {
    
        submitTask.textContent = "Update"
        inputTask.value = e.target.dataset.task
        hidden.value = e.target.dataset.id
        inputTask.focus()        

    }
    if (e.target.matches(".delete")) {

        let isDelete = confirm(`¿Estàs seguro de eliminar el id ${e.target.dataset.id}?`);

        if (isDelete) {
            //Delete - DELETE
            try {
                let options = {
                    method: "DELETE",
                    headers: {
                        //Las cabeceras determinan el tipo de formato que se espera recibir para la interaccion con la API
                        "Content-type" : "application/json; charset=utf-8" 
                    }                            
                },
                res = await fetch(`http://localhost:3000/data/${e.target.dataset.id}`, options),
                json = await res.json();

                if (!res.ok) throw { status: res.status, statusText: res.statusText };
                
                location.reload();
            } catch (err) {
                let message = err.statusText || "Ocurriò un error";
                console.log(err.status, message);
                // $form.insertAdjacentElement("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
            }
        }
    }
});