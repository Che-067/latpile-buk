let todoList =  [];

function addTodoList() {
 let frauHTML =[];
  for( i = 0; i < todoList.length; i++) {
  let mannObject = todoList[i];
//  let name = mannObject.name;
// let dueDate = mannObject.dueDate;
let { name,dueDate } = mannObject;

let todo =  `
<div> ${name} </div>
<div> ${dueDate} </div> 
<button class="delete-button" onclick="
todoList.splice(${i},1);
addTodoList();

">Delete</button>`;

  frauHTML += todo;
  console.log(frauHTML);
   document.querySelector('.display-todo').innerHTML = frauHTML;
  } 
  }
  function renderTodo() {
    let sere = document.querySelector('.input-key');
    const thor = sere.value;
   
    const dateElement = document.querySelector('.calender');
    const dispDate = dateElement.value;
    todoList.push({
      name: thor,
      dueDate: dispDate
    } ); 
    console.log(todoList);
    
    addTodoList();
    sere.value = '';
  }