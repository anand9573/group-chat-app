async function sendmsg(e){
    try{

        e.preventDefault();
        const mes=e.target.msg.value;
    const token=localStorage.getItem('token');
    const decodeToken=parseJwt(token);
    const groupid=localStorage.getItem('groupid');
    const data={message:e.target.msg.value,userID:decodeToken.id,date:new Date()}
    const res=await axios.post(`http://localhost:3000/messages/sent_to/${groupid}`,data,{headers:{"Authorization":token}});
    console.log(res.data);
    console.log(decodeToken);
    const msg=document.getElementById('msg');
    msg.innerHTML+=`<h6 class="rounded border p-2 border-secondary text-start fst-italic text-primary">${mes}</h6>`;
    e.target.msg.value='';
}catch(err){
    const msg=document.getElementById('msg');
    msg.innerHTML+='<h6 class="rounded border p-2 bg-danger text-start fst-italic text-white">No such group exist or access denied</h6>'
}
}

async function getuserGroups(){
    try{
    localStorage.setItem('groupid',groupId)
        const token=localStorage.getItem('token');
        const decodeToken=parseJwt(token);
        const res=await axios.get(`http://localhost:3000/messages/getmessages`,{headers:{"Authorization":token}});
    }catch(err){
        const msg=document.getElementById('msg');
    msg.innerHTML+=`<h6 class="fst-italic text-white rounded-pill bg-danger p-2">Something went wrong try after sometime!</h6>`;
    }


}

async function getGroupMessages(groupId,groupname){
    try{
        localStorage.setItem('groupid',groupId)
        const token=localStorage.getItem('token');
        const decodeToken=parseJwt(token);
        const res=await axios.get(`http://localhost:3000/messages/${groupId}`,{headers:{"Authorization":token}});
        const groupid=localStorage.getItem('groupid')
        document.getElementById(groupId).classList.add("active");
        const msg=document.getElementById('msg');
        msg.innerHTML=`<h3 class="bg-success sticky-top d-flex rounded p-2 overflow-auto" style="position: fixed;width:65vw ;margin-top: 8vw;margin-bottom: 10vw; padding: 10px; display: flex; justify-content: space-between;color:white; align-items: center;><span class="align-self-start" id="gname">${groupname}</span><button class="text-white btn fw-bolder btn-dark align-self-end" data-bs-toggle="modal" data-bs-target="#popup">☰</button></h3><br><br><br>`
        if(res.data.messages.length>0){
            for(const msgs of res.data.messages){
                console.log(msgs.userId,decodeToken.id)
                if(msgs.userId===decodeToken.id){
                    msg.innerHTML+=`<h6 class="rounded border p-2 border-secondary text-start fst-italic text-primary fw-bold">${msgs.message}</h6>`;
                }else{
                    msg.innerHTML+=`<h6 class="rounded border p-2 border-secondary text-end fst-italic text-success fw-bold">${msgs.message}</h6>`;
                }
            }
        }
    }catch(err){
    const msg=document.getElementById('msg');
    msg.innerHTML+=`<h6 class="fst-italic text-white rounded-pill bg-danger p-2">Something went wrong try after sometime!</h6>`;
    }
}

async function displayinviteusers(e){
    try{
        e.preventDefault();
        const token=localStorage.getItem('token')
        console.log(token)
        const decodeToken=parseJwt(token);
        console.log(decodeToken)
        getusers()
        const users=JSON.parse(localStorage.getItem('users'));
        const label = document.getElementById('invitecheckbox');
            label.innerHTML = '';
                for (const user of users) {
                    label.innerHTML += `
                        <div class="form-group form-check">
                            <input type="checkbox" class="form-check-input" id="${user.id}" name="friend" value="${user.Name}">
                            <label class="form-check-label" for="${user.id}">${user.Name}</label>
                        </div>
                    `;
                }
                $('#chatpopup').modal('hide');
                
            $('#modal').modal('show');
    }catch(err){
        const msg=document.getElementById('msg');
    msg.innerHTML+=`<h6 class="fst-italic text-white rounded-pill bg-danger p-2">Something went wrong try after sometime!</h6>`;
    }
}

