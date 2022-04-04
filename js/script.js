'use strict'

const data = [
    {
        "id": 1,
        "task": "Item nùmero 1"
    },
    {
        "id": 2,
        "task": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci obcaecati ea laboriosam iusto ab nam, eum quam praesentium officia tempore consectetur eos nemo rem consequatur ipsum voluptates ullam? Quas maxime animi, velit dicta veritatis vitae voluptate libero nam cumque assumenda."
    },
    {
        "id": 3,
        "task": "Item nùmero 2"
    },
    {
        "id": 4,
        "task": "Item nùdhsjhdjshdjsh"
    },
]

let numberOfTask = data.length

const titleHeading = document.getElementById('title-heading')
const inputTask = document.getElementById('input-task')
const submitTask = document.getElementById('submit-task')
const list = document.getElementById('list')

titleHeading.textContent = `(${numberOfTask})`

submitTask.addEventListener('click', () => {
    numberOfTask++
    data.push({
        "id" : `${numberOfTask}`,
        "task" : `${inputTask.value}`
    })
    console.log(data);
    // location.reload()
})

data.forEach(element => {
    list.innerHTML += `<li>
                        ${element.task}
                        <div class='to-container__content__list__btnwrapper'>
                            <button>edit</button>
                            <button>&cross;</button>
                        </div>
                    </li>`
})