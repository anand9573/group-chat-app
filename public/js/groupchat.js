const socket = io('http://localhost:3000');
const token=localStorage.getItem('token');
socket.on('connect',()=>{
    console.log(`you are connected with ${socket.id}`)
    const decodeToken=parseJwt(token)
    socket.emit('token',decodeToken)
})
const decodeToken=parseJwt(token)
const userId = decodeToken.id; // You should replace this with the actual user ID
socket.emit('setUserId', userId);

// socket.on('dissconnect',(socket)=>{
//     console.log(`you are dissconnected with ${socket.id}`)
//     const decodeToken=parseJwt(token);
//     socket.emit('updateonline',decodeToken.id)
// })

// socket.on('dissconnect', (ok) => {
//     // console.log(`you are disconnected with ${socket.id}`);
//     const decodeToken = parseJwt(token);
//     socket.emit('updateonline', decodeToken.id);
//     console.log('Disconnected from the server');
//   });
  
// socket.on('disconnect', (decodeToken) => {
//     console.log('Disconnected from the server');
//     // Additional logic you want to execute when the connection is lost
//   });
socket.on('verified',(verified)=>{
    if(verified===true){
        always()
    }else{
        window.location.href=`http://localhost:3000/login.html`
    }
})
socket.on('receive-message',(data)=>{
    const decodeToken=parseJwt(token)
    const date = new Date(data.date);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedHours = (hours % 12 === 0) ? 12 : hours % 12;
    // const click=localStorage.getItem('click');
    // if(click){
    //     localStorage.removeItem('click');
    // }
    const amOrPm = hours >= 12 ? 'pm' : 'am';
    if(data.groupid===localStorage.getItem('groupid') || data.groupid===decodeToken.id && data.userID===localStorage.getItem('groupid')){
        msg.innerHTML+=`<div class="message-container">
        <div class="sender-name text-success">${data.Name}</div>
        <div class="message-text">${data.message}</div>
        <div class="timestamp text-primary">${formattedHours}:${formattedMinutes} ${amOrPm}</div>
        </div>`;
    }else{
        console.log('its not')
    }
})


    

async function always(){

    if(token){
        const decodeToken=parseJwt(token)
    console.log(decodeToken)
    const userId = decodeToken.id; 
    socket.emit('login', userId);
    socket.on('onlineUsers', async(onlineUsers) => {
 console.log(onlineUsers)
    })
            try{
                await getusers();
                await displaygroup();
                const groupid=localStorage.getItem('groupid');
                if(groupid){
                    document.getElementById(`${groupid}`).click();
                }
                //  }else{
                    // const msg=document.getElementById('msg');
                    // msg.innerHTML=`<h3 class="bg-success  p-1 d-flex rounded p-2" style="position: fixed;width:65vw ;margin: 10px 0; padding: 10px; display: flex; justify-content: space-between; align-items: center;><span class="align-self-start text-white">.</span><button class="text-white btn fw-bolder btn-dark align-self-end" data-bs-toggle="modal" data-bs-target="#popup">...</button></h3><br><br><br>`
                    
                    // }
                    
                }catch(err){
                    document.getElementById('msg').innerHTML+='<h2 class="bg-danger rounded btn text-center text-white fw-bold">something went wrong try after some time ! ...</h2>'
                }
                // });
                
                // socket.on('userOnline', (userId) => {
                    //     console.log('User online:', userId);
                    // });
                    
                    // socket.on('userexist', (userexist) => {
                        //     if(!userexist){
                            //         window.location.href='http://localhost:3000/login.html'
    //     }
    // });
    
//     const useronline = {};
// socket.on('userOffline', (userId, lastonline) => {
//       console.log('User offline:', userId, lastonline);
//       useronline[userId] = lastonline; 
//     });
// socket.on('lastonline', (lastonline) => {

//     });
socket.on('onlineat', (userid,lastonline) => {
      console.log('------------------------------------------->user online at', userid, lastonline);
const useronline=document.getElementById(`online`) 
      if(useronline){
        if(lastonline==='online now'){
            useronline.textContent=`online now`
        }else{
            useronline.textContent=`last seen at ${lastonline}`
        }
}else{
    console.log('no such id found')
}
    });
}

// socket.on("user-created", data => {
    //     console.log(data.user, " created this group");
    // })
    // socket.on("recieve-message", data => {
        //     const groupName = localStorage.getItem("groupName");
        //     if (groupName === data.groupName) {
            //         appendMsg(data);
//     }
// })

// socket.on('receive-message',(data)=>{
    //     const date = new Date(data.date);
    //     const hours = date.getHours();
    //     const minutes = date.getMinutes();
    //     const formattedMinutes = String(minutes).padStart(2, '0');
    //     const formattedHours = (hours % 12 === 0) ? 12 : hours % 12;
    //     const amOrPm = hours >= 12 ? 'pm' : 'am';
    //     if(data.groupid===localStorage.getItem('groupid')){
        
        //         msg.innerHTML+=`<div class="message-container floatright">
        //         <div class="sender-name text-success">${data.Name}</div>
        //         <div class="message-text">${data.message}</div>
        //         <div class="timestamp text-primary">${formattedHours}:${formattedMinutes} ${amOrPm}</div>
        //         </div>`;
        //     }else{
            //         console.log('its not')
            //     }
            //     })
        }
            
