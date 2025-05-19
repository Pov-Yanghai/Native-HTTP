// server.js
const http = require('http');
const fs = require('fs'); //file system for write and read
const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    console.log(`Received ${method} request for ${url}`);

    if (url === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Welcome to the Home Page');
    }

    if (url === '/contact' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <form method="POST" action="/contact">
            <input type="text" name="name" placeholder="Your name" />
            <button type="submit">Submit</button>
          </form>
        `);
        return;
    }

    if (url === '/contact' && method === 'POST') {
        // Implement form submission handling
        let body = '';
         //  Listen for 'data' events to receive form chunks
    req.on('data', chunk => {
        body += chunk.toString(); // Convert Buffer to string and add to body
    });

    // all data is received, handle it
    req.on('end', () => {
        //  Parse the body (key=value)
        const parsedData = new URLSearchParams(body);
        const name = parsedData.get('name'); // Get the 'name' field value

        // Check if name is empty
        if (!name || name.trim() === '') { //  if name is empty return error message
            res.writeHead(400, { 'Content-Type': 'text/html' });
            return res.end('<h1>Name field is required!</h1>');
        }

        console.log('Received name:', name); // Log the name

        //Save the name to submissions.txt
        const fs = require('fs');
        fs.appendFile('submissions.txt', name + '\n', (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Something went wrong.');
            }

            // Send back confirmation HTML page
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <h1>Thank you, ${name}!</h1>
                <p>Your submission has been saved.</p>
            `);
        });
    });
    }

    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
