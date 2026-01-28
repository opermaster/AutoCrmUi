const localhost = "https://localhost:7026/api/";
const popup = document.getElementById("pop-up");
const popupText = document.getElementById("pop-up-text");
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
    // api/orders GET
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
function renderOrder(orders) {
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

    	    label.append(
    	        `${service.name} (${service.price}) `,
    	        checkbox
    	    );

    	    servicesBlock.appendChild(label);
    	});


    	const editBtn = document.createElement("input");
    	editBtn.type = "button";
    	editBtn.value = "Edit";
    	editBtn.id = `edit-btn-${order.id}`;
    	editBtn.className = `order-edit-btn`;
	
    	editBtn.dataset.orderId = order.id;

    	editBtn.addEventListener("click", ()=>editOrder(order.id))
    	statusSelect.addEventListener("change", () => {
    	    orderDiv.dataset.status = statusSelect.value;
    	});
    	orderDiv.append(
    	    autoInfo,
    	    statusSelect,
    	    commentArea,
    	    servicesBlock,
    	    editBtn
    	);


    	container.appendChild(orderDiv);
	});
};
async function editOrder(orderId){
    const status = document.getElementById(`status-${orderId}`).value;
    const comment = document.getElementById(`comment-${orderId}`).value;

    const servicesDone = [];
    document
        .querySelectorAll(`#services-${orderId} input[type='checkbox']`)
        .forEach(cb => {
            servicesDone.push({
                serviceId: cb.dataset.serviceId,
                done: cb.checked
            });
        });
	
    console.log("SAVE ORDER:", {
        orderId,
        status,
        comment,
        servicesDone
    });
	let url = localhost+"orders"
	try{
        const response = await fetch(url,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
    		    orderId:orderId,
    		    status:status,
    		    comment:comment,
    		    servicesDone:servicesDone
    		})
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
			renderOrder(await load_orders());
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
	
}

document.addEventListener("DOMContentLoaded",async ()=>{
    renderOrder(await load_orders());
})