async function sendmsg(e){
    try{
        e.preventDefault();
        const mes=document.getElementById('messagee').value
    const decodeToken=parseJwt(token);
    const groupid=localStorage.getItem('groupid');
    const data={message:mes,userID:decodeToken.id,date:new Date(),Name:decodeToken.Name,groupid}
    const res=await axios.post(`http://localhost:3000/messages/sent_to/${groupid}`,data,{headers:{"Authorization":token}});
    const msg=document.getElementById('msg');
    const time_stamp = res.data.message.time_stamp;
    const currentDate = new Date(time_stamp);
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    console.log(hours)
    const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedHours = (hours % 12 === 0) ? 12 : hours % 12;
        const amOrPm = hours >= 12 ? 'pm' : 'am';
        msg.innerHTML+=`<div class="message-container floatright">
    <div class="sender-name text-success">you</div>
    <div class="message-text">${res.data.message.message}</div>
    <div class="timestamp text-primary">${formattedHours}:${formattedMinutes} ${amOrPm}</div>
    </div>`;
    // const oldmessages = JSON.parse(localStorage.getItem("messages"));
    // let labellist = document.getElementsByClassName("message-text");
    // if (oldmessages.length > 10) {
        //     labellist[0].remove();
        // }
        socket.emit('send-message',data)
        document.getElementById('messagee').value=''
}catch(err){
    console.log(err)
    const msg=document.getElementById('msg');
    msg.innerHTML+='<h6 class="rounded border p-2 bg-danger text-start fst-italic text-white">No such group exist or access denied</h6>'
}
}

// function appendMsg(msg) {
//     const messageElement = document.createElement('div');
//     messageElement.classList.add('message');
//     if (msg.image) {
//         messageElement.innerHTML = `${msg.user.name}: <br><img src="${msg.image}" alt="image" height="100px" width="200px" >`
//     } else {
//         messageElement.textContent = `${msg.user.name}: ${msg.message}`;
//     }
//     groupMessages.appendChild(messageElement);
//     const oldmessages = JSON.parse(localStorage.getItem("messages"));
//     let labellist = document.getElementsByClassName("message");
//     if (oldmessages.length > 10) {
//         labellist[0].remove();
//     }

// }

// async function getuserGroups(){
//     try{
//     localStorage.setItem('groupid',groupId)
//         // const token=localStorage.getItem('token');
//         // const decodeToken=parseJwt(token);
//         const res=await axios.get(`http://localhost:3000/messages/getmessages`,{headers:{"Authorization":token}});
//     }catch(err){
//         const msg=document.getElementById('msg');
//     msg.innerHTML+=`<h6 class="fst-italic text-white rounded-pill bg-danger p-2">Something went wrong try after sometime!</h6>`;
//     }
// }

// document.getElementById("getOldMessagesBtn").addEventListener("click", () => {
//     getGroupMessages(groupId, groupname, offset);
// });


