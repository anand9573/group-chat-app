async function senddata(e){
    try{
        e.preventDefault();
        const Name = document.getElementById('name').value;
    const Email= document.getElementById('email').value;
    const Number = document.getElementById('number').value;
    const Password = document.getElementById('password').value;
        const data={
            Name:Name,
            Email:Email,
            Mobile:Number,
            Password:Password,
        }
        const res=await axios.post('http://localhost:3000/user/signup',data);
        console.log('Response status:', res.status);
console.log('Response data:', res.data);
         if(res.status===201){
                alert(res.data.message)
                window.location.href = "../../views/login.html";
            }
    }catch(err){
        const sleep = m => new Promise(r => setTimeout(r, m))
            if(err.response.status===409){
                    const submit=document.getElementById('submit')
                    const h6=document.createElement('h6')
                    h6.textContent+=err.response.data.message;
                    submit.before(h6);
                    h6.style.color="red";
                    await sleep(4000);
                    h6.remove()
            }else{
                document.body.innerHTML+=`<h3 style='color:red'>something went wrong try registering after sometime</h3>`
            }
    }
}