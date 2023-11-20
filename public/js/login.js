async function login(e){
    try{
        e.preventDefault()
        const Email= document.getElementById('email').value;
        const Password = document.getElementById('password').value;
        const data={
            Email,
            Password
        }
        const res=await axios.post('http://localhost:3000/user/login',data);
        if(res.status===201){
            console.log(res.data)
            localStorage.setItem('token',res.data.tokenID);
            localStorage.setItem('userid',res.data.userID);
            alert('user logged in successfully')
            window.location.href = "http://localhost:3000/groupchat.html";
        }
            }catch(err){
                console.log(err)
                    const sleep = m => new Promise(r => setTimeout(r, m))
                    const submit=document.getElementById('submit')
                    const h6=document.createElement('h6')
                    h6.textContent+=`${err.response.data.message}`
                    h6.style.color='red'
                    submit.before(h6)
                    await sleep(4000);
                    h6.remove()
            }
}