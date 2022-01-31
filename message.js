console.log("Conectado");


const getNewToken = async () => {
    let dataAuth = {
        clientid: "admin-cli",
        clientsecret: "43f03d37-23f3-4300-9a29-f07c0886829c",
    };

    const details = {
        grant_type: "password",
        username: "admin",
        password: "Pablo092100$98",
        scope: "openid",
    };

    var formBody = [];
    for (let property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    console.log(formBody);

    const responsetoken = await fetch(
        "http://localhost:8080/auth/realms/master/protocol/openid-connect/token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization:
                    "Basic " + btoa(dataAuth.clientid + ":" + dataAuth.clientsecret),
            },
            body: formBody,
        }
    );
    let token = await responsetoken.json();
    return token.access_token;
}


const getAllRealms = async () => {
    let config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getNewToken()}`
        }
    };
    const response = await fetch("http://localhost:8080/auth/admin/realms",config);
    const result = await response.json(); 
    return result;
}

const getAllGroup = async () => {
    let config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getNewToken()}`
        }
    };
    const response = await fetch("http://localhost:8080/auth/admin/realms/TECNOLOGIA/groups/",config);
    const result = await response.json(); 
    return result;
}

const getAllUsers = async (realm, idgroup) => {
    let config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getNewToken()}`
        }
    };
    const response = await fetch(`http://localhost:8080/auth/admin/realms/${realm}/groups/${idgroup}/members`,config);
    const result = await response.json(); 
    return result;
}

const FillRealmSelector = async () =>{
    let elementOption, option;
    let itemsRealm = await getAllRealms();
    for(let i=0; i<itemsRealm.length; i++){
        elementOption = document.createElement("option");
        elementOption.innerHTML = `<option value="${itemsRealm[i].realm}" >${itemsRealm[i].realm}</option>`;
        option = document.getElementById("templateOption");
        option.appendChild(elementOption);
    }
    
}

const FillGroupsSelector = async () =>{
    let elementOption, option;
    let itemsGroup = await getAllGroup();
    for(let i=0; i<itemsGroup.length; i++){
        elementOption = document.createElement("option");
        console.log(itemsGroup);
        elementOption.innerHTML = `<option value="${itemsGroup[i].name}" >${itemsGroup[i].name}</option>`;
        option = document.getElementById("templateGroupOption");
        option.appendChild(elementOption);
    }
    
}

const FillUserSelector = async () =>{
    let elementOption, option;
    let itemsGroup = await getAllUsers();
    
    for(let i=0; i<itemsGroup.length; i++){
        elementOption = document.createElement("option");
        elementOption.innerHTML = `<option value="${itemsGroup[i].name}" >${itemsGroup[i].name}</option>`;
        option = document.getElementById("templateGroupOption");
        option.appendChild(elementOption);
    }
    
}


const obtainSelectedInfo = () =>{
    const templateOption = document.getElementById("templateOption").value;
    const templateGroupOption = document.getElementById("templateGroupOption").value;
    return { templateOption, templateGroupOption };
}