async function creategroup(e){
    try{
        e.preventDefault();
        const token=localStorage.getItem('token')
        const decodeToken=parseJwt(token);
        const checkboxes = document.querySelectorAll('input[name="friend"]:checked');
        const users = Array.from(checkboxes).map(checkbox => ({
            name: checkbox.value,
            id: checkbox.id,
        }));
        const data={
            users:users,
            groupname:document.getElementById('groupname').value
        }
        const res=await axios.post(`http://localhost:3000/group/${decodeToken.id}`,data,{headers:{"Authorization":token}});
        localStorage.setItem('groups',JSON.stringify(res.data.groups))
        console.log(res.data)
        if(res.status===200){
            localStorage.setItem('group',JSON.stringify(res.data.groupCreated));
            await $('#modal').modal('hide');
            setTimeout(function() {
                alert(`${res.data.groupCreated.Name} Group Created successfully`);
            }, 100);
        const groups=document.getElementById('groups');
        groups.innerHTML+=`<li style=" display: flex;border-bottom:3px solid brown; justify-content: space-between; align-items: center;"><button class="bg-dark btn p-2 text-white fw-bolder w-75 rounded" id="${res.data.groupCreated.id}" onclick="getGroupMessages('${res.data.groupCreated.id}','${res.data.groupCreated.Name}')">${res.data.groupCreated.Name}</button>
                        </li>`
            // groups.innerHTML+=`<li style="border-bottom: 2px solid white; margin: 10px 0; padding: 10px; display: flex; justify-content: space-between; align-items: center;"><button class="btn text-white fw-bolder" onclick="getGroupMessages('${res.data.groupCreated.id}','${res.data.groupCreated.Name}')">${res.data.groupCreated.Name}</button>
            //                        </li>`
        }
    }catch(err){
        const message=async (err)=>{
            const sleep = m => new Promise(r => setTimeout(r, m))
            const submit=document.getElementById('submit')
            const h6=document.createElement('h6')
            h6.textContent+=`${err.response.data.message}`
            h6.style.color='red'
            submit.before(h6)
            await sleep(4000);
            h6.remove()
        }
        message(err)
        console.log(err)
    }
}

function displaygroup(){
    if(localStorage.getItem('user')!==null){
        const groups=document.getElementById('groups');
        groups.innerHTML=''
        const user=JSON.parse(localStorage.getItem('user'));
        const users=JSON.parse(localStorage.getItem('users'));
    for(const group of user.groups){
        groups.innerHTML+=`<h3 class="bg-success sticky-top d-flex rounded" style="position: fixed;width:28vw ;margin-top: 8vw; padding: 5px; display: flex; justify-content: space-between;color:white; align-items: center;><span class="align-self-start text-white" id="gname">All Chats</span><button class="text-white btn fw-bolder btn-dark align-self-end" data-bs-toggle="modal" data-bs-target="#chatpopup">...</button></h3><br><li style=" display: flex;border-bottom:3px solid brown; justify-content: space-between; align-items: center;"><button class="bg-dark btn p-2 text-white fw-bolder w-75 rounded" id="${group.id}" onclick="getGroupMessages('${group.id}','${group.Name}')">${group.Name}</button>
                        </li>`
}
}
}


async function getusers(){
    try{
        const token=localStorage.getItem('token')
        if(token){
            const decodeToken=parseJwt(token);
            const userid=decodeToken.id
            const res=await axios.get(`http://localhost:3000/user/getusers/${userid}`,{headers:{"Authorization":token}});
            console.log('users',res.data.allUsers);
            localStorage.setItem('users',JSON.stringify(res.data.allUsers));
            console.log('user',res.data.userDetails);
             localStorage.setItem('user',JSON.stringify(res.data.userDetails));
        }
    }catch(err){
        console.log(err);
    }
}