async function getGroupMessages(groupId,groupname,offset){
    try{
        if(offset===0){
            localStorage.setItem('click',0)
        }
        localStorage.setItem('groupid',groupId);
        localStorage.setItem('groupname',groupname);
        const decodeToken=parseJwt(token);
        const res=await axios.get(`http://localhost:3000/messages/to/${groupId}/${offset}`,{headers:{"Authorization":token}});
        document.getElementById(groupId).classList.add("hover");
        // offset += 10;
        
        // if(offset<10){
            //     msg.innerHTML=`<button class="btn btn-info rounded p-1 m-2" id="oldmessages" onclick="getGroupMessages('${groupId}','${groupname}',${offset})"><span class="text-center">Get Old Messages</span></button>`
            // }
            // document.getElementById("groupnamee").textContent = `${groupname}`;
            // document.getElementById("oldmessages").addEventListener("click", () => {
                //     getGroupMessages(`${groupId}`, `${groupname}`,`${offset}`);
                // });
                console.log(res.data.messages);
                socket.emit('lastonline',groupId);
                if(offset===0){
                    getgrouphead(groupId,groupname);
                   
                }
        displaymessage(res)

    
        document.getElementById("groupnamee").textContent = `${groupname}`;
        // <h6 class="rounded border p-2 border-secondary text-end fst-italic text-success fw-bold">${msgs.message}</h6>
    }catch(err){
        console.log(err)
    const msg=document.getElementById('msg');
    msg.innerHTML+=`<h6 class="fst-italic text-white rounded-pill bg-danger p-2">Something went wrong try after sometime!</h6>`;
    }
}
function getgrouphead(groupid,groupname){
    const users=JSON.parse(localStorage.getItem('users'));
    const user=JSON.parse(localStorage.getItem('user'));
    const arrayFromValues = Object.values(users).map(user => user.id);
    console.log('ok--->',arrayFromValues,groupid);
    const grouphead=document.getElementById('grouphead');
        if(arrayFromValues.includes(groupid)){
            grouphead.innerHTML=`<div class="align-self-start text-white mt-1"><span  id="groupnamee" class="fs-5"></span><br>
            <span class="fw-bold small-font" id="online" style="color:orange;"></span></div>
            <button class="hovertext text-white btn fw-bolder btn-dark align-self-end" data-bs-toggle="modal" data-bs-target="#modal" data-hover="Options">...</button>`
        }else{
            grouphead.innerHTML=`<span class="align-self-start text-white mt-1" id="groupnamee"></span><button class="hovertext text-white btn fw-bolder btn-dark align-self-end" data-bs-toggle="modal" data-bs-target="#grouppopup" data-hover="Options">=</button>`
        }

    const msg=document.getElementById('msg');
        msg.innerHTML=``;
    // <div class="message-container floatright">
    //                         <div class="sender-name text-success">you</div>
    //                         <div class="message-text ">${msgs.message}</div>
    //                         <div class="timestamp text-primary">${hours %12}:${formattedMinutes} ${amOrPm}</div>
    //                     </div>
    msg.innerHTML+=`<div class="d-flex">
    <div class="m-auto"><button onclick="attachevent()" id="getoldmessages" class="btn btn-primary justify-center">Load More</button></div>
</div><div id="appendoldmsg"></div>`
// attachevent();
   
};

let clickCount=0;
function attachevent(){
        console.log('Entered');
        if(localStorage.getItem('click')==='0'){
            clickCount=0;
        }
        clickCount++;
        localStorage.setItem('click',clickCount);
        getGroupMessages(`${localStorage.getItem('groupid')}`, `${localStorage.getItem('groupname')}`,`${clickCount}`);
        }

