// JavaScript
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

const users = {
  alpha: {
    todos: []
  },
  beta: {
    todos: []
  },
  charlie: {
    todos: []
  }
};

  //add the logic here for switching user based on which button is clicked i.e alpha beta or charlie
  // use if else for this and call the switch user function based on what button is clicked

  function checkuser(activeUser){

    let alpha="alpha";
    let beta="beta";
    let charlie="charlie";

    if(activeUser=== "alpha"){
      switchUser(alpha);
    }
    else if(activeUser==="beta"){
      switchUser(beta);
     
    }
    else if(activeUser==="charlie"){

      switchUser(charlie);
    }
  }



// Set initial user to Alpha
let currentUser = "alpha";

let todoIdCounter = 0; // Initialize a counter for unique todo IDs

function switchUser(activeUser) {
  inputBox.value = ""; // Clear input box before switching user
  currentUser = activeUser;

   // Get the index of the current user
   const currentIndex = Object.keys(users).indexOf(currentUser);

   // Generate the title based on the current user's index
   const titleNumber = (currentIndex + 1).toString().padStart(2, "0");
   const title = `TO DO LIST #${titleNumber}`;
 
   // Update the heading with the generated title
   document.getElementById("heading").textContent = title;


  // Render the todos for the selected user
  showlist();
}

function getUserData() {
  return users[currentUser];
}

function addtask() {
  if (inputBox.value === "") {
    alert("You should add your task! ");
  } else {
    const currentUserData = getUserData();
    const newTodo = 
                  { 
                      id: ++todoIdCounter, 
                      task: inputBox.value, 
                      checked: false 
                  };
                  
    currentUserData.todos.push(newTodo);
    savedata();
    showlist(); // Update the list when adding a new task
  }
  inputBox.value = "";
}

listContainer.addEventListener("click", function (e) {

  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    savedata();
  } else if (e.target.classList.contains("cross-span")) {
    const todoId = parseInt(e.target.dataset.todoId, 10);
    const currentUserData = getUserData();

    currentUserData.todos = currentUserData.todos.filter((todo) => {
      return todo.id !== todoId;
    });

    savedata();
    showlist();
  }
}, false);


function savedata() {
  localStorage.setItem("data", JSON.stringify(users));
}