window.addEventListener('DOMContentLoaded',async()=>{
try{
    await getusers();
    await displaygroup();
    const groupid=localStorage.getItem('groupid');
    if(groupid){
        document.getElementById(`${groupid}`).click();
    }else{
        const msg=document.getElementById('msg');
        msg.innerHTML=`<h3 class="bg-success  p-1 d-flex rounded p-2" style="position: fixed;width:65vw ;margin: 10px 0; padding: 10px; display: flex; justify-content: space-between; align-items: center;><span class="align-self-start text-white">.</span><button class="text-white btn fw-bolder btn-dark align-self-end" data-bs-toggle="modal" data-bs-target="#popup">...</button></h3><br><br><br><h2 class="bg-warning rounded text-center text-white fw-bold p-0"> click on chats on left side to display your chat box ! ...</h2>`
    }
    
}catch(err){
    document.getElementById('msg').innerHTML+='<h2 class="bg-danger rounded-pill btn text-center text-white fw-bold">something went wrong try after some time ! ...</h2>'
}
})
async function groupmsg(groupId){
    try{
        const token=localStorage.getItem('token');
        const res=await axios.get(`http://localhost:3000/messages/${groupId}`,{headers:{"Authorization":token}});
        console.log(res.data);
        localStorage.setItem('group',JSON.stringify(res.data.group));
        localStorage.setItem('messages',JSON.stringify(res.data.messages));
        displayMsg()
    }catch(err){
        console.log(err)
    }
}


document.getElementById('logout').addEventListener('click', function(event) {
  event.preventDefault();
    localStorage.clear()
    window.location.href='../../views/login.html'
})

