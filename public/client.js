var socket = io.connect('http://localhost:5004');
//var user=document.getElementById('user');
var message=document.getElementById('message');
var send=document.querySelector('#send');
var chat=document.querySelector('.chat');
var members=document.querySelector('.members');

var broad=document.getElementById('broad');


socket.on('new_lo',function(data){
    
    chat.innerHTML+='<p class="notification">'+data+' join the group<time>'+getCurrentTime()+' </time></p>';
    window.scroll({
        top:document.body.scrollHeight,
        behavior:'smooth',
       });
}
);

send.onclick=function(){
    
   socket.emit('message',{
    
    message:message.value,
    
   });
   message.value='';
   chat.scrollTop = chat.scrollHeight;
   
   window.scroll({
    top:document.body.scrollHeight,
    behavior:'smooth',
   });
   

   

   
};
let currentUser;
function getCurrentTime() {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return hours + ":" + minutes;
  }
// Écouter l'événement 'currentUser' émis depuis le serveur
socket.on('currentUser', (data) => {
  currentUser = data;
  console.log('currentUser reçu : ' + currentUser);
});
let noms=[];
socket.on('nav',function(data){
    members.innerHTML='';
    for (let i = 0; i < data.length; i++) {
        noms[i]=data[i];
        members.innerHTML+= noms[i] + ',';
      }
     
}

);


socket.on('new_msg',function(data){ 
    if (data.user === currentUser) {
       
        chat.innerHTML += '<li class="self"><div class="msg"><div class="user">' + data.user + '</div><p>' + data.message + '</p><time>'+getCurrentTime()+' </time></div></li>';
      } else {
        
        chat.innerHTML += '<li class="other"><div class="msg"><div class="user">' + data.user + '</div><p>' + data.message + '</p><time>'+getCurrentTime()+' </time></div></li>';
      }
      chat.scrollTop = chat.scrollHeight;
      
       
       window.scroll({
        top:document.body.scrollHeight,
        behavior:'smooth',
       });
       broad.style.display='none';

});
message.onkeyup=function(){
socket.emit('bo','X');
    console.log("hi");
 
};

socket.on('new_bo',function(data){
    broad.style.display='inline-block'
    broad.innerHTML='<strong>'+data+'</strong> en train d ecrire <img src="icon.gif">'

});
  
socket.on('disco',function(data){
    let index = noms.indexOf(data);
        noms.splice(index, 1);
        members.innerHTML='';
        for (let i = 0; i < noms.length; i++) {
            members.innerHTML+=noms[i]+' ,';
          }   
    chat.innerHTML+='<p class="notification">'+data+' left the group<time>'+getCurrentTime()+' </time></p>';
    window.scroll({
        top:document.body.scrollHeight,
        behavior:'smooth',
       });
       
       });
       menu
var btnen=document.getElementById('btnen');
var chatroom=document.getElementById('chatroom');
var menu=document.getElementById('menu');
var rooms=document.getElementById('rooms');

btnen.onclick=function(){
  chatroom.style.display='block';
  menu.style.display='none';
  const room = rooms.value;
  // Émettre un événement vers le serveur pour rejoindre la salle correspondante
  socket.emit('joinRoom', room);
}
  
  

