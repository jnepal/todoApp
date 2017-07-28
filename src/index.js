import axios from 'axios';
import * as httpUtil from './httpUtil';


class Index{

	constructor(){
		this.BASE_URL = 'https://todo-simple-api.herokuapp.com';
		this.TODO_URL =  `${this.BASE_URL}/todos`;
		this.TODO_URL_WITH_PAGE = `${this.BASE_URL}/todos?page=1&page_size=1000`;
		this.data;
		this.isFormSubmit = false;

		this.view();
		this.save();
		
	}

	view(){
		httpUtil.get(this.TODO_URL_WITH_PAGE).then(response => {

			let table = document.getElementById('todo-table');


		  response.data.data.forEach((todo, index) => {

		    let tr = document.createElement('tr');
			let num = document.createElement('td')
			num.innerHTML = index+1;
			let title = document.createElement('td');
			title.innerHTML = todo.title;
			let description = document.createElement('td');
			description.innerHTML = todo.description;
			let isCompleted = document.createElement('td');
			isCompleted.innerHTML = todo.isComplete;
			let editButton = document.createElement('button');
			editButton.setAttribute('id', 'editButton');
			editButton.className = "btn btn-info";
			editButton.innerHTML = "Edit";
			let deleteButton = document.createElement('button');
			deleteButton.setAttribute('id', 'deleteButton');
			deleteButton.className = "btn btn-warning"
			deleteButton.innerHTML = "Delete"

			tr.appendChild(num)
			tr.appendChild(title);
			tr.appendChild(description);
			tr.appendChild(isCompleted);
			tr.appendChild(editButton);
			tr.appendChild(deleteButton);

			table.appendChild(tr);

			deleteButton.addEventListener('click', (e) => {
				this.remove(todo.id);
			});

			editButton.addEventListener('click', (e) => {
				this.update(todo);
			});

		  })
		});
	}

	save(){		
		
		this.formHandlePost();

	}

	update(todo){
		let saveButton = document.getElementById('submit');
		saveButton.style.display = 'none';

		let updateButton = document.getElementById('update');
		updateButton.style.display = 'block';

		this.formHandleUpdate(todo);		
		
	}

	remove(id){
		confirm('Are You Sure ?');

		
		httpUtil.remove(this.TODO_URL+'/'+id).then(response => {
			console.log(response);
		});
	}

	formHandlePost(){
		let form = document.getElementById('add-form');
		let button = document.getElementById('close');
		let addButton = document.getElementById('submit');

		addButton.addEventListener('click', (event) => {
			this.isFormSubmit = true;
			event.preventDefault();
			button.click();
			let title = form.title.value;
			let description = form.description.value;
			let created_at = form.created_at.value;
			let isComplete = form.is_complete.value;

			if(isComplete === "false"){
				isComplete = false;
			}

			if(isComplete === "true"){
				isComplete = true;
			}

			this.data = {
	           "title": title,
	           "description": description,
	           "isComplete": isComplete,
	           "createdAt": created_at,
			};

			httpUtil.post(this.TODO_URL, this.data).then(response => {
				console.log(response);
			});

		});
	}

	formHandleUpdate(todo){
		let date = new Date(todo.createdAt);
		let year = date.getFullYear();
		let month = String(date.getMonth() + 1);
		let day = String(date.getDate());
		
		if(month.length === 1){
			month = '0'+month
		}
		if(day.length === 1){
			day = '0'+day;
		}

		let dateValue = year+'-'+month+'-'+day ;

		// let addButton = document.getElementById('addModal');

		let updateButton = document.getElementById('update');
		let label = document.getElementById('myModalLabel');
		let editForm = document.getElementById('add-form');

		

		editForm.title.setAttribute('value', todo.title);
		editForm.description.innerHTML = todo.description;
		editForm.created_at.setAttribute('value', dateValue);

		if(todo.isComplete === true){
			editForm.is_complete.options[1].selected = true;
		}

		if(todo.isComplete === true){
			editForm.is_complete.options[0].selected = true;
		}


		label.innerHTML = 'Edit '+todo.title;

		document.getElementById('add-button').click()

		let button = document.getElementById('close');
		editForm.addEventListener('submit', (event) => {
			event.preventDefault();
			button.click();
			let title = editForm.title.value;
			let description = editForm.description.value;
			let created_at = editForm.created_at.value;
			let isComplete = editForm.is_complete.value;

			if(isComplete === "false"){
				isComplete = false;
			}

			if(isComplete === "true"){
				isComplete = true;
			}

			let data = {
	           "title": title,
	           "description": description,
	           "isComplete": isComplete,
	           "createdAt": created_at,
			};

			httpUtil.put('https://todo-simple-api.herokuapp.com/todos/'+todo.id, data).then(response => {
				console.log(response);
			});
		});
	}

		
}

let index = new Index();