const update=async()=>{
    try{
        const interval=setInterval(function getmsgs() {
            getusers();
        }, 3000);
    }catch(err){
            console.log(err)
    } 
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const home = document.getElementById('home');

home.addEventListener('click', function(event) {
  event.preventDefault();
 if(localStorage.getItem('token')!==null){
    window.location.href='../../views/groupchat.html'
 }else{
    window.location.href='../../views/signup.html'
 }
});



async function Makegroupadmin(e) {
    e.preventDefault();
    $('#invite').modal('hide');
    const groupname=JSON.parse(localStorage.getItem('group'))[0].groupName
    const groupid=JSON.parse(localStorage.getItem('group'))[0].id
    const checkboxes = document.querySelectorAll('input[name="friend"]:checked');
    const users = Array.from(checkboxes).map(checkbox => ({
        name: checkbox.value,
        id: checkbox.id,
    }));

    const token = localStorage.getItem('token');
    const details = {
        users,
        groupid,
        groupname
    };

    try {
        const res = await axios.post('http://localhost:3000/group/admin/:userId', details, {
            headers: { "Authorization": token }
        });
        getalerts()
    
    } catch (error) {
        console.error(error);
    }
}

async function Addmembers(e) {
    try {
        e.preventDefault()
        const groupid=localStorage.getItem('groupid')
        const data={search:document.querySelector('[id="search"]').value,
    groupid:groupid}
        console.log(search)
        const token=localStorage.getItem('token')
        const datastring = new URLSearchParams(data).toString();
        if(token){
            const res=await axios.get(`http://localhost:3000/user/search?${datastring}`,{headers:{"Authorization":token}});
            console.log('usersearched',res.data.search);

        const label = document.getElementById('searchlist');
        label.innerHTML = '';
        if(res.data.search.length>0){
            label.innerHTML+=`<form  class="form-control" ><br><div class="form-group form-check" id="searchusersbox"></div></form>`

            for (const member of res.data.search) {
            document.getElementById('searchusersbox').innerHTML += `
                <input type="checkbox" class="form-check-input ms-3" id="${member.id}" name="searchusers" value="${member.Name}">
                <label class="form-check-label ms-1" for="${member.id}">${member.Name}</label><br>
                `;
            }
            document.getElementById('searchusersbox').innerHTML+=`<button class="btn btn-dark form-control" onclick="addgroup(event)" id="addgroup-submit">Add to Group</button>`
        }else{
            label.innerHTML += `<br><form  class="form-control" >
                <div class="bg-warning rounded p-1">
                <h5 class="text-white">No Results</h5>
                </div>
                </form>`;
            }
    }
    } catch(error) {
        console.log(error);
    }
}

async function addgroup(e){
    try{
        e.preventDefault();
        const token=localStorage.getItem('token')
        const checkboxes = document.querySelectorAll('input[name="searchusers"]:checked');
        const users = Array.from(checkboxes).map(checkbox => ({
            name: checkbox.value,
            id: checkbox.id,
        }));
        console.log(token)
        const decodeToken=parseJwt(token);
        const data={
            users:users,
            groupid:localStorage.getItem('groupid')
        }
        const res=await axios.post(`http://localhost:3000/group/addmembers/${decodeToken.id}`,data,{headers:{"Authorization":token}});
        localStorage.setItem('groups',JSON.stringify(res.data.groups))
        console.log(res.data)
        if(res.status===200){
            localStorage.setItem('group',JSON.stringify(res.data.groupCreated));
$('#addmembers').modal('hide');
setTimeout(function() {
    alert('Added members successfully');
}, 100);
        }
    }catch(err){
        const message=async (err)=>{
            const sleep = m => new Promise(r => setTimeout(r, m))
            const submit=document.getElementById('addgroup-submit')
            const h6=document.createElement('h6')
            h6.textContent+=`${err.response.data.message}`
            h6.style.color='red'
            submit.before(h6)
            await sleep(4000);
            h6.remove()
        }
        message(err)
        console.log(err)
    }
}

async function getnonadmins(){
    const token=localStorage.getItem('token')
    const groupid=localStorage.getItem('groupid');
    const res=await axios.get(`http://localhost:3000/group/${groupid}`,{headers:{"Authorization":token}});
    console.log(res.data.users);
    label=document.getElementById('nonadminslist')
    label.innerHTML=''
    for(const user of res.data.users){
        if(user.admin===false){
            label.innerHTML+=`<div class="form form-check">
            <input type="text" class="" id="${user.id}" name="nonadmin" value="${user.Name}" disabled>
            <button class="btn btn-info" style="width: 20vw" onclick="makeadmin(event,'${user.id}')">Make as Admin</button>
        </div>`
        }
    }


}


async function getadmins(){
    const token=localStorage.getItem('token')
    const groupid=localStorage.getItem('groupid');
    const res=await axios.get(`http://localhost:3000/group/${groupid}`,{headers:{"Authorization":token}});
    console.log(res.data.users);
    label=document.getElementById('nonadminslist')
    label.innerHTML=''
    for(const user of res.data.users){
        if(user.admin===true){
            label.innerHTML+=`<div class="form form-check">
            <input type="text" class="" id="${user.id}" name="admin" value="${user.Name}" disabled>
            <button class="btn btn-info" style="width: 20vw" onclick="removeadmin(event,'${user.id}')">Remove Admin</button>
        </div>`
        }
    }
}

async function removegroupmember(){
    const token=localStorage.getItem('token')
    const groupid=localStorage.getItem('groupid');
    const res=await axios.get(`http://localhost:3000/group/${groupid}`,{headers:{"Authorization":token}});
    console.log(res.data.users);
    label=document.getElementById('nonadminslist')
    label.innerHTML=''
    const username=JSON.parse(localStorage.getItem('user')).Name;
    for(const user of res.data.users){
        if(user.admin===false){
            label.innerHTML+=`<div class="form form-check">
            <input type="text" class="" id="${user.id}" name="admin" value="${user.Name}" disabled>
            <button class="btn btn-info" style="width: 20vw" onclick="exitgroup(event,'${user.id}')">Remove From Group</button>
        </div>`
        }
    }


}

async function makeadmin(e,userid){
    try{
        e.preventDefault();
        const token=localStorage.getItem('token')
        const data = {
            userId:userid,
            groupId: localStorage.getItem('groupid')
        }
        const res=await axios.post(`http://localhost:3000/group/admin/${userid}`,data,{headers:{"Authorization":token}});
        $('#makeadmin').modal('hide');
setTimeout(function() {
    alert(`${res.data.message}`);
}, 100);
    }catch(err){
        console.log(err)
    }
}


async function removeadmin(e,userid){
    try{
        e.preventDefault();
        const token=localStorage.getItem('token');
        const data = {
            userId:userid,
            groupId: localStorage.getItem('groupid')
        }
        const res=await axios.post(`http://localhost:3000/group/admin/remove/${userid}`,data,{headers:{"Authorization":token}});
        $('#makeadmin').modal('hide');
setTimeout(function() {
    alert(`${res.data.message}`);
}, 100);
    }catch(err){
        console.log(err)
    }
}


async function exitgroup(e,userid){
    try{
        e.preventDefault();
        const token=localStorage.getItem('token')
        const data = {
            userId:userid,
            groupId: localStorage.getItem('groupid')
        }
        const res=await axios.post(`http://localhost:3000/group/exit/${userid}`,data,{headers:{"Authorization":token}});
        $('#makeadmin').modal('hide');
setTimeout(function() {
    alert(`${res.data.message}`)
}, 100);
    }catch(err){
        console.log(err)
    }
}