function showlist() {
  const currentUserData = getUserData();
  listContainer.innerHTML = "";

  if (currentUserData.todos.length === 0) {
    const messageLi = document.createElement("p");
    messageLi.textContent = "No tasks to display.";
    listContainer.appendChild(messageLi);
    return; 
  }

  // Check if the current user is "beta" (second list)
  const isSecondList = currentUser === "beta";
  // Check if the current user is "charlie" (third list)
  const isThirdList = currentUser === "charlie";

  currentUserData.todos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.innerHTML = todo.task;

    if (todo.checked) {
      li.classList.add("checked");
    }

    listContainer.appendChild(li);

    const crossSpan = document.createElement("span");
    crossSpan.innerHTML = "\u00d7";
    crossSpan.dataset.todoId = todo.id;
    crossSpan.classList.add("cross-span");
    li.appendChild(crossSpan);


    if (isSecondList) {
      
      const arrowsContainer = document.createElement("span");
      arrowsContainer.classList.add("arrows-container");

      //forward arrow
      const arrowBackwardSpan = document.createElement("span");
      arrowBackwardSpan.innerHTML = "\u2190";
      arrowBackwardSpan.classList.add("arrowss-icon");
      arrowBackwardSpan.dataset.todoId = todo.id;//adding id attribute here dynamically to each todo
      arrowsContainer.appendChild(arrowBackwardSpan);

      arrowBackwardSpan.addEventListener("click",(e)=>{
        const todoId = parseInt(e.target.dataset.todoId);// get the todoId
        transferTodo(todoId,"alpha");
      });

   
      
      
      //backward arrow
      const arrowForwardSpan = document.createElement("span");
      arrowForwardSpan.innerHTML = "\u2192";
      arrowForwardSpan.classList.add("arrows-icon");
      arrowForwardSpan.dataset.todoId = todo.id;//adding id attribute here dynamically to each todo
      arrowsContainer.appendChild(arrowForwardSpan);

      arrowForwardSpan.addEventListener("click",(e)=>{
        const todoId = parseInt(e.target.dataset.todoId);// get the todoId
        transferTodo(todoId,"charlie");
      });

      //both arrows left/right here
      li.appendChild(arrowsContainer);
      


      
    } else if (isThirdList) {
      // For the third list, show only the backward arrow
      const arrowBackwardSpan = document.createElement("span");
      arrowBackwardSpan.innerHTML = "\u2190";
      arrowBackwardSpan.classList.add("arrow-icon");
      arrowBackwardSpan.dataset.todoId = todo.id;//adding id attribute here dynamically to each todo
      li.appendChild(arrowBackwardSpan);

      arrowBackwardSpan.addEventListener("click",(e)=>{
        const todoId = parseInt(e.target.dataset.todoId);// get the todoId
        transferTodo(todoId,"beta");
      });

    } 
    
    else {
      // For other lists, show only the forward arrow (alpha)
      const arrowSpan = document.createElement("span");
      arrowSpan.innerHTML = "\u2192";
      arrowSpan.classList.add("arrow-icon");
      arrowSpan.dataset.todoId = todo.id;//adding id attribute here dynamically to each todo
      li.appendChild(arrowSpan);

      arrowSpan.addEventListener("click",(e)=>{
        const todoId = parseInt(e.target.dataset.todoId);// get the todoId
        console.log(todoId);
        transferTodo(todoId,"beta");
        
      });


    }

  });
}


function transferTodo(todoId, toUser) {

  const currentUserData = getUserData();
  const todoIndex = currentUserData.todos.findIndex((todo) => {
    return todo.id === todoId;
  });

  if (todoIndex !== -1) {
    const todoToShift = currentUserData.todos[todoIndex];

    currentUserData.todos.splice(todoIndex, 1); // Remove todo from the current user's todos array

    users[toUser].todos.push(todoToShift); // Add the todo to the target user's todos array

    //update the data and show it
    showlist();
    savedata();
  }
}






// Load the data for each user from localStorage
function loadDataFromLocalStorage() {
  const data = localStorage.getItem("data");

  if (data) {//agr data hua tow hi run hoga ye
    const Data = JSON.parse(data);

    Object.keys(users).forEach((user) => {
      if (Data[user]) {
        users[user].todos = Data[user].todos;// this will render the data from local storage to todos array of a object user and save in current user todos array
      } else {
        // Set default todos for each user if Data[user] is empty
        users[user].todos = [];
      }
    });
  } else {
    // Set default todos for each user if there is no data in localStorage
    Object.keys(users).forEach((user) => {
      users[user].todos = [];
    });
  }
}


// Call the loadDataFromLocalStorage and showlist functions after the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  loadDataFromLocalStorage();
  showlist();
});



function gotoNextLists() {
  const totalLists = 3;
  let currentIndex = Object.keys(users).indexOf(currentUser);
  let nextIndex = (currentIndex + 1) % totalLists;  //yahan current user ki index mai sai aik plus hoga tow agy jaiga
  let nextUser = Object.keys(users)[nextIndex];//ye object ka nam pass kry ga jaise index 1 pr agr alpha tow wo alpha pass hojaiga switch user mai
  switchUser(nextUser);
}

function gotoPreviousLists() {
  const totalLists = 3;
  let currentIndex = Object.keys(users).indexOf(currentUser);
  let previousIndex = (currentIndex - 1 + totalLists) % totalLists; //yahan current user ki index mai sai aik minus hoga tow pechy jaiga
  let previousUser = Object.keys(users)[previousIndex];
  switchUser(previousUser);
}


