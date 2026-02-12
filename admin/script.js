const popup = document.getElementById("pop-up");
const popupText = document.getElementById("pop-up-text");
const localhost = "https://localhost:7026/api/";
function showPopup(text, type = "neg", timeout = 3000) {
    popupText.textContent = text;

    popup.classList.remove("pos", "neg", "active");
    popup.classList.add(type);
    requestAnimationFrame(() => {
        popup.classList.add("active");
    });
    setTimeout(() => {
        popup.classList.remove("active");
    }, timeout);
}
async function load_orders(){
    // api/orders/ GET
	const url = localhost+"orders";
	try{
        const response = await fetch(url,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
            return null;
        } else{
            const result = await response.json();
            return result;
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
async function load_users(){
    // api/users/ GET
    const url = localhost+"user";

	try{
        const response = await fetch(url,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
            return null;
        } else{
            const result = await response.json();
            console.log(result);
            return result;
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
async function load_services(){
    // api/services/ GET
    const url = localhost+"service/all/services";
	try{
        const response = await fetch(url,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
            return null;
        } else{
            const result = await response.json();
            console.log(result);
            return result;
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
async function load_parts(){
    // api/part/ GET
	const url = localhost+"part/all_parts";
	try{
        const response = await fetch(url,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
            return null;
        } else{
            const result = await response.json();
            console.log(result);
            return result;
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
function renderUsers(users) {
    if(!Array.isArray(users)) return;
    const container = document.getElementById("users-list");
    container.innerHTML = "";
    users.forEach(user => {
        const row = document.createElement("div");
        row.className = "user-row";
        row.id = `user-${user.id}`;

        const login = document.createElement("span");
        login.className = "user-login";
        login.textContent = user.login;

        const role = document.createElement("span");
        role.className = "user-role";
        role.textContent = user.role;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "danger-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteUser(user.id);

        row.append(login, role, deleteBtn);
        container.appendChild(row);
    });
}
function renderServicesAdmin(services) {
    const container = document.getElementById("services-admin-list");
    container.innerHTML = "";

    services.forEach(service => {
        const item = document.createElement("div");
        item.className = "admin-item";
        item.id = `service-${service.id}`;

        // Name
        const name = document.createElement("input");
        name.type = "text";
        name.value = service.name;
        name.id = `service-name-${service.id}`;

        // === Time ===
        const timeLabel = document.createElement("label");
        timeLabel.className = "admin-field";

        const timeText = document.createElement("span");
        timeText.textContent = "Time: ";

        const timeInput = document.createElement("input");
        timeInput.type = "number";
        timeInput.value = service.estimatedTime;
        timeInput.id = `service-time-${service.id}`;

        timeLabel.append(timeText, timeInput);

        const priceLabel = document.createElement("label");
        priceLabel.className = "admin-field";

        const priceText = document.createElement("span");
        priceText.textContent = "Price: ";

        const priceInput = document.createElement("input");
        priceInput.type = "number";
        priceInput.value = service.price;
        priceInput.className = "item-price";
        priceInput.id = `service-price-${service.id}`;

        priceLabel.append(priceText, priceInput);

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.onclick = () => saveService(service.id);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "danger-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteService(service.id);

        item.append(
            name,
            timeLabel,
            priceLabel,
            saveBtn,
            deleteBtn
        );

        container.appendChild(item);
    });
}
function renderPartsAdmin(parts) {
    const container = document.getElementById("parts-admin-list");
    container.innerHTML = "";

    parts.forEach(part => {
        const item = document.createElement("div");
        item.className = "admin-item";
        item.id = `part-${part.id}`;

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = part.name;
        nameInput.id = `part-name-${part.id}`;

        const priceLabel = document.createElement("label");
        priceLabel.className = "admin-field";

        const priceText = document.createElement("span");
        priceText.textContent = "Price: ";

        const priceInput = document.createElement("input");
        priceInput.type = "number";
        priceInput.value = part.price;
        priceInput.className = "item-price";
        priceInput.id = `part-price-${part.id}`;

        priceLabel.append(priceText, priceInput);

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.onclick = () => savePart(part.id);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "danger-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deletePart(part.id);

        item.append(
            nameInput,
            priceLabel,
            saveBtn,
            deleteBtn
        );

        container.appendChild(item);
    });
}
function renderOrders(orders) {
    console.log(orders);
    const container = document.getElementById("orders-container");
	container.innerHTML="";
	orders.forEach(order => {

    	const orderDiv = document.createElement("div");
		
    	orderDiv.className = "order-card";
    	orderDiv.id = `order-${order.id}`;
    	orderDiv.dataset.orderId = order.id;
        orderDiv.dataset.status = order.status;
    	const autoInfo = document.createElement("div");
    	autoInfo.className = "order-auto";
    	autoInfo.innerHTML = `
    	    <strong>${order.auto.brand} ${order.auto.model}</strong><br>
    	    ${order.auto.year} • ${order.auto.number}<br>
    	    VIN: ${order.auto.vin}
    	`;

    	const statusSelect = document.createElement("select");
    	statusSelect.className = "order-status";
    	statusSelect.name = "status";
    	statusSelect.id = `status-${order.id}`;
        let date = "";
        if(order.completedAt !== null)
            date = new Date(order.completedAt).toDateString();
        
        const _completedAt = document.createElement("strong");
        _completedAt.innerText = date;

        let totalPrice = 0;

    	["Created", "InProgress", "Completed"].forEach(status => {
    	    const option = document.createElement("option");
    	    option.value = status;
    	    option.textContent = status;
    	    if (order.status === status) option.selected = true;
    	    statusSelect.appendChild(option);
    	});

    	const commentArea = document.createElement("textarea");
    	commentArea.className = "order-comment";
    	commentArea.name = "comment";
    	commentArea.id = `comment-${order.id}`;
    	commentArea.value = order.comment ?? "";
        
    	const servicesBlock = document.createElement("div");
    	servicesBlock.className = "order-services";
    	servicesBlock.id = `services-${order.id}`;
    	order.services.forEach(service => {
    	    const label = document.createElement("label");
    	    label.className = "service-item";
    	    label.style.display = "block";

    	    const checkbox = document.createElement("input");
    	    checkbox.type = "checkbox";
    	    checkbox.name = "serviceDone";
    	    checkbox.dataset.serviceId = service.id;
    	    
    	    checkbox.dataset.orderId = order.id;

    	    checkbox.checked = service.isDone === true;
            totalPrice+=service.price;
    	    label.append(
    	        `${service.name} (${service.price}) - ${service.master.login}`,
    	        checkbox
    	    );
           
    	    servicesBlock.appendChild(label);
    	});
        order.parts.forEach(part => {
    	    const label = document.createElement("label");
    	    label.className = "service-item";
    	    label.style.display = "block";
    	    
            totalPrice+=part.price;
    	    label.append(
    	        `${part.name} (${part.price})`
    	    );
           
    	    servicesBlock.appendChild(label);
    	});
        const _totalPrice = document.createElement("strong");
        _totalPrice.innerText = "Total Price: "+totalPrice;

    	const deleteBtn = document.createElement("button");
    	deleteBtn.innerText = "Delete";
    	deleteBtn.className = `danger-btn`;
    	deleteBtn.dataset.orderId = order.id;

    	deleteBtn.addEventListener("click", ()=>deleteOrder(order.id))

    	statusSelect.addEventListener("change", () => {
    	    orderDiv.dataset.status = statusSelect.value;
    	});
    	orderDiv.append(
    	    autoInfo,
    	    statusSelect,
            _completedAt,
    	    commentArea,
    	    servicesBlock,
            _totalPrice,
            deleteBtn,
    	);


    	container.appendChild(orderDiv);
	});
};
async function addUser(e) { 
	// api/user/ POST
	e.preventDefault(); 
	const formData = new FormData(e.target);

    const url = localhost+"user";

	try{
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
        		"Login":formData.get("login"),
        		"Password":formData.get("password"),
        		"Role":formData.get("role"),
	        })
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            const result = await response.json();
            console.log(result.id);
            renderUsers(await load_users());
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
	console.log({
		"Login":formData.get("login"),
		"Password":formData.get("password"),
		"Role":formData.get("role"),
	});
}
async function deleteUser(id) {
	// api/users/{id} DELETE
    const url = localhost+`user/${id}`;

	try{
        const response = await fetch(url,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            renderUsers(await load_users());
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
async function addService(e) { 
	// api/services/ POST
	e.preventDefault();
	const formData = new FormData(e.target);
    const url = localhost+"service/new-service";

	try{
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
	        	"Name":formData.get("name"),
	        	"Price":formData.get("price"),
	        	"EstimatedTime":formData.get("time"),
	        })
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            const result = await response.json();
            console.log(result.id);
            renderServicesAdmin(await load_services());
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
	console.log({
		"Name":formData.get("name"),
		"Price":formData.get("price"),
		"Time":formData.get("time"),
	});
}
async function saveService(id) {
	// api/service PUT
    let new_price = document.getElementById(`service-price-${id}`).value;
    let new_time = document.getElementById(`service-time-${id}`).value;
    let new_name = document.getElementById(`service-name-${id}`).value;
    const url = localhost+"service/update-service";

	try{
        const response = await fetch(url,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
	        	"Id":id,
	        	"Price":new_price,
	        	"Name":new_name,
	        	"EstimatedTime":new_time,
	        })
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            const result = await response.json();
            console.log(result.id);
            renderServicesAdmin(await load_services());
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }

}
async function deleteService(id) {
	// api/service/{id} DELETE
    const url = localhost+`service/delete-service/${id}`;

	try{
        const response = await fetch(url,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            renderServicesAdmin(await load_services());
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
async function addPart(e) { 
	// api/part/ POST
	e.preventDefault(); 
	const formData = new FormData(e.target);
    const url = localhost+"part/new-part";

	try{
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
	        	"Name":formData.get("name"),
	        	"Price":formData.get("price"),
	        })
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            const result = await response.json();
            console.log(result.id);

            renderPartsAdmin(await load_parts());
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
async function savePart(id) {
	// api/part/ PUT
    let new_price = document.getElementById(`part-price-${id}`).value;
    let new_name = document.getElementById(`part-name-${id}`).value;
    const url = localhost+"part/update-part";

	try{
        const response = await fetch(url,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
	        	"Id":id,
	        	"Price":new_price,
	        	"Name":new_name,
	        })
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            const result = await response.json();
            console.log(result.id);
            renderPartsAdmin(await load_parts());
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
async function deletePart(id) {
	// api/part/ DELETE
    const url = localhost+`part/by-partid/${id}`;

	try{
        const response = await fetch(url,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            renderPartsAdmin(await load_parts());
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
async function deleteOrder(id){
    // api/part/ DELETE
    const url = localhost+`orders/by-id/${id}`;

	try{
        const response = await fetch(url,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            renderOrders(await load_orders());
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
document.addEventListener("DOMContentLoaded",async ()=>{
    renderOrders(await load_orders());
    renderUsers(await load_users());
	renderPartsAdmin(await load_parts());
    renderServicesAdmin(await load_services());
})