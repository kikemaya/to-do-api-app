'use strict'
    
const titleHeading = document.getElementById('title-heading')
const inputTask = document.getElementById('input-task')
const submitTask = document.getElementById('submit-task')
const list = document.getElementById('list')

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

        // console.log(json);

        json.forEach(el => {
            list.innerHTML += `<li>
                                ${el.task}
                               <div class='to-container__content__list__btnwrapper'>
                                    <button>edit</button>
                                    <button>&cross;</button>
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

document.addEventListener("DOMContentLoaded", getAll)

submitTask.addEventListener("click", async e => {
    if(e.target === submitTask && inputTask.value != '') {
        //  Create - POST
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
            
            location.reload();

        } catch (err) {
            let message = err.statusText || "Ocurriò un error";
            console.log(err.status, message);
        } 

    }
});