async function displaymessage(res){
    const click=localStorage.getItem('click');
    if(res.data.messages.length>0){
        for(const msgs of res.data.messages){
            const date = new Date(msgs.time_stamp);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedHours = (hours % 12 === 0) ? 12 : hours % 12;
            const amOrPm = hours >= 12 ? 'PM' : 'AM';
            let msg;
            let id;
            let messages=``;
            if(Number(click)>0){
                msg=document.getElementById('appendoldmsg');
                id='appendoldmsg';
                const decodeToken=parseJwt(token);
    if(msgs.userId===decodeToken.id){
        if(!msgs.message){
            messages=`<div class="file-container floatright">
            <div class="sender-name text-success">you</div>
            <img src="${msgs.url}" style="width:40vw;height:auto" class="message-text" alt="${msgs.filename}">
            <div class="timestamp text-primary">${formattedHours}:${formattedMinutes} ${amOrPm}</div>
        </div>`+messages
                    }
        else{
            messages=`<div class="message-container floatright">
            <div class="sender-name text-success">you</div>
            <div class="message-text ">${msgs.message}</div>
            <div class="timestamp text-primary">${formattedHours}:${formattedMinutes} ${amOrPm}</div>
            </div>`+messages
                        // msg.innerHTML=`<div class="message-container floatright">
                        // <div class="sender-name text-success">you</div>
                        // <div class="message-text ">${msgs.message}</div>
                        // <div class="timestamp text-primary">${formattedHours}:${formattedMinutes} ${amOrPm}</div>
                        // </div>`+msg.innerHTML;
                    }
    }else{
        if(!msgs.message){
                        messages=`<div class="file-container floatright">
                        <div class="sender-name text-success">${msgs.sent_by}</div>
                        <img src="${msgs.url}" style="width:40vw;height:auto" class="message-text" alt="${msgs.filename}">
                        <div class="timestamp text-primary">${formattedHours}:${formattedMinutes} ${amOrPm}</div>
                        </div>`+messages
                        // displayFile(msgs.file, msgs.url,msgs.time_stamp,id);
                        // msg.innerHTML=`<div class="file-container floatright">
                        // <div class="sender-name text-success">you</div>
                        // <img src="${msgs.url}" style="width:40vw;height:auto" class="message-text" alt="${msgs.filename}">
                        // <div class="timestamp text-primary">${formattedHours}:${formattedMinutes} ${amOrPm}</div>
                        // </div>`+msg.innerHTML
                    }
                    else{
                        messages=`<div class="message-container">
                        <div class="sender-name text-success">${msgs.sent_by}</div>
                        <div class="message-text">${msgs.message}</div>
                        <div class="timestamp text-primary">${formattedHours}:${formattedMinutes} ${amOrPm}</div>
                        </div>`+messages
                        // msg.innerHTML=msg.innerHTML+`<div class="message-container">
                        // <div class="sender-name text-success">other</div>
                        // <div class="message-text">${msgs.message}</div>
                        // <div class="timestamp text-primary">${formattedHours}:${formattedMinutes} ${amOrPm}</div>
                        // </div>`;
    }
}

}else{
    msg=document.getElementById('appendoldmsg');
                id='msg';
                const decodeToken=parseJwt(token);
    if(msgs.userId===decodeToken.id){
        if(!msgs.message){
            messages+=`<div class="file-container floatright">
            <div class="sender-name text-success">you</div>
            <img src="${msgs.url}" style="width:40vw;height:auto" class="message-text" alt="${msgs.filename}">
            <div class="timestamp text-primary">${formattedHours}:${formattedMinutes} ${amOrPm}</div>
        </div>`;
            // msg.innerHTML+=`<div class="file-container floatright">
            //                     <div class="sender-name text-success">you</div>
            //                     <img src="${msgs.url}" style="width:40vw;height:auto" class="message-text" alt="${msgs.filename}">
            //                     <div class="timestamp text-primary">${formattedHours}:${formattedMinutes} ${amOrPm}</div>
            //                 </div>`
                    }
        else{
            messages+=`<div class="message-container floatright">
            <div class="sender-name text-success">you</div>
            <div class="message-text ">${msgs.message}</div>
            <div class="timestamp text-primary">${formattedHours}:${formattedMinutes} ${amOrPm}</div>
            </div>`;
                        // msg.innerHTML+=`<div class="message-container floatright">
                        // <div class="sender-name text-success">you</div>
                        // <div class="message-text ">${msgs.message}</div>
                        // <div class="timestamp text-primary">${formattedHours}:${formattedMinutes} ${amOrPm}</div>
                        // </div>`;
                    }
                }else{
                    if(!msgs.message){
                        messages+=`<div class="file-container floatright">
                        <div class="sender-name text-success">${msgs.sent_by}</div>
                        <img src="${msgs.url}" style="width:40vw;height:auto" class="message-text" alt="${msgs.filename}">
                        <div class="timestamp text-primary">${formattedHours}:${formattedMinutes} ${amOrPm}</div>
                        </div>`;
                        // displayFile(msgs.file, msgs.url,msgs.time_stamp,id);
                        // msg.innerHTML+=`<div class="file-container floatright">
                        // <div class="sender-name text-success">you</div>
                        // <img src="${msgs.url}" style="width:40vw;height:auto" class="message-text" alt="${msgs.filename}">
                        // <div class="timestamp text-primary">${formattedHours}:${formattedMinutes} ${amOrPm}</div>
                        // </div>`
                    }
                    else{
                        messages+=`<div class="message-container">
                        <div class="sender-name text-success">${msgs.sent_by}</div>
                        <div class="message-text">${msgs.message}</div>
                        <div class="timestamp text-primary">${formattedHours}:${formattedMinutes} ${amOrPm}</div>
                        </div>`;
                        // msg.innerHTML+=`<div class="message-container">
                        // <div class="sender-name text-success">other</div>
                        // <div class="message-text">${msgs.message}</div>
                        // <div class="timestamp text-primary">${formattedHours}:${formattedMinutes} ${amOrPm}</div>
                        // </div>`;
                }
            }
        }
        msg.innerHTML=messages+msg.innerHTML;
    }
}
    else{
        const message=async ()=>{
            const sleep = m => new Promise(r => setTimeout(r, m))
            const submit=document.getElementById('getoldmessages')
            const h6=document.createElement('h6');
            h6.className='border rounded-pill fw-bold m-1 p-1';
            h6.textContent+=`No Messages to display`
            h6.style.color='white';
            h6.style.backgroundColor='black'
            submit.after(h6)
            await sleep(4000);
            h6.remove()
        }
        message()
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
        const res=await axios.post(`http://localhost:3000/group/create/${decodeToken.id}`,data,{headers:{"Authorization":token}});
        localStorage.setItem('groups',JSON.stringify(res.data.groups));
        console.log(res.data);
        if(res.status===200){
            localStorage.setItem('group',JSON.stringify(res.data.groupCreated));
            await $('#modal').modal('hide');
            setTimeout(function() {
                alert(`${res.data.groupCreated.Name} Group Created successfully`);
            }, 100);
        const groups=document.getElementById('groups');
        groups.innerHTML+=`<a id="${res.data.groupCreated.id}" onclick="getGroupMessages('${res.data.groupCreated.id}','${res.data.groupCreated.Name}')"><button class="button border-bottom-primary">${res.data.groupCreated.Name}</button></a>`
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
        console.log(users)
    for(const user of users){
        console.log(user)
        groups.innerHTML+=`
        <a  id="${user.id}" onclick="getGroupMessages('${user.id}','${user.Name}',0)"><button class="button border-bottom-primary">${user.Name}</button></a>`
}
    for(const group of user.groups){
        groups.innerHTML+=`
        <a  id="${group.id}" onclick="getGroupMessages('${group.id}','${group.Name}',0)"><button class="button border-bottom-primary">${group.Name}</button></a>`
}
}
}


async function getusers(){
    try{
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

// window.addEventListener('DOMContentLoaded',async()=>{
// try{
//         await getusers();
//         await displaygroup();
//         const groupid=localStorage.getItem('groupid');
//         if(groupid){
//         document.getElementById(`${groupid}`).click();
//          }else{
//         const msg=document.getElementById('msg');
//         msg.innerHTML=`<h3 class="bg-success  p-1 d-flex rounded p-2" style="position: fixed;width:65vw ;margin: 10px 0; padding: 10px; display: flex; justify-content: space-between; align-items: center;><span class="align-self-start text-white">.</span><button class="text-white btn fw-bolder btn-dark align-self-end" data-bs-toggle="modal" data-bs-target="#popup">...</button></h3><br><br><br>`
    
// }
    
// }catch(err){
//     document.getElementById('msg').innerHTML+='<h2 class="bg-danger rounded btn text-center text-white fw-bold">something went wrong try after some time ! ...</h2>'
// }
// })
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
    window.location.href='http://localhost:3000/login.html'
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

// function uploadimage(){
//     const uploadimage=document.getElementById('imageUploadForm');
//     uploadimage.innerHTML=``
//     uploadimage.innerHTML+=`<input type="file" name="file" id="file" accept="image/*"><div id="message"></div><button type="submit" class="btn btn-dark m-2">Upload</button>`
// }

// function uploadvideo(){
//     const uploadimage=document.getElementById('upload-form');
//     uploadimage.innerHTML=``
//     uploadimage.innerHTML+=`<input type="file" name="video" id="video" accept="video/*"><button type="submit" class="btn btn-dark m-2">Upload Video</button>`;
// }
// function uploadfile(){
//     const uploadimage=document.getElementById('upload-form');
//     uploadimage.innerHTML=``
//     uploadimage.innerHTML+=`<input type="file" name="file" id="pdf" accept="application/pdf"><button type="submit" class="btn btn-dark m-2" >Upload File</button>`;
// }

// async function postuploadfiles(e){
//     try{
//         e.preventDefault();

//         const fileInput = document.getElementById('image-input');

//         const selectedFile = fileInput.files[0];

//         if (selectedFile) {
//             const formData = new FormData();
//             formData.append('file', selectedFile);
//             // formData.append('filelocation', selectedFile);
//             formData.append('groupId', localStorage.getItem('groupid'));
//             for (const pair of formData.entries()) {
//                 console.log(pair[0], pair[1]);
//               }

//               const token=localStorage.getItem('token')
//               const res=await axios.post('http://localhost:3000/group/uploadfile', formData
//             ,{headers:{"Authorization":token}})
//         if(res.status===200){
//      setTimeout(function() {
//         alert(`${res.data.message}`)
//       }, 100);
//     }
// }
//     }catch(error) {
//         console.log('Error:', error);
//     }
// }



// async function postuploadfile(e){
//     try{
//         e.preventDefault();
//     const fileInput = document.getElementById('image-input');
//     const selectedFile = fileInput.files[0];
  
//     if (!selectedFile) {
//       document.getElementById('message').innerHTML = `<span class="text-danger">* Please select a file</span>`;
//       return;
//     }
//     const token=localStorage.getItem('token')
//     const formData = new FormData();
//     formData.append('file', selectedFile);
//     formData.append('groupId', localStorage.getItem('groupid'));
//       const response = await axios.post('http://localhost:3000/group/uploadfile', formData
//       ,{headers:{
//         'Authorization': token
//       }});
  
//       if (response.status === 200) {
//         const data = await response.json();
//         document.getElementById('message').textContent = data.message;
//       } else {
//         document.getElementById('message').innerHTML = `<span class="text-danger">* File upload failed</span>`;
//     }   
// } catch (error) {
//       console.error('Error:', error);
//       document.getElementById('message').innerHTML = `<span class="text-danger">* An error occurred</span>`;
//     }
// }
// const fileInput = document.getElementById('fileInput');
//     const sendFileButton = document.getElementById('sendFile');
//     const fileList = document.getElementById('fileList');

//     sendFileButton.addEventListener('click', () => {
//       const file = fileInput.files[0];
//       if (file) {
//         const reader = new FileReader();

//         reader.onload = (event) => {
//           const fileData = {
//             filename: file.name,
//             content: event.target.result,
//           };
//           socket.emit('file-upload', fileData);
//           fileInput.value = ''; // Clear the file input
//         };

//         reader.readAsArrayBuffer(file);
//       }
//     });

//     socket.on('file-received', (filename) => {
//       fileList.innerHTML += `<p>${filename} received and saved on the server.</p>`;
//     });
async function uploadFiles(e) {
    e.preventDefault()
    const file = document.getElementById('file');
    try {
        const uploadedfile = file.files[0];
        const decodeToken=parseJwt(token)
        if(uploadedfile){
            const reader = new FileReader();

          reader.onload = (event) => {
            const fileData = {
              filename: uploadedfile.name,
              content: event.target.result,
            };
            const data={
                groupid:localStorage.getItem('groupid'),
                userId:decodeToken.id
            }
            console.log(fileData,data)
            socket.emit('file-upload', fileData,data);
            file.value = '';
          };

        reader.readAsArrayBuffer(uploadedfile);
        document.getElementById('uploading').innerHTML=`<h6 class="text-success">Uploading...</h6>`
        }else{
            document.getElementById('uploading').innerHTML=`<h6 class="text-danger">* Select the file</h6>`

        }
        console.log(file, uploadedfile);
        const groupId = localStorage.getItem("groupid");
        const formData = new FormData();
        formData.append("file", uploadedfile);
        console.log("Here\n\n\n", formData.get("file"));
//         if(uploadedfile !== "") {
//             const message = await axios.post("http://localhost:3000/group/add-file",
//                 formData,
//                 {
//                     headers: {
//                         "Authorization": token,
//                         "GroupId": groupId,
//                         "Content-Type": 'multipart/form-data'
//                     }
//                 });
//             console.log(message.data);
//             const currentDate = new Date();
//     const hours = currentDate.getHours();
//     const minutes = currentDate.getMinutes();
//     console.log(hours)
//     const amOrPm = hours >= 12 ? 'PM' : 'AM';
//     if(message.data.filetype==='file'){

//         document.getElementById('msg').innerHTML+=`<div class="file-container floatright">
//         <div class="sender-name text-success">you</div>
//         <img src="${message.data.result.Location}" style="width:50vw;height:auto" class="message-text" alt="There must be a Image">
//         <div class="timestamp text-primary">${hours %12}:${minutes} ${amOrPm}</div>
//     </div>`
// }else{
//     document.getElementById('msg').innerHTML+=`<div class="file-container floatright">
//     <div class="sender-name text-success">you</div>
//     <a href="${message.data.result.Location}"
//        download="sample.html">file download
//     <div class="timestamp text-primary">${hours %12}:${minutes} ${amOrPm}</div>
// </div>`
// }
$('#uploadfile').modal('hide');
    }
// }
catch (err){
    console.log(err);
}
}
// prasanth father
// yawar brother
//  rathika mother
socket.on('file-received', (filename,url,time,data) => {
    console.log('received---->',filename,url,time)
    const decodeToken=parseJwt(token)
    if(data.groupid===localStorage.getItem('groupid') || data.groupid===decodeToken.id && data.userId===localStorage.getItem('groupid')){
        displayFile(filename,url,time,'msg')
    }else{
        console.log('its not from file received')
    }
    
  });

function displayFile(filename, url,time,id) {
    const msgs = document.getElementById(id);
    const fileExtension = filename.split('.').pop().toLowerCase();
    console.log(fileExtension)
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedMinutes = String(minutes).padStart(2, '0');
    const amOrPm = hours >= 12 ? 'PM' : 'AM';

    switch (fileExtension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
        case 'jfif':
            if(id!=='msg'){
                msgs.innerHTML=`<div class="file-container floatright">
                                <div class="sender-name text-success">you</div>
                                <img src="${url}" style="width:40vw;height:auto" class="message-text" alt="${filename}">
                                <div class="timestamp text-primary">${hours %12}:${formattedMinutes} ${amOrPm}</div>
                            </div>`+msgs.innerHTML
            }else{
                msgs.innerHTML+=`<div class="file-container floatright">
                                <div class="sender-name text-success">you</div>
                                <img src="${url}" style="width:40vw;height:auto" class="message-text" alt="${filename}">
                                <div class="timestamp text-primary">${hours %12}:${formattedMinutes} ${amOrPm}</div>
                            </div>`

            }
            // fileViewer.innerHTML = `<img src="${url}" alt="${filename}" />`;
            break;

        case 'mp4':
        case 'avi':
        case 'mov':
        case 'wmv':
            msgs.innerHTML+=`<div class="file-container floatright">
                            <div class="sender-name text-success">you</div>
                            <video controls>
                <source src="${url}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
                            <div class="timestamp text-primary">${hours %12}:${formattedMinutes} ${amOrPm}</div>
                        </div>`
            // msgs.innerHTML = `<video controls>
            //     <source src="${url}" type="video/mp4">
            //     Your browser does not support the video tag.
            // // </video>`
            break;
        case 'pdf':
            msgs.innerHTML+=`<div class="file-container floatright">
            <div class="sender-name text-success">you</div>
            <iframe src="${url}" width="60vw" height="auto"></iframe>
            <div class="timestamp text-primary">${hours %12}:${formattedMinutes} ${amOrPm}</div>
        </div>`
            // fileViewer.innerHTML = `<iframe src="${url}" width="100%" height="600"></iframe>`;
            break;
        default:
            msgs.innerHTML+=`<div class="file-container floatright">
                            <div class="sender-name text-success">you</div>
                            <a class="message-text" href="${url}" target="_self">
  ${filename}
</a><div class="timestamp text-primary">${hours %12}:${formattedMinutes} ${amOrPm}</div>
                        </div>`
            break;
    }
}

// function downloadFile(url) {
//     const link = document.createElement("a");
//     link.href = url;
//     link.target = "_blank";
//     link.download = url.substring(url.lastIndexOf("/") + 1);
//     link.click();
// }
