const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ejs = require('ejs');
const path = require('path')

const ROOMS = [
    {id: "frontend", label: "Frontend programozás"},
    {id: "backend", label: "Backend programozás"},
    {id: "desktop", label: "Asztali alkalmazás fejlesztés"},
    {id: "database", label: "Adatbázis kezelés"},
    {id: "others", label: "egyéb témák"},
]
const ERRORS ={
    missingFields: "Hiányzó adatok"
}


app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    const {error = '',nickname = '', room = ''} = req.query
    res.render('index',{rooms: ROOMS, error: ERRORS[error],nickname,room});
})
app.get('/main', (req, res) => {
    const {nickname, room} = req.query
    if(!nickname || !room){
        return res.redirect(`/?error=missingFields&nickname=${nickname}&room=${room}`)
    }
    const chatConfig={
        nickname,
        roomId: room,
        roomLabel: getRoomById(room)
    }
    res.render('main', {chatConfig});
})

const getRoomById = (roomId)=>{return ROOMS.find((room) => room.id === roomId).label}

io.on('connection', (socket) => {
    console.log(`Új felhasználó csatlakozott: ${socket.id}`);

    socket.on('join-room', ({ nickname, roomId }) => {
        socket.join(roomId);

        socket.to(roomId).emit(
            'system-message',
            `${nickname} csatlakozott a beszélgetéshez`
        );
    });
    socket.on('leave-room', ({nickname, roomId})=>{
         socket.to(roomId).emit(
            'system-message',
            `${nickname} kilépett a beszélgetésből`
        );
        socket.leave(roomId)
    })
});


server.listen(3000, ()=>{
    console.log('http://localhost:3000')
})