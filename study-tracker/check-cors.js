fetch('https://study-yxi5.onrender.com/chat', { 
    method: 'OPTIONS', 
    headers: { 
        'Origin': 'null', 
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
    } 
}).then(r => { 
    console.log("Status:", r.status); 
    console.log("Allow-Origin:", r.headers.get('access-control-allow-origin')); 
}).catch(console.error);
