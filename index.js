var express = require('express');
var socket  = require('socket.io');
var mongoose=require('mongoose');
var bodyParser = require("body-parser");
var application = express();
let usernamee='';
var server = application.listen(5004,function(){
	console.log('Your Server Is runing at http:/localhost:5000');
});
application.use(bodyParser.json());
application.use(express.static('public'))
application.use(bodyParser.urlencoded({
    extended: true
}));
application.use(express.static('public'));

var sio = socket(server);


 mongoose.connect('mongodb+srv://ilyassmandour:ilyass123@firstip.3di9lrb.mongodb.net/users?retryWrites=true&w=majority', {
     useNewUrlParser: true,
     useUnifiedTopology: true
});
var db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));
application.post('/sign_up',(req,res)=>{
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;
    var phone=req.body.phone;
    var data={
        "name":name,
        "email":email,
        "password":password,
        "phone":phone

    }
    db.collection('users').insertOne(data, (err, collection) => {
        if (err) throw err;
        console.log("Record Inserted Successfully");
    });
    return res.redirect('index.html');
});

application.post("/login", async (request, response) => {
    try {
        //adding
        const username = request.body.username;
        const password = request.body.password;
        const usermail = db.collection('users').findOne({ email: username }, (err, res) => {
            if (res == null) {
                response.send("Invalid information!❌❌❌! Please create account first");
            }
            else if (err) throw err;

            if (res.password === password) {
                usernamee=res.name;
                return response.redirect('chat.html');
               
                
            }
            else {
                response.send("Invalid Password!❌❌❌");
            }
            

        }); 
       
    }catch(error){
        console.log('invalid infomration');
    }
}
);

const nomsParSalle = {};   
sio.on('connection',function(visitor){

    db.collection('users').findOne({  name: usernamee }, (err, res) => {                
    if(res){
        visitor.on('joinRoom', function(room) {
            // Ajouter le nom du visiteur à la salle correspondante
    if (!nomsParSalle[room]) {
        nomsParSalle[room] = [];
      }
      nomsParSalle[room].push(res.name);
            // Rejoindre la salle correspondante
            visitor.join(room);
            visitor.broadcast.to(room).emit('new_lo',res.name);
            visitor.emit('currentUser', res.name);
            sio.sockets.in(room).emit('nav', nomsParSalle[room]);
        
        visitor.on('message',function(data){
        sio.to(room).emit('new_msg',{
            user:res.name,
            message:data.message,
            });
    });
            console.log('user join to '+room);
            visitor.on('bo',function(data){
                visitor.broadcast.to(room).emit('new_bo',res.name);
            });
            
            visitor.on('disconnect',function(){
                let index = nomsParSalle[room].indexOf(res.name);
                if (index !== -1) {
                    nomsParSalle[room].splice(index, 1);
                }
               visitor.broadcast.to(room).emit('disco',res.name);
           });
          });
        
  
    
   
}
   else{
    console.log('user not found');
   }
   
});
});
    
