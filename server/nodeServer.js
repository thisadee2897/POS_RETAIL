const app = require('./app');
const http = require('http').createServer(app);
const port = process.env.PORT || 5002;
http.listen(port,()=>{
    console.log('Server is runnig on port : ' + port);
});


