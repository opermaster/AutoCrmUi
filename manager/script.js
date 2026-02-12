document.getElementById("clientForm")
    .addEventListener("submit",createClient);
document.getElementById("autoForm")
    .addEventListener("submit",createAuto);
document.getElementById("orderForm")
    .addEventListener("submit",createOrder);
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


let selectedServices = [];
let selectedParts = [];
async function createClient(e){
    // api/client POST
    e.preventDefault();

    const formData = new FormData(e.target);

    const client = {
        FirstName: formData.get("firstName"),
        LastName: formData.get("lastName"),
        Phone: formData.get("phone")
    };

    const url = localhost+"client";

	try{
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                FirstName: formData.get("firstName"),
                LastName: formData.get("lastName"),
                Phone: formData.get("phone")
            })
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            const result = await response.json();
            console.log(result.id);
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }

    console.log(client);
    clientForm.reset();
}

async function createAuto(e){
    // api/autos POST
    e.preventDefault();

    const formData = new FormData(e.target);
    const auto = {
        ClientPhone: formData.get("phone"),
        Brand: formData.get("brand"),
        Model: formData.get("model"),
        Year: formData.get("year"),
        VIN: formData.get("vin"),
        Number: formData.get("number")
    };
    const url = localhost+"auto/new_auto";

	try{
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                PhoneNumber: formData.get("phone"),
                Brand: formData.get("brand"),
                Model: formData.get("model"),
                Year: Number(formData.get("year")),
                VIN: formData.get("vin"),
                Number: formData.get("number")
            })
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            const result = await response.json();
            console.log(result.id);
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
    console.log(auto);

    autoForm.reset();
}
async function createOrder(e){
    e.preventDefault();

    const formData = new FormData(e.target);
    // api/orders POST
    const orderDto = {
        CreatedAt: new Date().toISOString(),
        CompletedAt: null,
        Status: "Created",
        AutoNumber: formData.get("autoNumber"),
        Comment: formData.get("Comment")
    };

    let url = localhost+"orders/new_order";
    let newOrderId = -1;
	try{
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                CreatedAt: new Date().toISOString(),
                CompletedAt: null,
                Status: "Created",
                Number: formData.get("autoNumber"),
                Comment: formData.get("Comment")
            })
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            const result = await response.json();
            newOrderId = result.id;
            console.log(result.id);
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
        return;
    }

    // return newOrderId from `api/orders POST`

    const servicesPayload = {
        orderId: newOrderId,
        ServiceIds: [],
        MasterIds: [],
    };

    if(newOrderId ===-1) return;
    
    
    document.querySelectorAll("input[name='services']:checked")
    .forEach(cb => {
        const serviceId = Number(cb.value);

        const masterSelect = document.querySelector(
            `select[data-service-id="${serviceId}"]`
        );

        if (!masterSelect || !masterSelect.value) {
            showPopup(`Master not selected for service ${serviceId}`,"neg");
        }

        servicesPayload.ServiceIds.push(serviceId);
        servicesPayload.MasterIds.push(Number(masterSelect.value));
    });

    url = localhost+"orders/add-services";
    // api/orders/add-services POST
    try{
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify(servicesPayload)
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
            return;
        } else{

        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
        return;
    }
    const partsPayload = {
        orderId: newOrderId,
        PartIds: [],
        Quantities: [], 
    };

    document.querySelectorAll("input[name='parts']:checked")
    .forEach(cb => {
        const partId = Number(cb.value);

        const qtyInput = document.querySelector(
            `input[data-part-id="${partId}"]`
        );

        const quantity = qtyInput ? Number(qtyInput.value) : 1;

        partsPayload.PartIds.push(partId);
        partsPayload.Quantities.push(quantity);
    });

    url = localhost+"orders/add-parts";
    // api/orders/add-parts POST
    try{
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify(partsPayload)
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
            return;
        } else{

        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
        return;
    }
    console.log("SERVICES PAYLOAD:", servicesPayload);
    console.log("PARTS PAYLOAD:", partsPayload);

    alert("Заказ создан. Смотри console.log");
}

async function getClients() {
    // api/clients GET
    const url = localhost+"client";

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
function saveClients(clients) {
    localStorage.setItem("clients", JSON.stringify(clients));
}
function generateId() {
    return crypto.randomUUID();
}

async function getServices() {
    // api/parts GET
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
async function loadServices() {
    const services =await getServices();
    const masters = await getMasters();
    const container = document.getElementById("services-list");
    container.innerHTML = "";

    services.forEach(service => {
        const wrapper = document.createElement("div");
        wrapper.className = "service-row";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "services";
        checkbox.value = service.id; 
        checkbox.dataset.price = service.price;

        const labelText = document.createElement("span");
        labelText.textContent = `${service.name} (${service.price})`;

        const select = document.createElement("select");
        select.className = "service-master-select";
        select.dataset.serviceId = service.id; 

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select master";
        select.appendChild(defaultOption);

        masters.forEach(m => {
            const option = document.createElement("option");
            option.value = m.id;
            option.textContent = m.login;
            select.appendChild(option);
        });

        select.disabled = true;

        checkbox.addEventListener("change", () => {
            select.disabled = !checkbox.checked;
        });

        wrapper.append(checkbox, labelText, select);
        container.appendChild(wrapper);
    });
}

async function getParts() {
    // api/parts GET
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

async function loadParts() {
    const parts = await getParts();
    const container = document.getElementById("parts-list");
    container.innerHTML = "";

    parts.forEach(p => {
        const label = document.createElement("label");
        label.style.display = "block";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "parts";
        checkbox.value = p.id;
        checkbox.dataset.price = p.price;

        label.appendChild(checkbox);
        label.append(` ${p.name} (${p.price})`);

        container.appendChild(label);
    });
}
async function getMasters() {
    const url = localhost+"user/masters";
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
        } else{
            const result = await response.json();
            console.log(result);
            return result;

        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
        return;
    }
}
document.addEventListener("DOMContentLoaded",async ()=>{
    await loadServices();
    await loadParts();
})