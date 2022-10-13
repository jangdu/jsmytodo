const todoInputElem = document.querySelector('.todo-input');
const todoListElem = document.querySelector('.todo-list');
const completeAllBtnElem = document.querySelector('.complete-all-btn');
const leftItemsElem = document.querySelector('.left-items');
const showAllBtnElem = document.querySelector('.show-all-btn');
const showActiveBtnElem = document.querySelector('.show-active-btn');
const showCompletedBtnElem = document.querySelector('.show-completed-btn');
const clearCompletedBtnElem = document.querySelector('.clear-completed-btn');


let todos = [];
const setTodos = (newTodos) => {
    todos = newTodos;
}

let id = 0;
const setId = (newId) => id = newId;

let currentShowType = 'all';
showAllBtnElem.classList.add('selected');
const setCurrentShowType = (newShowType) => { currentShowType = newShowType; }

let isAllCompleted = false;
const setIsAllCompleted = (bool) => { isAllCompleted = bool };


// * 
const getAllTodos =  () => {
    return todos;
}
const getActiveTodos = () => {
    return todos.filter(todo => todo.isCompleted === false);
}
const getCompletedTodos = () => {
    return todos.filter(todo => todo.isCompleted === true);
}

const setLeftItems = () => {
    const leftTodos = getActiveTodos().length;
    leftItemsElem.innerHTML = `${leftTodos} items left`;
}

const completeAll = () => {
    completeAllBtnElem.classList.add('checked');
    const newTodos = getAllTodos().map(todo => ({...todo, isCompleted: true}));
    setTodos(newTodos);
}

const incompleteAll = () => {
    completeAllBtnElem.classList.remove('checked');
    const newTodos = getAllTodos().map(todo => ({...todo, isCompleted: false}));
    setTodos(newTodos);
}


// 전체 check여부
const checkIsAllCompleted = () => {
    if(getAllTodos.length === getCompletedTodos().length && getAllTodos.length !== 0){
        setIsAllCompleted(true);
        completeAllBtnElem.classList.add('checked');
    }else{
        setIsAllCompleted(false);
        completeAllBtnElem.classList.remove('checked');
    }
}

const onClickCompleteAll = () => {
    if(!getAllTodos().length) return; 
    if(isAllCompleted) {incompleteAll();
    } else {completeAll();}
    setIsAllCompleted(!isAllCompleted);
    paintTodos();
    setLeftItems();
}

const appendTodos = (text) => {
    const newId = id + 1;
    setId(newId);
    const newTodos = getAllTodos().concat({id: newId, isCompleted: false, content: text});
    setTodos(newTodos);
    checkIsAllCompleted();
    setLeftItems();
    paintTodos();
}

const deleteTodo = (todoId) => {
    const newTodos = getAllTodos().filter(todo => todo.id !== todoId);
    setTodos(newTodos); 
    setLeftItems();
    paintTodos();
}

const completeTodo = (todoId) => {
    const newTodos = getAllTodos().map(
        todo => todo.id === todoId ? {...todo, isCompleted: !todo.isCompleted} : todo)
    setTodos(newTodos);
    paintTodos();
    setLeftItems();
    checkIsAllCompleted();
}

const updateTodo = (text, todoId) => {
    const newTodos = getAllTodos().map(todo => todoId === todo.id ? ({...todo, content: text}) : todo);
    setTodos(newTodos);
    paintTodos();
}

const onDbclickTodo = (e, todoId) => {
    const todoElem = e.target;
    const inputText = e.target.innerText;
    const todoItemElem = todoElem.parentNode;
    const inputElem = document.createElement('input');
    inputElem.value = inputText;
    inputElem.classList.add('edit-input');

    inputElem.addEventListener('keypress', (e) => {
        if(e.key === 'Enter' && e.target.value.trim() !== ''){
            updateTodo(e.target.value, todoId);
            document.body.removeEventListener('click', onBodyClick);
        }
    })

    const onBodyClick = (e) => {
        if(e.target !== inputElem) {
            todoItemElem.removeChild(inputElem);
            document.body.removeEventListener('click', onBodyClick);
        }
    }
    document.body.addEventListener('click', onBodyClick);
    todoItemElem.appendChild(inputElem);
}

const clearComplietedTodos =() => {
    const newTodos = getActiveTodos();
    setTodos(newTodos);
    paintTodos();
}


const paintTodo = (todo) => {
    const todoItemElem = document.createElement('li');
    todoItemElem.classList.add('todo-item');
    todoItemElem.setAttribute('data-id', todo.id);

    const checkboxElem = document.createElement('div');
    checkboxElem.classList.add('checkbox');
    checkboxElem.addEventListener('click', () => completeTodo(todo.id));

    const todoElem = document.createElement('div');
    todoElem.classList.add('todo');
    todoElem.addEventListener('dblclick', (event) => onDbclickTodo(event, todo.id)) 
    todoElem.innerText = todo.content;

    const delBtnElem = document.createElement('button');
    delBtnElem.classList.add('delBtn');
    delBtnElem.addEventListener('click', () => deleteTodo(todo.id));
    delBtnElem.innerText = "X";

    if(todo.isCompleted){
        todoItemElem.classList.add('checked');
    }

    todoItemElem.appendChild(checkboxElem);
    todoItemElem.appendChild(todoElem);
    todoItemElem.appendChild(delBtnElem);

    todoListElem.appendChild(todoItemElem);

}

const paintTodos = () => {
    todoListElem.innerHTML = null;

    switch (currentShowType) {
        case 'all':
            const allTodos = getAllTodos();
            allTodos.forEach(todo => {paintTodo(todo);});
            break;
        case 'active':
            const activeTodos = getActiveTodos();
            activeTodos.forEach(todo => {paintTodo(todo);});
            break;
        case 'completed':
            const completedTodos = getCompletedTodos();
            completedTodos.forEach(todo => {paintTodo(todo);});
        default:
            break;
    }
}


const onClickShowTodosType = (e) => {
    const currentBtnElem = e.target;
    const newShowType = currentBtnElem.dataset.type;
    if (currentShowType === newShowType) return;
    const preBtnElem = document.querySelector(`.show-${currentShowType}-btn`);
    preBtnElem.classList.remove('selected');
    currentBtnElem.classList.add('selected');
    setCurrentShowType(newShowType);
    paintTodos();
}

//todos.js 실행시 바로 실행하는 함수
const init = () => {
    todoInputElem.addEventListener('keypress', (e) => {
        if( e.key === 'Enter' && e.target.value.trim() !== ''){
            appendTodos(e.target.value); e.target.value ='';
        }
    })
    showAllBtnElem.addEventListener('click', onClickShowTodosType);
    showActiveBtnElem.addEventListener('click', onClickShowTodosType);
    showCompletedBtnElem.addEventListener('click', onClickShowTodosType);
    clearCompletedBtnElem.addEventListener('click', clearComplietedTodos);
    completeAllBtnElem.addEventListener('click', onClickCompleteAll);
    setLeftItems();
}

init();